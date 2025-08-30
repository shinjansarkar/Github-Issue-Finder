import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Layers, Code, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Filters } from "@/pages/home";

interface FiltersSidebarProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: any) => void;
  onArrayFilterToggle: (key: "languages" | "difficulties" | "labels", value: string) => void;
  onClearFilters: () => void;
}

export default function FiltersSidebar({ 
  filters, 
  onArrayFilterToggle, 
  onClearFilters 
}: FiltersSidebarProps) {

  const difficultyOptions = [
    { value: "easy", label: "Easy", color: "bg-green-500 hover:bg-green-600" },
    { value: "intermediate", label: "Intermediate", color: "bg-orange-500 hover:bg-orange-600" },
    { value: "advanced", label: "Hard", color: "bg-red-500 hover:bg-red-600" }
  ];

  const languageOptions = [
    { value: "javascript", label: "JavaScript", color: "bg-yellow-400" },
    { value: "python", label: "Python", color: "bg-blue-500" },
    { value: "java", label: "Java", color: "bg-orange-600" },
    { value: "typescript", label: "TypeScript", color: "bg-blue-400" },
    { value: "go", label: "Go", color: "bg-cyan-400" },
    { value: "rust", label: "Rust", color: "bg-orange-500" },
    { value: "cpp", label: "C++", color: "bg-pink-500" },
    { value: "csharp", label: "C#", color: "bg-purple-500" },
    { value: "php", label: "PHP", color: "bg-purple-600" },
    { value: "ruby", label: "Ruby", color: "bg-red-500" },
    { value: "swift", label: "Swift", color: "bg-orange-400" },
    { value: "kotlin", label: "Kotlin", color: "bg-purple-400" },
    { value: "scala", label: "Scala", color: "bg-red-600" },
    { value: "dart", label: "Dart", color: "bg-blue-600" },
    { value: "elixir", label: "Elixir", color: "bg-purple-500" },
    { value: "clojure", label: "Clojure", color: "bg-green-600" },
    { value: "haskell", label: "Haskell", color: "bg-purple-700" },
    { value: "fsharp", label: "F#", color: "bg-blue-700" },
    { value: "r", label: "R", color: "bg-blue-800" },
    { value: "matlab", label: "MATLAB", color: "bg-orange-700" },
    { value: "perl", label: "Perl", color: "bg-blue-900" },
    { value: "lua", label: "Lua", color: "bg-blue-300" },
    { value: "crystal", label: "Crystal", color: "bg-gray-600" },
    { value: "nim", label: "Nim", color: "bg-yellow-600" },
    { value: "zig", label: "Zig", color: "bg-orange-300" }
  ];

  const labelOptions = [
    { value: "good first issue", label: "Good First Issue" },
    { value: "help wanted", label: "Help Wanted" },
    { value: "bug", label: "Bug" },
    { value: "enhancement", label: "Enhancement" },
    { value: "documentation", label: "Documentation" },
    { value: "hacktoberfest", label: "Hacktoberfest" }
  ];

  return (
    <aside className="w-full h-full bg-black border-r border-gray-800 backdrop-blur-sm">
      <ScrollArea className="h-full p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" data-testid="text-filters-title">
              Filters
            </h2>
          </div>
          
          {/* Difficulty Level Filter */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Layers className="h-4 w-4 mr-2 text-pink-500" />
              DIFFICULTY LEVEL
            </h3>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-3">
                Prioritize issues that match your coding experience: Easy → Intermediate → Hard
              </p>
              
              <div className="space-y-2">
                {difficultyOptions.map((option) => (
                  <div 
                    key={option.value} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200",
                      filters.difficulties.includes(option.value)
                        ? `${option.color} text-white border-transparent`
                        : "border-border hover:border-border/60 hover:bg-muted/30"
                    )}
                    onClick={() => onArrayFilterToggle("difficulties", option.value)}
                    data-testid={`button-difficulty-${option.value}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`difficulty-${option.value}`}
                        checked={filters.difficulties.includes(option.value)}
                        onCheckedChange={() => onArrayFilterToggle("difficulties", option.value)}
                        className="pointer-events-none"
                        data-testid={`checkbox-difficulty-${option.value}`}
                      />
                      <label 
                        htmlFor={`difficulty-${option.value}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Programming Language Filter */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Code className="h-4 w-4 mr-2 text-blue-500" />
              PROGRAMMING LANGUAGE
            </h3>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-3">
                Filter by your preferred programming languages and technologies
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {languageOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all duration-200 text-sm",
                      filters.languages.includes(option.value)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-border/60 hover:bg-muted/30 text-foreground"
                    )}
                    onClick={() => onArrayFilterToggle("languages", option.value)}
                    data-testid={`button-language-${option.value}`}
                  >
                    <div className={cn("w-3 h-3 rounded-full", option.color)} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Labels Filter */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Archive className="h-4 w-4 mr-2 text-muted-foreground" />
              COMMON LABELS
            </h3>
            <div className="space-y-2">
              {labelOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`label-${option.value}`}
                    checked={filters.labels.includes(option.value)}
                    onCheckedChange={() => onArrayFilterToggle("labels", option.value)}
                    data-testid={`checkbox-label-${option.value.replace(/\s+/g, '-')}`}
                  />
                  <label 
                    htmlFor={`label-${option.value}`}
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          <Button 
            onClick={onClearFilters}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-medium py-3"
            data-testid="button-clear-filters"
          >
            Clear all filters
          </Button>
        </div>
      </ScrollArea>
    </aside>
  );
}
