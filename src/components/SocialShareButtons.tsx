import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Check,
  Mail,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  size?: "sm" | "lg" | "default" | "icon";
  showLabel?: boolean;
  variant?: "default" | "minimal" | "rounded";
  platforms?: Array<"twitter" | "facebook" | "linkedin" | "email" | "whatsapp">;
}

export const SocialShareButtons = ({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "Check out PrideVoice!",
  description = "A space to celebrate who you are, share your story, and connect with a community.",
  size = "default",
  showLabel = true,
  variant = "default",
  platforms = ["twitter", "facebook", "linkedin", "email", "whatsapp"],
}: SocialShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const platformConfig = {
    twitter: { icon: Twitter, color: "#1DA1F2", label: "Twitter", bg: "bg-[#1DA1F2]" },
    facebook: { icon: Facebook, color: "#4267B2", label: "Facebook", bg: "bg-[#4267B2]" },
    linkedin: { icon: Linkedin, color: "#0077B5", label: "LinkedIn", bg: "bg-[#0077B5]" },
    email: { icon: Mail, color: "hsl(var(--primary))", label: "Email", bg: "bg-primary" },
    whatsapp: { icon: MessageCircle, color: "#25D366", label: "WhatsApp", bg: "bg-[#25D366]" },
  };

  const sizeClasses = {
    sm: "h-8 px-2.5",
    default: "h-10 px-4",
    lg: "h-12 px-5",
    icon: "h-10 w-10",
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    default: 18,
    lg: 22,
    icon: 18,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  const handleShare = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  // Check if Web Share API is available
  const canUseWebShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = async () => {
    if (canUseWebShare) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
          setIsOpen(true); // Fallback to dialog
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  const getButtonVariantClasses = () => {
    switch (variant) {
      case "minimal":
        return "border-0 hover:bg-primary/5";
      case "rounded":
        return "rounded-full border-primary/30 text-primary hover:bg-primary/10";
      default:
        return "border-primary/30 text-primary hover:bg-primary/10";
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Main Share Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={size}
              onClick={canUseWebShare ? handleNativeShare : () => setIsOpen(true)}
              className={getButtonVariantClasses()}
            >
              <Share2 size={iconSizes[size]} />
              {showLabel && <span className="ml-2">Share</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share this content</p>
          </TooltipContent>
        </Tooltip>

        {/* Share Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Share2 size={20} className="text-primary" />
                Share This Content
              </DialogTitle>
            </DialogHeader>

            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-3 gap-3 py-4"
              >
                {platforms.map((platform) => {
                  const config = platformConfig[platform];
                  const Icon = config.icon;
                  
                  return (
                    <motion.button
                      key={platform}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare(shareLinks[platform])}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors group focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <div 
                        className="p-2.5 rounded-full transition-all duration-200 group-hover:scale-110"
                        style={{ backgroundColor: `${config.color}10` }}
                      >
                        <Icon 
                          size={iconSizes.md} 
                          style={{ color: config.color }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {config.label}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Copy Link Section */}
            <div className="space-y-3">
              <div className="relative">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
                  <Link2 size={16} className="text-muted-foreground shrink-0" />
                  <code className="flex-1 text-xs text-muted-foreground truncate">
                    {url}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="shrink-0 h-8 px-2"
                  >
                    {copied ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-500"
                      >
                        <Check size={14} />
                      </motion.div>
                    ) : (
                      <Link2 size={14} />
                    )}
                  </Button>
                </div>
                
                {/* Copy Feedback */}
                <AnimatePresence>
                  {(copied || copyError) && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className={`absolute -bottom-6 left-0 text-xs ${
                        copyError ? "text-destructive" : "text-green-500"
                      }`}
                    >
                      {copyError ? "Failed to copy" : "Copied to clipboard!"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full mt-2"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};