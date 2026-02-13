import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Tag,
  Calendar,
  User,
  ChevronRight,
  Heart,
  MessageCircle,
  Bookmark,
} from "lucide-react";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: "Embracing Your Authentic Self",
    excerpt: "The journey to self-acceptance is rarely linear, but it's always worth taking. Here are steps that helped me embrace who I truly am.",
    content: `
      <p>The journey to self-acceptance is rarely linear, but it's always worth taking. For many of us in the LGBTQ+ community, finding and embracing our authentic selves can feel like navigating uncharted territory. There's no map, no definitive guide, and sometimes the path feels lonely.</p>
      
      <h2>Understanding Your Identity</h2>
      <p>Identity is not something that happens overnight. It's a continuous process of discovery, reflection, and growth. Some days you might feel confident and proud; other days, doubt might creep in. Both are valid parts of the journey.</p>
      
      <p>Remember that your identity is yours alone to define. Whether you choose to come out, how you present yourself, and what labels (if any) you use are all deeply personal decisions. There's no right or wrong way to be yourself.</p>
      
      <h2>Building a Support System</h2>
      <p>Surrounding yourself with supportive people is crucial. This might mean finding community through local LGBTQ+ groups, online forums, or simply being intentional about cultivating friendships with those who affirm and celebrate you.</p>
      
      <p>It's also okay to set boundaries with family members or friends who don't fully understand or accept you. Your mental health and safety come first.</p>
      
      <h2>Practical Steps Forward</h2>
      <ul>
        <li><strong>Journaling:</strong> Write about your feelings, experiences, and aspirations.</li>
        <li><strong>Therapy:</strong> Consider working with a LGBTQ+-affirming therapist.</li>
        <li><strong>Community:</strong> Connect with others who share similar experiences.</li>
        <li><strong>Self-care:</strong> Practice kindness toward yourself daily.</li>
      </ul>
      
      <p>The most important thing to remember is this: you are worthy of love, respect, and acceptance exactly as you are. Your authentic self is beautiful, valid, and deserving of space in this world.</p>
    `,
    category: "Identity",
    date: "Feb 8, 2026",
    readTime: "5 min",
    featured: true,
    author: "Alex Thompson",
    authorRole: "Community Advocate",
    image: null,
  },
  {
    id: 2,
    title: "How to Be a Better Ally",
    excerpt: "Allyship is more than a label — it's a continuous practice. Learn practical ways to support the LGBTQ+ community.",
    content: "<p>Allyship is more than a label — it's a continuous practice...</p>",
    category: "Advocacy",
    date: "Feb 1, 2026",
    readTime: "4 min",
    author: "Sarah Mitchell",
    authorRole: "Activist",
    image: null,
  },
  {
    id: 3,
    title: "Building Queer Joy in Everyday Life",
    excerpt: "Pride isn't just for June. Discover how to cultivate daily moments of queer joy and celebration.",
    content: "<p>Pride isn't just for June...</p>",
    category: "Wellness",
    date: "Jan 25, 2026",
    readTime: "6 min",
    author: "Jordan Hayes",
    authorRole: "Wellness Coach",
    image: null,
  },
  {
    id: 4,
    title: "The Power of Representation",
    excerpt: "Why seeing yourself reflected in media, leadership, and art matters more than you might think.",
    content: "<p>Why seeing yourself reflected in media matters...</p>",
    category: "Culture",
    date: "Jan 18, 2026",
    readTime: "5 min",
    author: "Casey Lee",
    authorRole: "Cultural Critic",
    image: null,
  },
  {
    id: 5,
    title: "Navigating Family Conversations",
    excerpt: "Tips for having meaningful conversations about identity with family members who may not understand.",
    content: "<p>Tips for family conversations...</p>",
    category: "Community",
    date: "Jan 10, 2026",
    readTime: "7 min",
    author: "Morgan Chen",
    authorRole: "Family Therapist",
    image: null,
  },
  {
    id: 6,
    title: "Pride Around the World",
    excerpt: "From São Paulo to Sydney, a look at how different cultures celebrate LGBTQ+ pride and progress.",
    content: "<p>From São Paulo to Sydney...</p>",
    category: "Culture",
    date: "Jan 3, 2026",
    readTime: "8 min",
    author: "Riley Johnson",
    authorRole: "Travel Writer",
    image: null,
  },
];

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const post = blogPosts.find((p) => p.id === Number(id)) || blogPosts[0];
  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || Math.random() > 0.5))
    .slice(0, 3);
  const recentPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 4);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 pride-gradient-subtle overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary))_0%,transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="btn-pride">{post.category}</Badge>
              {post.featured && (
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
              <span className="pride-gradient-text">{post.title}</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full pride-gradient flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-xs">{post.authorRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{post.readTime} read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <AnimatedSection className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Article Content */}
            <article className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-3xl overflow-hidden"
              >
                {/* Featured Image Placeholder */}
                <div className="h-64 sm:h-80 pride-gradient-subtle relative overflow-hidden">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-0 opacity-30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tag size={64} className="text-primary/20" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 sm:p-10">
                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/50 mb-8">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsLiked(!isLiked)}
                        className={`transition-all ${isLiked ? "text-red-500" : ""}`}
                      >
                        <Heart size={18} className={isLiked ? "fill-current" : ""} />
                        <span className="ml-1">{isLiked ? "Liked" : "Like"}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`transition-all ${isBookmarked ? "text-amber-500" : ""}`}
                      >
                        <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
                        <span className="ml-1">{isBookmarked ? "Saved" : "Save"}</span>
                      </Button>
                    </div>
                    <SocialShareButtons
                      title={post.title}
                      description={post.excerpt}
                      showLabel={true}
                    />
                  </div>

                  {/* Article Body */}
                  <div
                    className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-li:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {/* Tags */}
                  <div className="mt-10 pt-6 border-t border-border/50">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {["LGBTQ+", post.category, "Pride", "Self-Acceptance", "Community"].map((tag) => (
                        <motion.button
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 rounded-full glass text-sm hover:text-foreground transition-colors"
                        >
                          #{tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Author Bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 glass rounded-2xl p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-20 h-20 rounded-full pride-gradient flex items-center justify-center shrink-0">
                    <User size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-bold mb-1">{post.author}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{post.authorRole}</p>
                    <p className="text-muted-foreground mb-4">
                      Passionate about creating spaces where everyone can be their authentic selves.
                      Writer and advocate working to build more inclusive communities.
                    </p>
                    <Button variant="outline" size="sm">
                      View All Posts
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Comments Section Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 glass rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-heading font-bold flex items-center gap-2">
                    <MessageCircle size={20} className="text-primary" />
                    Comments
                  </h3>
                  <span className="text-sm text-muted-foreground">3 comments</span>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <User size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Jamie D.</span>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This article resonated deeply with me. Thank you for sharing these insights!
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <User size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Taylor R.</span>
                        <span className="text-xs text-muted-foreground">5 days ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The section about building a support system was exactly what I needed to read today.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border/50">
                  <Button className="btn-pride w-full sm:w-auto">
                    <MessageCircle size={16} className="mr-2" />
                    Leave a Comment
                  </Button>
                </div>
              </motion.div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Table of Contents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6 sticky top-24"
              >
                <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  In This Article
                </h3>
                <nav className="space-y-2 text-sm">
                  {["Understanding Your Identity", "Building a Support System", "Practical Steps Forward"].map((item, i) => (
                    <a
                      key={i}
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-1.5 transition-colors group"
                    >
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      {item}
                    </a>
                  ))}
                </nav>
              </motion.div>

              {/* Related Posts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost, i) => (
                    <motion.article
                      key={relatedPost.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      onClick={() => navigate(`/blog/${relatedPost.id}`)}
                      className="group cursor-pointer"
                    >
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {relatedPost.category}
                      </Badge>
                      <h4 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={10} />
                        {relatedPost.readTime}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pride-gradient rounded-2xl p-6 text-white"
              >
                <h3 className="font-heading font-bold mb-2">Stay Updated</h3>
                <p className="text-sm opacity-90 mb-4">
                  Get the latest stories and insights delivered to your inbox.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Subscribe
                  </Button>
                </div>
              </motion.div>

              {/* Recent Posts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  Recent Posts
                </h3>
                <div className="space-y-3">
                  {recentPosts.map((recentPost, i) => (
                    <motion.div
                      key={recentPost.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      onClick={() => navigate(`/blog/${recentPost.id}`)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg pride-gradient-subtle flex items-center justify-center shrink-0">
                        <Tag size={16} className="text-primary/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                          {recentPost.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{recentPost.date}</p>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </AnimatedSection>

      {/* Navigation Footer */}
      <section className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate("/blog")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Blog</span>
            </motion.button>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <SocialShareButtons
                title={post.title}
                description={post.excerpt}
                showLabel={false}
                size="icon"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
