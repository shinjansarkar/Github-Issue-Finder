import { useState } from "react";
import { useIssues } from "@/hooks/use-issues";
import SearchHeader from "@/components/search-header";
import FiltersSidebar from "@/components/filters-sidebar";
import IssueCard from "@/components/issue-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Pagination } from "@/components/ui/pagination";
import { Loader2, Search, X, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Filters {
  languages: string[];
  difficulties: string[];
  labels: string[];
  sort: string;
  query: string;
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>({
    languages: [],
    difficulties: [],
    labels: [],
    sort: "updated",
    query: ""
  });
  
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useIssues(filters, page);
  const isMobile = useIsMobile();

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const toggleArrayFilter = (key: "languages" | "difficulties" | "labels", value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
    setPage(1);
  };

  const removeFilter = (key: keyof Filters, value?: string) => {
    if (key === "query") {
      updateFilter(key, "");
    } else if (value && (key === "languages" || key === "difficulties" || key === "labels")) {
      toggleArrayFilter(key, value);
    }
  };

  const clearAllFilters = () => {
    setFilters({
      languages: [],
      difficulties: [],
      labels: [],
      sort: "updated",
      query: ""
    });
    setPage(1);
  };



  const getActiveFilters = () => {
    const active: Array<{ key: keyof Filters; value: string; label: string }> = [];
    
    if (filters.query) {
      active.push({ key: "query", value: filters.query, label: `"${filters.query}"` });
    }
    
    filters.languages.forEach(lang => {
      active.push({ key: "languages", value: lang, label: lang.charAt(0).toUpperCase() + lang.slice(1) });
    });
    
    filters.difficulties.forEach(diff => {
      active.push({ key: "difficulties", value: diff, label: diff.charAt(0).toUpperCase() + diff.slice(1) });
    });
    
    filters.labels.forEach(label => {
      active.push({ key: "labels", value: label, label });
    });
    
    return active;
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      <SearchHeader 
        query={filters.query}
        onQueryChange={(query) => updateFilter("query", query)}
      />
      
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-80 flex-shrink-0">
            <FiltersSidebar
              filters={filters}
              onFilterChange={updateFilter}
              onArrayFilterToggle={toggleArrayFilter}
              onClearFilters={clearAllFilters}
            />
          </div>
        )}
        
        <main className="flex-1 bg-transparent p-3 sm:p-4 lg:p-6 min-w-0">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              {/* Mobile Filter Button */}
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none hover:from-blue-700 hover:to-purple-700 w-fit"
                      data-testid="button-mobile-filters"
                    >
                      <Filter className="h-4 w-4" />
                      <span>Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-sm sm:w-80 p-0">
                    <FiltersSidebar
                      filters={filters}
                      onFilterChange={updateFilter}
                      onArrayFilterToggle={toggleArrayFilter}
                      onClearFilters={clearAllFilters}
                    />
                  </SheetContent>
                </Sheet>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent" data-testid="text-page-title">
                  GitHub Issues
                </h2>
                {data && (
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-fit"
                    data-testid="text-results-count"
                  >
                    {data.total_count} results
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Select value={filters.sort} onValueChange={(value) => updateFilter("sort", value)}>
                <SelectTrigger className="w-full sm:w-48 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none" data-testid="select-sort-order">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Recently updated</SelectItem>
                  <SelectItem value="created">Newest</SelectItem>
                  <SelectItem value="comments">Most commented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFilters().length > 0 && (
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              {getActiveFilters().map((filter, index) => (
                <Badge 
                  key={`${filter.key}-${filter.value}-${index}`}
                  className={`flex items-center space-x-2 px-3 py-2 text-white font-medium ${
                    filter.key === "difficulties" && filter.value === "easy" 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                      : filter.key === "difficulties" && filter.value === "intermediate"
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                      : filter.key === "difficulties" && filter.value === "advanced"
                      ? "bg-gradient-to-r from-red-500 to-pink-500"
                      : filter.key === "languages" 
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
                      : "bg-gradient-to-r from-purple-500 to-indigo-500"
                  }`}
                  data-testid={`badge-active-filter-${filter.key}-${filter.value}`}
                >
                  <span>{filter.label}</span>
                  <button 
                    className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
                    onClick={() => removeFilter(filter.key, filter.value)}
                    data-testid={`button-remove-filter-${filter.key}-${filter.value}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8 sm:py-12" data-testid="error-state">
              <div className="bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
                <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Error Loading Issues</h3>
                <p className="text-foreground/80 mb-6 max-w-md mx-auto">
                  {error instanceof Error ? error.message : "Failed to load issues from GitHub"}
                </p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 px-8 py-3"
                  data-testid="button-retry"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && page === 1 && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12" data-testid="loading-state">
              <div className="bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-700 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                  <span className="text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Loading issues...</span>
                </div>
              </div>
            </div>
          )}

          {/* Issues List */}
          {data && data.issues && (
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6" data-testid="issues-list">
              {data.issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {data && data.issues && data.issues.length === 0 && !isLoading && (
            <div className="text-center py-8 sm:py-12" data-testid="empty-state">
              <div className="bg-gray-900 p-6 sm:p-8 rounded-2xl border border-gray-700 backdrop-blur-sm max-w-md mx-auto">
                <div className="p-4 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-400 to-slate-400 bg-clip-text text-transparent">No issues found</h3>
                <p className="text-foreground/80 mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button 
                  onClick={clearAllFilters} 
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 px-8 py-3"
                  data-testid="button-clear-filters-empty"
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {data && data.issues && data.issues.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(data.total_count / 10)} // Assuming 10 items per page
              onPageChange={(newPage) => setPage(newPage)}
              isLoading={isLoading}
            />
          )}
        </main>
      </div>
    </div>
  );
}
