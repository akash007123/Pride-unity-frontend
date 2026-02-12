import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  FileText,
  Calendar,
  Users,
  BookOpen,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface SearchResult {
  id: string;
  type: "page" | "blog" | "event" | "resource";
  title: string;
  description: string;
  url: string;
  category: string;
  lastUpdated?: string;
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    type: "page",
    title: "About PrideVoice",
    description: "Learn about our mission, vision, and the story behind our community.",
    url: "/about",
    category: "Pages",
  },
  {
    id: "2",
    type: "blog",
    title: "Coming Out: A Journey of Self-Discovery",
    description: "Personal stories and advice for those considering coming out.",
    url: "/blog",
    category: "Blog",
  },
  {
    id: "3",
    type: "event",
    title: "Pride Month Celebration 2024",
    description: "Join us for our annual pride celebration with food, music, and community.",
    url: "/events",
    category: "Events",
    lastUpdated: "June 15, 2024",
  },
  {
    id: "4",
    type: "resource",
    title: "Mental Health Resources",
    description: "Comprehensive guide to LGBTQ+-affirming mental health support.",
    url: "/resources",
    category: "Resources",
  },
  {
    id: "5",
    type: "page",
    title: "Community Guidelines",
    description: "Our code of conduct to ensure a safe and welcoming space for all.",
    url: "/community",
    category: "Pages",
  },
  {
    id: "6",
    type: "blog",
    title: "Finding Your Pride Family",
    description: "How to build meaningful connections within the LGBTQ+ community.",
    url: "/blog",
    category: "Blog",
  },
];

const typeIcons = {
  page: FileText,
  blog: BookOpen,
  event: Calendar,
  resource: Users,
};

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      window.location.href = results[selectedIndex].url;
      setIsOpen(false);
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="outline"
        className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground border-dashed"
        onClick={() => setIsOpen(true)}
      >
        <Search size={16} />
        <span className="text-sm">Search...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Search size={20} />
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center border-b px-4">
            <Search size={20} className="text-muted-foreground mr-3" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search pages, events, blog posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-base"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded hover:bg-muted"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            <AnimatePresence mode="wait">
              {!query ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <Search size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    Start typing to search...
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                    <span>Try searching for:</span>
                    <span className="px-2 py-1 rounded bg-muted">resources</span>
                    <span className="px-2 py-1 rounded bg-muted">events</span>
                    <span className="px-2 py-1 rounded bg-muted">community</span>
                  </div>
                </motion.div>
              ) : results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <X size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">No results found for "{query}"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try different keywords or browse our pages.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                        {category}
                      </h3>
                      {items.map((result, index) => {
                        const Icon = typeIcons[result.type];
                        const globalIndex = results.indexOf(result);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <Link
                            key={result.id}
                            to={result.url}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                              isSelected
                                ? "bg-primary/10"
                                : "hover:bg-muted"
                            }`}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                          >
                            <div
                              className={`p-2 rounded-lg ${
                                isSelected
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{result.title}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {result.description}
                              </p>
                              {result.lastUpdated && (
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                  <Clock size={12} />
                                  {result.lastUpdated}
                                </p>
                              )}
                            </div>
                            <ArrowRight
                              size={16}
                              className={`mt-1 ${
                                isSelected
                                  ? "text-primary"
                                  : "text-muted-foreground/50"
                              }`}
                            />
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">↵</kbd>
                Open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">esc</kbd>
                Close
              </span>
            </div>
            <span className="flex items-center gap-1">
              Search by <span className="font-medium">PrideVoice</span>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
