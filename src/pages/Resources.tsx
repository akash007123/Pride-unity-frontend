import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Brain, Scale, Users, BookOpen, Phone, ArrowRight } from "lucide-react";
import { PrideFlagGenerator } from "@/components/PrideFlagGenerator";

const categories = [
  {
    icon: Brain,
    title: "Mental Health Support",
    resources: [
      { name: "The Trevor Project", desc: "24/7 crisis intervention and suicide prevention for LGBTQ+ youth.", link: "#" },
      { name: "NAMI LGBTQ+", desc: "Mental health resources and support tailored for the LGBTQ+ community.", link: "#" },
      { name: "Psychology Today", desc: "Find LGBTQ+-affirming therapists near you.", link: "#" },
    ],
  },
  {
    icon: Scale,
    title: "Legal Support",
    resources: [
      { name: "Lambda Legal", desc: "Pursuing litigation, education, and advocacy for LGBTQ+ civil rights.", link: "#" },
      { name: "ACLU LGBTQ Rights", desc: "Fighting discrimination and protecting constitutional rights.", link: "#" },
      { name: "National Center for Transgender Equality", desc: "Policy advocacy for transgender rights.", link: "#" },
    ],
  },
  {
    icon: Users,
    title: "Community Groups",
    resources: [
      { name: "PFLAG", desc: "Support, education, and advocacy for LGBTQ+ people and their families.", link: "#" },
      { name: "GLAAD", desc: "Accelerating acceptance through media advocacy.", link: "#" },
      { name: "It Gets Better Project", desc: "Inspiring stories and community for LGBTQ+ youth.", link: "#" },
    ],
  },
  {
    icon: BookOpen,
    title: "Educational Content",
    resources: [
      { name: "GLSEN", desc: "Ensuring safe schools for LGBTQ+ students.", link: "#" },
      { name: "Human Rights Campaign", desc: "Working for LGBTQ+ equality through education and advocacy.", link: "#" },
      { name: "Stonewall UK", desc: "Campaigning for the equality of lesbian, gay, bi, and trans people.", link: "#" },
    ],
  },
];

const Resources = () => (
  <div>
    <section className="py-20 sm:py-28 pride-gradient-subtle">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
            <span className="pride-gradient-text">Resources</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Curated resources to support, educate, and empower the LGBTQ+ community.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Crisis Banner */}
    <AnimatedSection className="py-8">
      <div className="container mx-auto px-4">
        <div className="pride-gradient rounded-2xl p-1 animate-pride-shift">
          <div className="bg-background rounded-[calc(1rem-4px)] p-6 flex flex-col sm:flex-row items-center gap-4">
            <Phone className="text-primary shrink-0" size={28} />
            <div className="text-center sm:text-left">
              <h3 className="font-heading font-bold">Need Immediate Help?</h3>
              <p className="text-sm text-muted-foreground">988 Suicide & Crisis Lifeline — Call or text 988 | Trevor Project — 1-866-488-7386</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>

    {/* Pride Flag Generator */}
    <AnimatedSection className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold mb-2">Pride Flag Generator</h2>
            <p className="text-muted-foreground">Create and customize your own pride flag</p>
          </div>
          <PrideFlagGenerator />
        </div>
      </div>
    </AnimatedSection>

    {/* Resource Categories */}
    {categories.map((cat, ci) => (
      <AnimatedSection key={ci} className={`py-16 ${ci % 2 === 1 ? "pride-gradient-subtle" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <cat.icon className="text-primary" size={28} />
            <h2 className="text-2xl font-heading font-bold">{cat.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cat.resources.map((r, ri) => (
              <motion.a
                key={ri}
                href={r.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ri * 0.1 }}
                className="glass rounded-2xl p-6 card-hover group block"
              >
                <h4 className="font-heading font-semibold mb-2 group-hover:text-primary transition-colors">{r.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                  Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </AnimatedSection>
    ))}
  </div>
);

export default Resources;
