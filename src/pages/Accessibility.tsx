import { motion } from "framer-motion";
import { Accessibility, Circle, Eye, Ear, Brain, Heart, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const accessibilityFeatures = [
  {
    icon: Eye,
    title: "Visual Accessibility",
    description: "High contrast modes, scalable text, and screen reader compatibility"
  },
  {
    icon: Ear,
    title: "Auditory Accessibility",
    description: "Captions for videos and audio content, visual alternatives for sound"
  },
  {
    icon: Circle,
    title: "Motor Accessibility",
    description: "Keyboard navigation, skip links, and generous click targets"
  },
  {
    icon: Brain,
    title: "Cognitive Accessibility",
    description: "Clear content structure, consistent navigation, and plain language"
  }
];

const AccessibilityPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-pride-blue/10 blur-3xl" />
          <div className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full bg-pride-cyan/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-primary mb-6">
              <Accessibility size={14} /> Inclusive by Design
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
              Accessibility <span className="pride-gradient-text">Statement</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              PrideVoice is committed to ensuring digital accessibility for all people, 
              including those with disabilities. We continuously work to improve the 
              user experience for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="pride-gradient rounded-3xl p-1 animate-pride-shift mb-12">
              <div className="bg-background rounded-[calc(1.5rem-4px)] p-8 sm:p-10 text-center">
                <Accessibility size={48} className="mx-auto mb-4 text-primary pride-gradient-text" />
                <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4">
                  Our Commitment to <span className="pride-gradient-text">Inclusion</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  We believe that everyone deserves equal access to information and services. 
                  Our platform is built with accessibility as a core principle, not an afterthought. 
                  This commitment reflects our values of dignity, respect, and equality for all.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 pride-gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-2xl font-heading font-bold text-center mb-4">
              Accessibility <span className="pride-gradient-text">Features</span>
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              We've implemented various features to ensure our platform is accessible to all.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accessibilityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass rounded-xl p-6 card-hover border border-border/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <feature.icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Standards & Guidelines */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6">
                  Standards We <span className="pride-gradient-text">Follow</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  PrideVoice is designed to conform to WCAG 2.1 Level AA standards. This means 
                  our website should be perceivable, operable, understandable, and robust for 
                  users with various disabilities.
                </p>
                <div className="space-y-4">
                  {[
                    "WCAG 2.1 Level AA compliance",
                    "Section 508 standards",
                    "WAI-ARIA best practices",
                    "Web Content Accessibility Guidelines"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <ChevronRight size={16} className="text-primary" />
                      <span className="text-foreground/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <div className="pride-gradient-subtle rounded-3xl p-8">
                  <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 text-center">
                    <Circle size={64} className="mx-auto mb-6 text-primary pride-gradient-text" />
                    <h3 className="text-2xl font-heading font-bold mb-4">
                      Accessibility Is a <span className="pride-gradient-text">Right</span>
                    </h3>
                    <p className="text-muted-foreground text-center leading-relaxed mb-6">
                      Digital accessibility ensures that everyone, regardless of ability, can 
                      fully participate in our community and access the resources they need.
                    </p>
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Heart size={16} className="fill-primary/20" />
                        <span>Inclusion for all abilities</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Assistive Technology */}
      <section className="py-16 pride-gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-heading font-bold text-center mb-8">
              Assistive Technology <span className="pride-gradient-text">Support</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Screen Readers", desc: "NVDA, JAWS, VoiceOver, and TalkBack compatible" },
                { title: "Keyboard Navigation", desc: "Full functionality without a mouse" },
                { title: "Browser Zoom", desc: "Support for up to 200% zoom" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-background/80 backdrop-blur-sm rounded-xl p-5 border border-border/50 text-center"
                >
                  <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl font-heading font-bold mb-4">
              Help Us <span className="pride-gradient-text">Improve</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              We're continuously working to improve accessibility. If you encounter any barriers 
              or have suggestions, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-pride inline-flex items-center gap-2">
                Report an Issue <ChevronRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline-pride">
                Provide Feedback
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AccessibilityPage;
