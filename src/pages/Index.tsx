import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Globe, Sparkles, Quote } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEOHead, StructuredData, organizationSchema, websiteSchema } from "@/components/SEOHead";
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
    <>
      <SEOHead
        title="Home"
        description="Join PrideCommunity - a safe space for LGBTQ+ individuals. Access resources, connect with community members, attend events, and find support. Together we unite in diversity and celebrate pride."
        keywords={['LGBTQ+', 'pride', 'LGBTQ+ community', 'LGBTQ+ support', 'gay rights', 'transgender support', 'pride events', 'LGBT community']}
        canonicalUrl="/"
      />
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      {/* Hero */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(120,80,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,80,200,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]" />
          <img src={heroPride} alt="" className="w-full h-full object-cover opacity-20 dark:opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-pride-purple/5 via-transparent to-pride-pink/5" />
        </div>

        {/* Enhanced Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[5%] w-80 h-80 rounded-full bg-gradient-to-br from-pride-purple/30 to-pride-blue/20 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-pride-pink/25 to-pride-red/15 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/3 right-[25%] w-64 h-64 rounded-full bg-gradient-to-br from-pride-orange/20 to-pride-yellow/15 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-1/3 left-[20%] w-56 h-56 rounded-full bg-gradient-to-br from-pride-green/15 to-pride-blue/10 blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-pride-purple/5"
          />
          <motion.div
            animate={{
              rotate: [0, -360],
            }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-pride-pink/5"
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -100],
                x: [0, Math.sin(i) * 30],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut",
              }}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: `${60 + Math.random() * 30}%`,
                background: [
                  'hsl(var(--pride-red))',
                  'hsl(var(--pride-orange))',
                  'hsl(var(--pride-yellow))',
                  'hsl(var(--pride-green))',
                  'hsl(var(--pride-blue))',
                  'hsl(var(--pride-purple))',
                  'hsl(var(--pride-pink))',
                ][i % 7],
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-sm font-medium text-primary mb-8 group"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={16} className="text-pride-yellow" />
              </motion.span>
              <span>Celebrating Pride & Identity</span>
              <motion.span
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✨
              </motion.span>
            </motion.div>

            {/* Main Heading with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold leading-tight mb-6"
            >
              <span className="block text-foreground">Your Identity Is</span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
                className="pride-gradient-text inline-block"
              >
                Beautiful
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              A safe space to celebrate who you are, share your story, and connect with a community
              that embraces <span className="text-pride-pink font-semibold">love</span> in all its <span className="pride-gradient-text font-semibold">colors</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              <Link to="/my-story">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(var(--primary) / 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-heading font-semibold text-white overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                    boxShadow: "0 4px 25px hsl(var(--primary) / 0.3)",
                  }}
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  />
                  <span>Read My Story</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </motion.button>
              </Link>
              <Link to="/community">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-heading font-semibold border-2 transition-all duration-300"
                  style={{
                    borderColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary))",
                  }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Heart size={18} className="text-pride-pink" />
                  </motion.span>
                  <span>Join Community</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Social Proof / Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: -10 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold"
                      style={{
                        background: [
                          "hsl(var(--pride-red))",
                          "hsl(var(--pride-orange))",
                          "hsl(var(--pride-green))",
                          "hsl(var(--pride-blue))",
                        ][i - 1],
                        color: "white",
                      }}
                    >
                      {["A", "S", "M", "R"][i - 1]}
                    </motion.div>
                  ))}
                </div>
                <span className="ml-2">10K+ members</span>
              </div>
              <span className="hidden sm:inline text-border">•</span>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.svg
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.2 + i * 0.05 }}
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
                <span className="ml-1">4.9/5 rating</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground/60"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <motion.div
              className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2"
            >
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-current"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Pride Statement */}
      <AnimatedSection className="py-20 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-pride-purple/10 to-pride-pink/10 blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [0, -360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-pride-blue/10 to-pride-green/10 blur-3xl"
        />

        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block p-1 rounded-2xl pride-gradient mb-8 animate-pride-shift">
              <div className="bg-background rounded-xl px-8 py-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl font-heading font-bold mb-4"
                >
                  Everyone Deserves to Be{" "}
                  <span className="pride-gradient-text">Loved</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground leading-relaxed"
                >
                  We believe that love knows no boundaries. Regardless of who you are or whom you love,
                  you deserve dignity, respect, and the freedom to live authentically.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection className="py-16 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,80,200,0.05)_0%,transparent_70%)]" />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass rounded-2xl p-8 text-center group cursor-default"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  <stat.icon className="mx-auto mb-3 text-primary group-hover:text-pride-pink transition-colors" size={32} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                  className="text-5xl font-heading font-bold pride-gradient-text mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Quotes */}
      <AnimatedSection className="py-20 pride-gradient-subtle relative overflow-hidden">
        {/* Floating decorative elements */}
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-10 left-[10%] w-4 h-4 rounded-full bg-pride-purple/30"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-[15%] w-3 h-3 rounded-full bg-pride-pink/30"
        />

        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-heading font-bold text-center mb-12"
          >
            Words That <span className="pride-gradient-text">Inspire</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quotes.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.1, type: "spring" }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass rounded-2xl p-6 group"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i }}
                >
                  <Quote size={28} className="text-primary/50 mb-4 group-hover:text-pride-purple transition-colors" />
                </motion.div>
                <p className="text-foreground leading-relaxed mb-4 italic text-lg">"{q.text}"</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="text-sm font-medium pride-gradient-text"
                >
                  — {q.author}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pride-purple/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-heading font-bold text-center mb-4"
          >
            Community <span className="pride-gradient-text">Voices</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground mb-12 max-w-lg mx-auto"
          >
            Hear from people whose lives have been touched by this community.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="glass rounded-2xl p-6 group relative overflow-hidden"
              >
                {/* Decorative quote mark */}
                <motion.div
                  className="absolute top-4 right-4 text-6xl font-heading text-primary/10 group-hover:text-primary/20 transition-colors"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  "
                </motion.div>
                <p className="text-muted-foreground leading-relaxed mb-6 relative z-10 group-hover:text-foreground transition-colors">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-full pride-gradient flex items-center justify-center text-white font-bold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {t.name.charAt(0)}
                  </motion.div>
                  <div>
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="font-semibold"
                    >
                      {t.name}
                    </motion.p>
                    <p className="text-xs text-primary">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-pride-purple/20 via-pride-pink/20 to-pride-blue/20 blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="pride-gradient rounded-3xl p-1 animate-pride-shift"
          >
            <motion.div
              className="bg-background rounded-[calc(1.5rem-4px)] p-10 sm:p-16 text-center"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl font-heading font-bold mb-4"
              >
                Ready to Make a <span className="pride-gradient-text">Difference</span>?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-8 max-w-lg mx-auto"
              >
                Join us in building a more inclusive world. Every voice matters, every story counts.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to="/resources">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--primary) / 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-pride inline-flex items-center gap-2"
                  >
                    Explore Resources <ArrowRight size={16} />
                  </motion.button>
                </Link>
                <Link to="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-outline-pride"
                  >
                    Get in Touch
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
};

export default Index;
