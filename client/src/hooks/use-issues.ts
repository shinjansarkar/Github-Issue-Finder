import { useQuery } from "@tanstack/react-query";
import { searchIssues, type SearchFilters } from "@/lib/github-api";

export function useIssues(filters: SearchFilters, page: number = 1) {
  return useQuery({
    queryKey: ["/api/issues", filters, page],
    queryFn: () => searchIssues({ ...filters, page, per_page: 10 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
