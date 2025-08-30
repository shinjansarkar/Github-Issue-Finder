import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Github, Bell, User } from "lucide-react";

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export default function SearchHeader({ query, onQueryChange }: SearchHeaderProps) {
  const [searchValue, setSearchValue] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onQueryChange(searchValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    // Debounced search - trigger search after user stops typing
    const timeoutId = setTimeout(() => {
      onQueryChange(e.target.value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Github className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" data-testid="text-app-title">
              Issues Explorer
            </h1>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-4 sm:mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search issues..."
              value={searchValue}
              onChange={handleInputChange}
              className="pl-10 bg-gray-900 border-gray-700 focus:ring-blue-500 focus:border-blue-400 text-white placeholder-gray-400"
              data-testid="input-search"
            />
          </form>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-800/50"
            data-testid="button-notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-800/50"
            data-testid="button-profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
