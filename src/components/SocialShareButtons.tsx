import { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Check,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SocialShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  size?: "sm" | "lg" | "default" | "icon";
  showLabel?: boolean;
}

export const SocialShareButtons = ({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "Check out PrideVoice!",
  description = "A space to celebrate who you are, share your story, and connect with a community.",
  size = "default",
  showLabel = true,
}: SocialShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const sizeClasses = {
    sm: "h-8 px-3",
    default: "h-10 px-4",
    lg: "h-12 px-6",
    icon: "h-10 w-10",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    default: 20,
    lg: 24,
    icon: 20,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const openShareDialog = () => setIsOpen(true);

  return (
    <div className="flex items-center gap-2">
      {/* Quick Share Button */}
      <Button
        variant="outline"
        size={size}
        onClick={openShareDialog}
        className="border-primary/30 text-primary hover:bg-primary/10"
      >
        <Share2 size={iconSizes[size]} />
        {showLabel && <span className="ml-2">Share</span>}
      </Button>

      {/* Share Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 size={20} className="text-primary" />
              Share This Content
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 py-4">
            {/* Twitter/X */}
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="p-3 rounded-full bg-[#1DA1F2]/10 group-hover:bg-[#1DA1F2]/20 transition-colors">
                <Twitter
                  size={iconSizes.md}
                  className="text-[#1DA1F2]"
                />
              </div>
              <span className="text-xs text-muted-foreground">Twitter</span>
            </a>

            {/* Facebook */}
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="p-3 rounded-full bg-[#4267B2]/10 group-hover:bg-[#4267B2]/20 transition-colors">
                <Facebook
                  size={iconSizes.md}
                  className="text-[#4267B2]"
                />
              </div>
              <span className="text-xs text-muted-foreground">Facebook</span>
            </a>

            {/* LinkedIn */}
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="p-3 rounded-full bg-[#0077B5]/10 group-hover:bg-[#0077B5]/20 transition-colors">
                <Linkedin
                  size={iconSizes.md}
                  className="text-[#0077B5]"
                />
              </div>
              <span className="text-xs text-muted-foreground">LinkedIn</span>
            </a>

            {/* Email */}
            <a
              href={shareLinks.email}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Mail size={iconSizes.md} className="text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Email</span>
            </a>

            {/* WhatsApp */}
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="p-3 rounded-full bg-[#25D366]/10 group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle
                  size={iconSizes.md}
                  className="text-[#25D366]"
                />
              </div>
              <span className="text-xs text-muted-foreground">WhatsApp</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors group"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                {copied ? (
                  <Check size={iconSizes.md} className="text-green-500" />
                ) : (
                  <Link2 size={iconSizes.md} className="text-primary" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>
          </div>

          {/* URL Display */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            <code className="flex-1 text-xs text-muted-foreground truncate">
              {url}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Link2 size={14} />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
