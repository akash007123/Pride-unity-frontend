import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Failed to subscribe. Please try again.");
        // Reset after 3 seconds
        setTimeout(() => {
          setStatus("idle");
          setErrorMessage("");
        }, 3000);
        return;
      }

      setStatus("success");
      setEmail("");

      // Reset after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
      setErrorMessage("An error occurred. Please try again.");
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 3000);
    }
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

        {status === "error" && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600 dark:text-red-400"
          >
            {errorMessage}
          </motion.p>
        )}

        <p className="text-xs text-muted-foreground">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
};
