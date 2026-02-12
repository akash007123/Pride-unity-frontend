import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Send, Mail, MapPin, Instagram, Twitter, Linkedin, CheckCircle } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  return (
    <div>
      <section className="py-20 sm:py-28 pride-gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
              Get in <span className="pride-gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question, a story to share, or want to collaborate? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <AnimatedSection>
              {submitted ? (
                <div className="glass rounded-2xl p-10 text-center">
                  <CheckCircle className="mx-auto mb-4 text-pride-green" size={48} />
                  <h3 className="text-2xl font-heading font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5" noValidate>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1.5">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1.5">Message</label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                    {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-pride w-full inline-flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Send Message
                  </motion.button>
                </form>
              )}
            </AnimatedSection>

            {/* Info */}
            <AnimatedSection delay={0.2} className="space-y-6">
              <div className="glass rounded-2xl p-6 card-hover">
                <Mail className="text-primary mb-3" size={24} />
                <h4 className="font-heading font-semibold mb-1">Email Us</h4>
                <p className="text-sm text-muted-foreground">hello@pridevoice.com</p>
              </div>
              <div className="glass rounded-2xl p-6 card-hover">
                <MapPin className="text-secondary mb-3" size={24} />
                <h4 className="font-heading font-semibold mb-1">Location</h4>
                <p className="text-sm text-muted-foreground">Everywhere love exists 🌍</p>
              </div>
              <div className="glass rounded-2xl p-6 card-hover">
                <h4 className="font-heading font-semibold mb-3">Follow Us</h4>
                <div className="flex gap-3">
                  <a href="#" className="p-3 rounded-xl glass hover:bg-primary/10 transition-colors" aria-label="Instagram"><Instagram size={20} className="text-primary" /></a>
                  <a href="#" className="p-3 rounded-xl glass hover:bg-primary/10 transition-colors" aria-label="Twitter"><Twitter size={20} className="text-primary" /></a>
                  <a href="#" className="p-3 rounded-xl glass hover:bg-primary/10 transition-colors" aria-label="LinkedIn"><Linkedin size={20} className="text-primary" /></a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="glass rounded-2xl overflow-hidden h-48">
                <div className="w-full h-full pride-gradient-subtle flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 text-muted-foreground" size={28} />
                    <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
