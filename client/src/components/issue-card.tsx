import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, ExternalLink, GitBranch, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Issue } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface IssueCardProps {
  issue: Issue;
}

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    case "intermediate":
      return "bg-gradient-to-r from-orange-500 to-yellow-500 text-white";
    case "advanced":
      return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
    default:
      return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
  }
};

const getLabelColor = (label: string) => {
  const labelLower = label.toLowerCase();
  if (labelLower.includes("good first issue") || labelLower.includes("beginner")) return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
  if (labelLower.includes("bug")) return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
  if (labelLower.includes("enhancement") || labelLower.includes("feature")) return "bg-gradient-to-r from-green-600 to-teal-600 text-white";
  if (labelLower.includes("documentation")) return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
  if (labelLower.includes("help wanted")) return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white";
  if (labelLower.includes("priority")) return "bg-gradient-to-r from-orange-500 to-yellow-500 text-white";
  if (labelLower.includes("hacktoberfest")) return "bg-gradient-to-r from-pink-500 to-rose-500 text-white";
  return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
};

const getLanguageColorClass = (language?: string) => {
  if (!language) return "language-unknown";
  return `language-${language.toLowerCase().replace(/[^a-z]/g, '')}`;
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 30) {
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export default function IssueCard({ issue }: IssueCardProps) {
  const [isSaved, setIsSaved] = useState(issue.isSaved === "true");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveIssueMutation = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        return apiRequest("DELETE", `/api/issues/${issue.id}/save`);
      } else {
        return apiRequest("POST", `/api/issues/${issue.id}/save`);
      }
    },
    onSuccess: () => {
      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Issue unsaved" : "Issue saved",
        description: isSaved ? "Removed from your saved issues" : "Added to your saved issues",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/issues"] });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-issues"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save issue",
        variant: "destructive",
      });
    },
  });

  const handleSaveIssue = () => {
    saveIssueMutation.mutate();
  };

  const handleViewIssue = () => {
    window.open(issue.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="hover:border-blue-500/60 transition-all duration-300 bg-gray-900 backdrop-blur-sm border-gray-800 shadow-lg hover:shadow-blue-500/20 hover:shadow-xl w-full sm:w-[900px] max-w-[900px] mx-auto overflow-hidden" data-testid={`card-issue-${issue.id}`}
      style={{ wordBreak: 'break-word' }}>
      <CardContent className="p-3 sm:p-4 lg:p-5">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-2 sm:gap-4">
          <div className="flex-1 w-full lg:w-auto">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
              {issue.difficulty && (
                <Badge 
                  className={cn("font-medium px-3 py-1", getDifficultyColor(issue.difficulty))}
                  data-testid={`badge-difficulty-${issue.difficulty}`}
                >
                  {issue.difficulty.charAt(0).toUpperCase() + issue.difficulty.slice(1)}
                </Badge>
              )}
              {issue.labels && issue.labels.slice(0, 3).map((label, index) => (
                <Badge 
                  key={index}
                  className={cn("text-xs font-medium", getLabelColor(label))}
                  data-testid={`badge-label-${label.replace(/\s+/g, '-')}`}
                >
                  {label}
                </Badge>
              ))}
              {issue.labels && issue.labels.length > 3 && (
                <Badge className="text-xs bg-gradient-to-r from-gray-500 to-slate-500 text-white">
                  +{issue.labels.length - 3} more
                </Badge>
              )}
            </div>
            <h3 
              className="text-lg font-semibold text-foreground mb-2 hover:text-primary cursor-pointer break-words"
              onClick={handleViewIssue}
              data-testid={`text-issue-title-${issue.id}`}
            >
              {issue.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 break-words line-clamp-2" data-testid={`text-issue-description-${issue.id}`}> 
              {issue.body || "No description provided."}
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <GitBranch className="h-3 w-3" />
                <span data-testid={`text-repository-${issue.id}`}>{issue.repository}</span>
              </div>
              {issue.language && (
                <div className="flex items-center space-x-1">
                  <div className={cn("w-3 h-3 rounded-full", getLanguageColorClass(issue.language))} />
                  <span data-testid={`text-language-${issue.id}`}> 
                    {issue.language.charAt(0).toUpperCase() + issue.language.slice(1)}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span data-testid={`text-comments-${issue.id}`}>{issue.comments}</span>
              </div>
              <span data-testid={`text-updated-${issue.id}`}>{formatTimeAgo(issue.updatedAt)}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 w-full sm:w-auto lg:ml-4">
            <Button 
              onClick={handleViewIssue}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transition-all duration-200 w-full sm:w-auto min-w-[120px]"
              data-testid={`button-view-${issue.id}`}
            >
              <span>View Issue</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
