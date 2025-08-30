import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSearchFiltersSchema, insertSavedIssueSchema } from "@shared/schema";
import { z } from "zod";

const GITHUB_API_KEY = process.env.GITHUB_API_KEY || process.env.GITHUB_TOKEN || "";

interface GitHubIssue {
  id: number;
  title: string;
  body: string | null;
  html_url: string;
  repository_url: string;
  labels: Array<{ name: string; color: string }>;
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  repository?: {
    full_name: string;
    language: string | null;
  };
}

interface GitHubSearchResponse {
  items: GitHubIssue[];
  total_count: number;
}

function mapGitHubIssueToIssue(githubIssue: GitHubIssue, repoFullName: string, language: string | null) {
  const labels = githubIssue.labels.map(label => label.name);
  
  // Determine difficulty based on labels
  let difficulty = "intermediate";
  if (labels.some(label => 
    label.toLowerCase().includes("good first issue") || 
    label.toLowerCase().includes("good-first-issue") ||
    label.toLowerCase().includes("first-timers-only") ||
    label.toLowerCase().includes("first-time") ||
    label.toLowerCase().includes("newcomer") ||
    label.toLowerCase().includes("beginner") ||
    label.toLowerCase().includes("easy")
  )) {
    difficulty = "easy";
  } else if (labels.some(label => 
    label.toLowerCase().includes("advanced") ||
    label.toLowerCase().includes("expert") ||
    label.toLowerCase().includes("hard") ||
    label.toLowerCase().includes("difficult")
  )) {
    difficulty = "advanced";
  }

  return {
    id: githubIssue.id.toString(),
    title: githubIssue.title,
    body: githubIssue.body || "",
    url: githubIssue.html_url,
    repository: repoFullName,
    repositoryUrl: `https://github.com/${repoFullName}`,
    language: language?.toLowerCase() || "unknown",
    labels,
    state: githubIssue.state,
    comments: githubIssue.comments,
    createdAt: githubIssue.created_at,
    updatedAt: githubIssue.updated_at,
    difficulty,
    isSaved: "false"
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Search GitHub issues
  app.get("/api/issues", async (req, res) => {
    try {
      const { 
        languages = [], 
        difficulties = [], 
        labels = [], 
        sort = "updated",
        query = "",
        page = "1",
        per_page = "10"
      } = req.query;

      // Build GitHub API search query
      let searchQuery = "state:open";
      
      if (query && typeof query === "string") {
        searchQuery += ` ${query}`;
      }

      // Add language filters
      if (Array.isArray(languages) && languages.length > 0) {
        const langQuery = languages.map(lang => `language:${lang}`).join(" ");
        searchQuery += ` (${langQuery})`;
      } else if (typeof languages === "string" && languages) {
        searchQuery += ` language:${languages}`;
      }

      // Add label filters
      const allLabels = [...(Array.isArray(labels) ? labels : labels ? [labels] : [])];
      
      // Add difficulty-based labels
      if (Array.isArray(difficulties) && difficulties.length > 0) {
        difficulties.forEach(diff => {
          if (diff === "easy") {
            allLabels.push("good first issue", "beginner", "easy", "good-first-issue", "first-timers-only", "first-time", "newcomer");
          } else if (diff === "intermediate") {
            allLabels.push("intermediate", "medium", "moderate");
          } else if (diff === "advanced") {
            allLabels.push("advanced", "expert", "hard", "difficult");
          }
        });
      } else if (typeof difficulties === "string" && difficulties) {
        if (difficulties === "easy") {
          allLabels.push("good first issue", "beginner", "easy", "good-first-issue", "first-timers-only", "first-time", "newcomer");
        } else if (difficulties === "intermediate") {
          allLabels.push("intermediate", "medium", "moderate");
        } else if (difficulties === "advanced") {
          allLabels.push("advanced", "expert", "hard", "difficult");
        }
      }

      // Add labels to search query
      if (allLabels.length > 0) {
        // Use space-separated labels for OR logic in GitHub search
        const labelQuery = allLabels.map(label => `label:"${label}"`).join(" ");
        searchQuery += ` (${labelQuery})`;
      }

      // Debug: Log the search query
      console.log("GitHub search query:", searchQuery);
      console.log("Filters:", { languages, difficulties, labels, sort, query, page, per_page });

      // GitHub API search
      const githubUrl = new URL("https://api.github.com/search/issues");
      githubUrl.searchParams.set("q", searchQuery);
      githubUrl.searchParams.set("sort", sort === "created" ? "created" : sort === "comments" ? "comments" : "updated");
      githubUrl.searchParams.set("order", "desc");
      githubUrl.searchParams.set("page", page.toString());
      githubUrl.searchParams.set("per_page", per_page.toString());

      const headers: Record<string, string> = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Issue-Finder"
      };

      if (GITHUB_API_KEY) {
        headers["Authorization"] = `token ${GITHUB_API_KEY}`;
      }

      const response = await fetch(githubUrl.toString(), { headers });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data: GitHubSearchResponse = await response.json();
      
      // If no results found and we're searching for easy issues, try a broader search
      const difficultiesArr = Array.isArray(difficulties)
        ? difficulties as string[]
        : typeof difficulties === "string" && difficulties
          ? [difficulties as string]
          : [];
      if (
        data.total_count === 0 &&
        difficulties &&
        difficultiesArr.includes("easy")
      ) {
        console.log("No results found with labels, trying broader search for easy issues...");

        // Try a broader search for easy issues
        const broaderSearchQuery = searchQuery.replace(/\(label:"[^"]*"(\s+label:"[^"]*")*\)/, "");
        const broaderUrl = new URL("https://api.github.com/search/issues");
        broaderUrl.searchParams.set("q", broaderSearchQuery + " good first issue");
        broaderUrl.searchParams.set("sort", sort === "created" ? "created" : sort === "comments" ? "comments" : "updated");
        broaderUrl.searchParams.set("order", "desc");
        broaderUrl.searchParams.set("page", page.toString());
        broaderUrl.searchParams.set("per_page", per_page.toString());

        const broaderResponse = await fetch(broaderUrl.toString(), { headers });
        if (broaderResponse.ok) {
          const broaderData: GitHubSearchResponse = await broaderResponse.json();
          console.log("Broader search found", broaderData.total_count, "issues");
          data.items = broaderData.items;
          data.total_count = broaderData.total_count;
        }
      }
      
      // Fetch repository details for each issue to get language info
      const issuesWithDetails = await Promise.all(
        data.items.map(async (issue) => {
          try {
            const repoUrl = issue.repository_url;
            const repoResponse = await fetch(repoUrl, { headers });
            
            if (repoResponse.ok) {
              const repoData = await repoResponse.json();
              return mapGitHubIssueToIssue(issue, repoData.full_name, repoData.language);
            } else {
              // Fallback: extract repo name from URL
              const repoName = issue.html_url.split("/").slice(3, 5).join("/");
              return mapGitHubIssueToIssue(issue, repoName, null);
            }
          } catch (error) {
            console.error("Error fetching repo details:", error);
            const repoName = issue.html_url.split("/").slice(3, 5).join("/");
            return mapGitHubIssueToIssue(issue, repoName, null);
          }
        })
      );

      // Check which issues are saved
      const savedIssues = await storage.getSavedIssues();
      const savedIssueIds = new Set(savedIssues.map(saved => saved.issueId));

      const finalIssues = issuesWithDetails.map(issue => ({
        ...issue,
        isSaved: savedIssueIds.has(issue.id) ? "true" : "false"
      }));

      // Debug: Log the final issues and their difficulties
      console.log("Final issues count:", finalIssues.length);
      console.log("Issues with difficulties:", finalIssues.map(issue => ({ 
        id: issue.id, 
        title: issue.title.substring(0, 50) + "...", 
        difficulty: issue.difficulty,
        labels: issue.labels 
      })));

      res.json({
        issues: finalIssues,
        total_count: data.total_count,
        page: parseInt(page.toString()),
        per_page: parseInt(per_page.toString())
      });

    } catch (error) {
      console.error("Error fetching issues:", error);
      res.status(500).json({ 
        message: "Failed to fetch issues from GitHub",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Save an issue
  app.post("/api/issues/:id/save", async (req, res) => {
    try {
      const { id } = req.params;
      
      const alreadySaved = await storage.isIssueSaved(id);
      if (alreadySaved) {
        return res.status(400).json({ message: "Issue already saved" });
      }

      const savedIssue = await storage.saveIssue({ issueId: id });
      res.json(savedIssue);
    } catch (error) {
      console.error("Error saving issue:", error);
      res.status(500).json({ message: "Failed to save issue" });
    }
  });

  // Unsave an issue
  app.delete("/api/issues/:id/save", async (req, res) => {
    try {
      const { id } = req.params;
      
      const success = await storage.unsaveIssue(id);
      if (!success) {
        return res.status(404).json({ message: "Issue not found in saved list" });
      }

      res.json({ message: "Issue unsaved successfully" });
    } catch (error) {
      console.error("Error unsaving issue:", error);
      res.status(500).json({ message: "Failed to unsave issue" });
    }
  });

  // Get saved issues
  app.get("/api/saved-issues", async (req, res) => {
    try {
      const savedIssues = await storage.getSavedIssues();
      res.json(savedIssues);
    } catch (error) {
      console.error("Error fetching saved issues:", error);
      res.status(500).json({ message: "Failed to fetch saved issues" });
    }
  });

  // Update search filters
  app.post("/api/filters", async (req, res) => {
    try {
      const validatedFilters = insertSearchFiltersSchema.parse(req.body);
      const filters = await storage.updateSearchFilters(validatedFilters);
      res.json(filters);
    } catch (error) {
      console.error("Error updating filters:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid filter data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update filters" });
      }
    }
  });

  // Get search filters
  app.get("/api/filters", async (req, res) => {
    try {
      const filters = await storage.getSearchFilters();
      res.json(filters || {
        languages: [],
        difficulties: [],
        labels: [],
        sort: "updated",
        query: ""
      });
    } catch (error) {
      console.error("Error fetching filters:", error);
      res.status(500).json({ message: "Failed to fetch filters" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
