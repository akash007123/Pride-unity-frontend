import { motion } from "framer-motion";
import { FileText, Scale, Gavel, Pen, ChevronRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const termsSections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content: "By accessing and using PrideVoice, you accept and agree to be bound by these Terms of Service and our Privacy Policy."
  },
  {
    icon: Scale,
    title: "Use of Services",
    content: "Our platform is designed to provide a safe, inclusive space for the LGBTQ+ community. Users agree to respect other members and maintain a positive environment."
  },
  {
    icon: Gavel,
    title: "User Responsibilities",
    content: "You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account."
  },
  {
    icon: Pen,
    title: "Content Guidelines",
    content: "Users retain ownership of content they submit. By posting, you grant us a license to display and distribute your content on our platform."
  }
];

const Terms = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-pride-purple/10 blur-3xl" />
          <div className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-pride-pink/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-primary mb-6">
              <Scale size={14} /> Legal Framework
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
              Terms of <span className="pride-gradient-text">Service</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              These terms govern your use of PrideVoice. By using our platform, you agree to 
              these terms and our commitment to creating a safe, inclusive community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-heading font-bold mb-6">
                Key Terms & <span className="pride-gradient-text">Conditions</span>
              </h2>

              <div className="grid gap-6">
                {termsSections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="glass rounded-xl p-5 card-hover border border-border/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <section.icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{section.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="pride-gradient-subtle rounded-3xl p-8">
                <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
                  <Scale size={64} className="mx-auto mb-6 text-primary pride-gradient-text" />
                  <h3 className="text-2xl font-heading font-bold text-center mb-4">
                    Fair & Inclusive
                  </h3>
                  <p className="text-muted-foreground text-center leading-relaxed mb-6">
                    Our terms are designed with our community in mind—promoting respect, 
                    safety, and equality for all members regardless of identity.
                  </p>
                  <div className="space-y-4">
                    {["Respect all community members", "No harassment or discrimination", "Protect shared information", "Report inappropriate behavior"].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <ChevronRight size={14} className="text-primary" />
                        <span className="text-foreground/80">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Heart size={16} className="fill-primary/20" />
                      <span>Built with love for everyone</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-16 pride-gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-heading font-bold text-center mb-8">
              Additional <span className="pride-gradient-text">Provisions</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Intellectual Property", desc: "All content, trademarks, and materials are owned by PrideVoice or licensed to us." },
                { title: "Disclaimers", desc: "Our platform is provided 'as is' without warranties of any kind." },
                { title: "Limitation of Liability", desc: "We are not liable for damages arising from your use of our services." },
                { title: "Termination", desc: "We may terminate or suspend access for violations of these terms." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-background/80 backdrop-blur-sm rounded-xl p-5 border border-border/50"
                >
                  <div className="flex items-start gap-3">
                    <ChevronRight size={16} className="text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
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
              Questions About These <span className="pride-gradient-text">Terms</span>?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our legal team is here to help clarify any questions or concerns.
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

export default Terms;
