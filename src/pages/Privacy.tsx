import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, ChevronRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const privacyPrinciples = [
  {
    icon: Shield,
    title: "Data Protection",
    description: "We use industry-standard encryption to protect your personal information from unauthorized access."
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is never sold or shared with third parties for advertising purposes."
  },
  {
    icon: Eye,
    title: "Your Control",
    description: "You have full control over what information you share and can request deletion anytime."
  },
  {
    icon: Database,
    title: "Secure Storage",
    description: "All data is stored on secure servers with regular security audits and updates."
  }
];

const Privacy = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-pride-green/10 blur-3xl" />
          <div className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full bg-pride-blue/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-primary mb-6">
              <Shield size={14} /> Your Privacy Matters
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
              Privacy <span className="pride-gradient-text">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are committed to protecting your privacy and ensuring your personal information 
              remains secure. This policy explains how we collect, use, and safeguard your data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="pride-gradient-subtle rounded-3xl p-8">
                <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
                  <Shield size={64} className="mx-auto mb-6 text-primary pride-gradient-text" />
                  <h3 className="text-2xl font-heading font-bold text-center mb-4">
                    Your Trust, Our Priority
                  </h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    In a digital world, your privacy is precious. We honor that trust by maintaining 
                    the highest standards of data protection and transparency in everything we do.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Heart size={16} className="fill-primary/20" />
                      <span>Built with love for our community</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-heading font-bold mb-6">
                Our Privacy <span className="pride-gradient-text">Principles</span>
              </h2>

              <div className="grid gap-6">
                {privacyPrinciples.map((principle, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="glass rounded-xl p-5 card-hover border border-border/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <principle.icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{principle.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 pride-gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-heading font-bold text-center mb-8">
              Information We <span className="pride-gradient-text">Collect</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Account Information", desc: "Name, email, and profile details you provide" },
                { title: "Usage Data", desc: "Pages visited, features used, and interaction patterns" },
                { title: "Communications", desc: "Messages, feedback, and support inquiries" },
                { title: "Technical Data", desc: "IP address, browser type, and device information" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-background/80 backdrop-blur-sm rounded-xl p-5 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <ChevronRight size={16} className="text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl font-heading font-bold mb-4">
              Questions About Your <span className="pride-gradient-text">Privacy</span>?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're here to help. Reach out to our privacy team with any questions or concerns.
            </p>
            <Link to="/contact" className="btn-pride inline-flex items-center gap-2">
              Contact Us <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
