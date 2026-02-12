import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
];

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang);
    setIsOpen(false);
    setSearchQuery("");
    // Here you would integrate with your i18n solution
    console.log(`Language changed to: ${lang.code}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 px-2"
        >
          <Globe size={16} />
          <span className="hidden sm:inline">{selectedLang.code.toUpperCase()}</span>
          <span className="sm:hidden">{selectedLang.flag}</span>
          <ChevronDown
            size={14}
            className={cn(
              "text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-2" align="end">
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-sm font-medium">Select Language</span>
            <span className="text-lg">{selectedLang.flag}</span>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Language List */}
          <div className="max-h-60 overflow-y-auto space-y-1">
            <AnimatePresence mode="wait">
              {filteredLanguages.map((lang) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => handleSelect(lang)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                    selectedLang.code === lang.code
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    <div className="text-left">
                      <p className="font-medium">{lang.nativeName}</p>
                      <p className="text-xs text-muted-foreground">{lang.name}</p>
                    </div>
                  </div>
                  {selectedLang.code === lang.code && (
                    <Check size={16} className="text-primary" />
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t text-xs text-muted-foreground text-center">
            Translations help us reach more people
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
