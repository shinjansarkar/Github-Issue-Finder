export interface GitHubApiResponse {
  issues: Array<{
    id: string;
    title: string;
    body: string;
    url: string;
    repository: string;
    repositoryUrl: string;
    language: string;
    labels: string[];
    state: string;
    comments: number;
    createdAt: string;
    updatedAt: string;
    difficulty: string;
    isSaved: string;
  }>;
  total_count: number;
  page: number;
  per_page: number;
}

export interface SearchFilters {
  languages?: string[];
  difficulties?: string[];
  labels?: string[];
  sort?: string;
  query?: string;
  page?: number;
  per_page?: number;
}

export async function searchIssues(filters: SearchFilters = {}): Promise<GitHubApiResponse> {
  const searchParams = new URLSearchParams();
  
  if (filters.languages && filters.languages.length > 0) {
    filters.languages.forEach(lang => searchParams.append('languages', lang));
  }
  
  if (filters.difficulties && filters.difficulties.length > 0) {
    filters.difficulties.forEach(diff => searchParams.append('difficulties', diff));
  }
  
  if (filters.labels && filters.labels.length > 0) {
    filters.labels.forEach(label => searchParams.append('labels', label));
  }
  
  if (filters.sort) {
    searchParams.set('sort', filters.sort);
  }
  
  if (filters.query) {
    searchParams.set('query', filters.query);
  }
  
  if (filters.page) {
    searchParams.set('page', filters.page.toString());
  }
  
  if (filters.per_page) {
    searchParams.set('per_page', filters.per_page.toString());
  }

  const response = await fetch(`/api/issues?${searchParams.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch issues: ${response.status} ${errorText}`);
  }

  return response.json();
}
