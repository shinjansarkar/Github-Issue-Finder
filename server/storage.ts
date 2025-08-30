import { type Issue, type InsertIssue, type SavedIssue, type InsertSavedIssue, type SearchFilters, type InsertSearchFilters } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Issues
  getIssues(filters?: Partial<SearchFilters>): Promise<Issue[]>;
  getIssue(id: string): Promise<Issue | undefined>;
  createIssue(issue: InsertIssue): Promise<Issue>;
  updateIssue(id: string, issue: Partial<Issue>): Promise<Issue | undefined>;
  deleteIssue(id: string): Promise<boolean>;
  
  // Saved Issues
  getSavedIssues(): Promise<SavedIssue[]>;
  saveIssue(savedIssue: InsertSavedIssue): Promise<SavedIssue>;
  unsaveIssue(issueId: string): Promise<boolean>;
  isIssueSaved(issueId: string): Promise<boolean>;
  
  // Search Filters
  getSearchFilters(): Promise<SearchFilters | undefined>;
  updateSearchFilters(filters: InsertSearchFilters): Promise<SearchFilters>;
}

export class MemStorage implements IStorage {
  private issues: Map<string, Issue>;
  private savedIssues: Map<string, SavedIssue>;
  private searchFilters: SearchFilters | undefined;

  constructor() {
    this.issues = new Map();
    this.savedIssues = new Map();
    this.searchFilters = undefined;
  }

  async getIssues(filters?: Partial<SearchFilters>): Promise<Issue[]> {
    let issues = Array.from(this.issues.values());
    
    if (filters) {
      if (filters.languages && filters.languages.length > 0) {
        issues = issues.filter(issue => 
          issue.language && filters.languages!.includes(issue.language.toLowerCase())
        );
      }
      
      if (filters.difficulties && filters.difficulties.length > 0) {
        console.log("Filtering by difficulties:", filters.difficulties);
        console.log("Available issues with difficulties:", issues.map(issue => ({ id: issue.id, difficulty: issue.difficulty })));
        issues = issues.filter(issue => 
          issue.difficulty && filters.difficulties!.includes(issue.difficulty.toLowerCase())
        );
        console.log("Filtered issues count:", issues.length);
      }
      
      if (filters.labels && filters.labels.length > 0) {
        issues = issues.filter(issue => 
          issue.labels.some(label => 
            filters.labels!.some(filterLabel => 
              label.toLowerCase().includes(filterLabel.toLowerCase())
            )
          )
        );
      }
      
      if (filters.query) {
        const query = filters.query.toLowerCase();
        issues = issues.filter(issue => 
          issue.title.toLowerCase().includes(query) ||
          (issue.body && issue.body.toLowerCase().includes(query)) ||
          issue.repository.toLowerCase().includes(query)
        );
      }
    }
    
    // Sort issues
    const sortBy = filters?.sort || "updated";
    issues.sort((a, b) => {
      switch (sortBy) {
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "comments":
          return b.comments - a.comments;
        case "updated":
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
    
    return issues;
  }

  async getIssue(id: string): Promise<Issue | undefined> {
    return this.issues.get(id);
  }

  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const id = randomUUID();
    const issue: Issue = { ...insertIssue, id };
    this.issues.set(id, issue);
    return issue;
  }

  async updateIssue(id: string, updateData: Partial<Issue>): Promise<Issue | undefined> {
    const issue = this.issues.get(id);
    if (!issue) return undefined;
    
    const updatedIssue = { ...issue, ...updateData };
    this.issues.set(id, updatedIssue);
    return updatedIssue;
  }

  async deleteIssue(id: string): Promise<boolean> {
    return this.issues.delete(id);
  }

  async getSavedIssues(): Promise<SavedIssue[]> {
    return Array.from(this.savedIssues.values());
  }

  async saveIssue(insertSavedIssue: InsertSavedIssue): Promise<SavedIssue> {
    const id = randomUUID();
    const savedIssue: SavedIssue = { 
      ...insertSavedIssue, 
      id,
      savedAt: new Date()
    };
    this.savedIssues.set(id, savedIssue);
    return savedIssue;
  }

  async unsaveIssue(issueId: string): Promise<boolean> {
    const savedIssues = Array.from(this.savedIssues.entries());
    const savedIssue = savedIssues.find(([_, saved]) => saved.issueId === issueId);
    
    if (savedIssue) {
      return this.savedIssues.delete(savedIssue[0]);
    }
    return false;
  }

  async isIssueSaved(issueId: string): Promise<boolean> {
    const savedIssues = Array.from(this.savedIssues.values());
    return savedIssues.some(saved => saved.issueId === issueId);
  }

  async getSearchFilters(): Promise<SearchFilters | undefined> {
    return this.searchFilters;
  }

  async updateSearchFilters(filters: InsertSearchFilters): Promise<SearchFilters> {
    const id = this.searchFilters?.id || randomUUID();
    this.searchFilters = { ...filters, id };
    return this.searchFilters;
  }
}

export const storage = new MemStorage();
