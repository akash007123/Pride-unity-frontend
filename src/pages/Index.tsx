import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Globe, Sparkles, Quote } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import heroPride from "@/assets/hero-pride.jpg";

const stats = [
  { value: "30M+", label: "LGBTQ+ Indians", icon: Users },
  { value: "15+", label: "Countries with communities", icon: Globe },
  { value: "∞", label: "Love to share", icon: Heart },
];

const quotes = [
  { text: "Be yourself; everyone else is already taken.", author: "Rohan Verma" },
  { text: "The beauty of standing up for your rights is others see you standing and stand up as well.", author: "Dev Shah" },
  { text: "We deserve to experience love fully, equally, without shame and without compromise.", author: "Vedant Mehta" },
];

const testimonials = [
  { name: "Sahil Ansari", role: "Community Member", text: "Finding this space changed my life. For the first time, I felt truly seen and accepted." },
  { name: "Ankit Malhotra", role: "Volunteer", text: "The resources here helped me navigate my journey with confidence and pride." },
  { name: "Arush Sharma", role: "Advocate", text: "This platform gives voice to stories that need to be heard. Powerful and beautiful." },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPride} alt="" className="w-full h-full object-cover opacity-30 dark:opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-pride-purple/20 blur-3xl animate-float" />
          <div className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full bg-pride-blue/15 blur-3xl animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-pride-pink/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-primary mb-6"
            >
              <Sparkles size={14} /> Celebrating Pride & Identity
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
              Your Identity Is{" "}
              <span className="pride-gradient-text">Beautiful</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
              A space to celebrate who you are, share your story, and connect with a community
              that embraces love in all its colors.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/my-story" className="btn-pride inline-flex items-center gap-2">
                Read My Story <ArrowRight size={16} />
              </Link>
              <Link to="/community" className="btn-outline-pride inline-flex items-center gap-2">
                Join Community <Heart size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pride Statement */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-block p-1 rounded-2xl pride-gradient mb-8">
            <div className="bg-background rounded-xl px-8 py-6">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
                Everyone Deserves to Be <span className="pride-gradient-text">Loved</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that love knows no boundaries. Regardless of who you are or whom you love,
                you deserve dignity, respect, and the freedom to live authentically.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-8 text-center card-hover"
              >
                <stat.icon className="mx-auto mb-3 text-primary" size={28} />
                <div className="text-4xl font-heading font-bold pride-gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Quotes */}
      <AnimatedSection className="py-20 pride-gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Words That Inspire</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quotes.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <Quote size={24} className="text-primary/40 mb-3" />
                <p className="text-foreground leading-relaxed mb-4 italic">"{q.text}"</p>
                <p className="text-sm font-medium text-primary">— {q.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-4">Community Voices</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Hear from people whose lives have been touched by this community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <p className="text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-primary">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4">
          <div className="pride-gradient rounded-3xl p-1 animate-pride-shift">
            <div className="bg-background rounded-[calc(1.5rem-4px)] p-10 sm:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join us in building a more inclusive world. Every voice matters, every story counts.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/resources" className="btn-pride inline-flex items-center gap-2">
                  Explore Resources <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-outline-pride">Get in Touch</Link>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Index;
