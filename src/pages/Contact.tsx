import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { 
  Send, 
  Mail, 
  MapPin, 
  Instagram, 
  Twitter, 
  Linkedin, 
  CheckCircle, 
  Phone, 
  MessageCircle,
  Sparkles,
  ArrowRight,
  Loader2
} from "lucide-react";
import { z } from "zod";

// API configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  mobile: z.string().trim().min(1, "Mobile number is required").max(20),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  mobile: string;
  message: string;
};

const Contact = () => {
  const [form, setForm] = useState<ContactFormData>({ name: "", email: "", subject: "", mobile: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
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
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setSubmitError(data.message || "Failed to submit form. Please try again.");
        }
        return;
      }

      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", mobile: "", message: "" });
    } catch (error) {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-background to-background/80">
      {/* Hero Section */}
      <section className="relative py-32 sm:py-40 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <Sparkles size={16} />
              <span className="text-sm font-medium">Let's Connect</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-7xl font-heading font-bold mb-6">
              Get in{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Touch
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 rounded-full blur-md"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Have a question, a story to share, or want to collaborate? 
              We'd love to hear from you and bring your ideas to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-xl" />
                  <div className="relative bg-background/80 backdrop-blur-xl rounded-3xl p-12 border border-border/50">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
                    >
                      <CheckCircle size={40} className="text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <motion.button
                      onClick={() => setSubmitted(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-primary text-white rounded-full font-medium inline-flex items-center gap-2"
                    >
                      Send Another Message <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="relative"
                  variants={staggerChildren}
                  initial="initial"
                  animate="animate"
                  noValidate
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-background/80 backdrop-blur-xl rounded-3xl p-8 border border-border/50">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <MessageCircle size={20} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-heading font-bold">Send a Message</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <motion.div variants={fadeInUp}>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name
                          </label>
                          <div className="relative">
                            <input
                              id="name"
                              type="text"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              onFocus={() => setFocusedField("name")}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full px-4 py-3.5 rounded-xl bg-muted/50 border-2 transition-all duration-300 outline-none
                                ${focusedField === "name" 
                                  ? "border-primary shadow-lg shadow-primary/10" 
                                  : "border-transparent hover:border-border"
                                } ${errors.name ? "border-destructive" : ""}`}
                              placeholder="Your name"
                            />
                            {errors.name && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-destructive mt-1"
                              >
                                {errors.name}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>

                        {/* Email Field */}
                        <motion.div variants={fadeInUp}>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <input
                              id="email"
                              type="email"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              onFocus={() => setFocusedField("email")}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full px-4 py-3.5 rounded-xl bg-muted/50 border-2 transition-all duration-300 outline-none
                                ${focusedField === "email" 
                                  ? "border-primary shadow-lg shadow-primary/10" 
                                  : "border-transparent hover:border-border"
                                } ${errors.email ? "border-destructive" : ""}`}
                              placeholder="your@email.com"
                            />
                            {errors.email && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-destructive mt-1"
                              >
                                {errors.email}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Subject Field */}
                        <motion.div variants={fadeInUp}>
                          <label htmlFor="subject" className="block text-sm font-medium mb-2">
                            Subject
                          </label>
                          <div className="relative">
                            <input
                              id="subject"
                              type="text"
                              value={form.subject}
                              onChange={(e) => setForm({ ...form, subject: e.target.value })}
                              onFocus={() => setFocusedField("subject")}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full px-4 py-3.5 rounded-xl bg-muted/50 border-2 transition-all duration-300 outline-none
                                ${focusedField === "subject" 
                                  ? "border-primary shadow-lg shadow-primary/10" 
                                  : "border-transparent hover:border-border"
                                } ${errors.subject ? "border-destructive" : ""}`}
                              placeholder="What's this about?"
                            />
                            {errors.subject && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-destructive mt-1"
                              >
                                {errors.subject}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>

                        {/* Mobile Field */}
                        <motion.div variants={fadeInUp}>
                          <label htmlFor="mobile" className="block text-sm font-medium mb-2">
                            Mobile Number
                          </label>
                          <div className="relative">
                            <input
                              id="mobile"
                              type="tel"
                              value={form.mobile}
                              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                              onFocus={() => setFocusedField("mobile")}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full px-4 py-3.5 rounded-xl bg-muted/50 border-2 transition-all duration-300 outline-none
                                ${focusedField === "mobile" 
                                  ? "border-primary shadow-lg shadow-primary/10" 
                                  : "border-transparent hover:border-border"
                                } ${errors.mobile ? "border-destructive" : ""}`}
                              placeholder="Your mobile number"
                            />
                            {errors.mobile && (
                              <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-destructive mt-1"
                              >
                                {errors.mobile}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      {/* Message Field */}
                      <motion.div variants={fadeInUp}>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <div className="relative">
                          <textarea
                            id="message"
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            onFocus={() => setFocusedField("message")}
                            onBlur={() => setFocusedField(null)}
                            rows={5}
                            className={`w-full px-4 py-3.5 rounded-xl bg-muted/50 border-2 transition-all duration-300 outline-none resize-none
                              ${focusedField === "message" 
                                ? "border-primary shadow-lg shadow-primary/10" 
                                : "border-transparent hover:border-border"
                              } ${errors.message ? "border-destructive" : ""}`}
                            placeholder="Tell us what's on your mind..."
                          />
                          {errors.message && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-destructive mt-1"
                            >
                              {errors.message}
                            </motion.p>
                          )}
                        </div>
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div variants={fadeInUp}>
                        <motion.button
                          type="submit"
                          disabled={isLoading}
                          whileHover={{ scale: isLoading ? 1 : 1.02 }}
                          whileTap={{ scale: isLoading ? 1 : 0.98 }}
                          className={`w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-secondary to-accent p-[2px] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          <div className={`relative flex items-center justify-center gap-2 bg-background rounded-xl px-6 py-4 transition-all duration-300 ${!isLoading ? "group-hover:bg-transparent group-hover:text-white" : ""}`}>
                            {isLoading ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Send size={18} className="group-hover:rotate-45 transition-transform duration-300" />
                            )}
                            <span className="font-semibold">{isLoading ? "Sending..." : "Send Message"}</span>
                          </div>
                        </motion.button>
                      </motion.div>

                      {/* Submit Error */}
                      {submitError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive mt-2 text-center"
                        >
                          {submitError}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.form>
              )}
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Contact Cards */}
              <motion.div variants={staggerChildren} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Mail, title: "Email Us", content: "loveforprideunity@gmail.com", color: "from-blue-500/20 to-cyan-500/20" },
                  { icon: Phone, title: "Call Us", content: "+91-9074211713", color: "from-green-500/20 to-emerald-500/20" },
                  { icon: MapPin, title: "Location", content: "Agar Road, Ujjain, MP 456010", color: "from-purple-500/20 to-pink-500/20" },
                  { icon: MessageCircle, title: "Live Chat", content: "Available 24/7", color: "from-orange-500/20 to-red-500/20" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className="group relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative bg-background/80 backdrop-blur-xl rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="text-primary" size={24} />
                      </div>
                      <h4 className="font-heading font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Social Section */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-background/80 backdrop-blur-xl rounded-2xl p-6 border border-border/50">
                  <h4 className="font-heading font-semibold mb-4">Connect With Us</h4>
                  <div className="flex gap-3">
                    {[
                      { icon: Instagram, label: "Instagram", color: "from-pink-500 to-orange-500" },
                      { icon: Twitter, label: "Twitter", color: "from-blue-400 to-blue-600" },
                      { icon: Linkedin, label: "LinkedIn", color: "from-blue-600 to-blue-800" },
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href="#"
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group/social"
                        aria-label={social.label}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${social.color} rounded-xl blur-md opacity-0 group-hover/social:opacity-70 transition-opacity duration-300`} />
                        <div className="relative w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border/50 group-hover/social:border-transparent transition-all duration-300">
                          <social.icon size={20} className="text-muted-foreground group-hover/social:text-white transition-colors duration-300" />
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Map Placeholder */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="relative group h-64"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full bg-gradient-to-br from-muted/80 to-muted rounded-2xl border border-border/50 overflow-hidden">
                  {/* Animated dots for map effect */}
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-primary/30 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <MapPin size={28} className="text-white" />
                    </div>
                    <p className="text-sm font-medium bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                      Interactive map coming soon
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;