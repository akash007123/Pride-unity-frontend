import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStatus("success");
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="glass rounded-2xl p-6 sm:p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-primary/10">
          <Mail className="text-primary" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold mb-1">Stay Connected</h3>
          <p className="text-sm text-muted-foreground">
            Get updates on pride events, stories, and resources delivered to your inbox.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className="flex-1"
            required
          />
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="btn-pride"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : status === "success" ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Subscribed!
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
        </div>

        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-green-600 dark:text-green-400"
          >
            🎉 Thank you for subscribing! Check your inbox for a warm welcome.
          </motion.p>
        )}

        <p className="text-xs text-muted-foreground">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
};
