import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Clock, Tag, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const categories = ["All", "Identity", "Advocacy", "Community", "Wellness", "Culture"];

const posts = [
  { title: "Embracing Your Authentic Self", excerpt: "The journey to self-acceptance is rarely linear, but it's always worth taking. Here are steps that helped me embrace who I truly am.", category: "Identity", date: "Feb 8, 2026", readTime: "5 min", featured: true },
  { title: "How to Be a Better Ally", excerpt: "Allyship is more than a label — it's a continuous practice. Learn practical ways to support the LGBTQ+ community.", category: "Advocacy", date: "Feb 1, 2026", readTime: "4 min" },
  { title: "Building Queer Joy in Everyday Life", excerpt: "Pride isn't just for June. Discover how to cultivate daily moments of queer joy and celebration.", category: "Wellness", date: "Jan 25, 2026", readTime: "6 min" },
  { title: "The Power of Representation", excerpt: "Why seeing yourself reflected in media, leadership, and art matters more than you might think.", category: "Culture", date: "Jan 18, 2026", readTime: "5 min" },
  { title: "Navigating Family Conversations", excerpt: "Tips for having meaningful conversations about identity with family members who may not understand.", category: "Community", date: "Jan 10, 2026", readTime: "7 min" },
  { title: "Pride Around the World", excerpt: "From São Paulo to Sydney, a look at how different cultures celebrate LGBTQ+ pride and progress.", category: "Culture", date: "Jan 3, 2026", readTime: "8 min" },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);
  const featured = posts.find((p) => p.featured);

  return (
    <div>
      <section className="py-20 sm:py-28 pride-gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
              <span className="pride-gradient-text">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Stories, insights, and perspectives from the LGBTQ+ community and allies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <AnimatedSection className="py-12">
          <div className="container mx-auto px-4">
            <div className="glass rounded-3xl overflow-hidden card-hover">
              <div className="pride-gradient h-1.5 animate-pride-shift" />
              <div className="p-8 sm:p-12">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">Featured</span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">{featured.title}</h2>
                <p className="text-muted-foreground mb-4 max-w-2xl">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
                  <span className="flex items-center gap-1"><Tag size={12} /> {featured.category}</span>
                  <span>{featured.date}</span>
                </div>
                <SocialShareButtons
                  title={featured.title}
                  description={featured.excerpt}
                  showLabel={true}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Category Filter */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "btn-pride"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl overflow-hidden card-hover group cursor-pointer"
              >
                <div className="h-40 pride-gradient-subtle" />
                <div className="p-6">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mb-3">{post.category}</span>
                  <h3 className="font-heading font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                    <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg glass hover:bg-muted disabled:opacity-40 transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium">Page {page} of 1</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled
              className="p-2 rounded-lg glass hover:bg-muted disabled:opacity-40 transition-all"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
