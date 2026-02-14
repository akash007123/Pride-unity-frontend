import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Brain, Scale, Users, BookOpen, Phone, ArrowRight, Download, FileText } from "lucide-react";
import { PrideFlagGenerator } from "@/components/PrideFlagGenerator";

const categories = [
  {
    icon: Brain,
    title: "Mental Health Support",
    resources: [
      { name: "The Trevor Project", desc: "24/7 crisis intervention and suicide prevention for LGBTQ+ youth.", link: "https://www.thetrevorproject.org/resources/article/resources-for-mental-health-support/" },
      { name: "NAMI LGBTQ+", desc: "Mental health resources and support tailored for the LGBTQ+ community.", link: "https://www.nami.org/community-and-culture/lgbtq/" },
      { name: "Psychology Today", desc: "Find LGBTQ+-affirming therapists near you.", link: "https://www.psychologytoday.com/us/blog/transforming-perspectives/202502/navigating-lgbtq-rights-and-safety-in-turbulent-times" },
    ],
  },
  {
    icon: Scale,
    title: "Legal Support",
    resources: [
      { name: "Legal Rights", desc: "Pursuing litigation, education, and advocacy for LGBTQ+ civil rights.", link: "#https://en.wikipedia.org/wiki/LGBTQ_rights_in_India" },
      { name: "LGBTQ Rights", desc: "Fighting discrimination and protecting constitutional rights.", link: "https://ijlmh.com/paper/rights-of-lgbtq-in-india-and-the-struggle-for-societal-acceptance/" },
      { name: "National Center for Transgender Equality", desc: "Policy advocacy for transgender rights.", link: "https://transgender.dosje.gov.in/" },
    ],
  },
  // {
  //   icon: Users,
  //   title: "Community Groups",
  //   resources: [
  //     { name: "PFLAG", desc: "Support, education, and advocacy for LGBTQ+ people and their families.", link: "#" },
  //     { name: "GLAAD", desc: "Accelerating acceptance through media advocacy.", link: "#" },
  //     { name: "It Gets Better Project", desc: "Inspiring stories and community for LGBTQ+ youth.", link: "#" },
  //   ],
  // },
  {
    icon: BookOpen,
    title: "Educational Content",
    resources: [
      { name: "GLSEN", desc: "Ensuring safe schools for LGBTQ+ students.", link: "https://glisten.org/" },
      { name: "Human Rights Campaign", desc: "Working for LGBTQ+ equality through education and advocacy.", link: "https://www.hrc.org/magazine/2023-summer/a-new-era-of-fighting-for-lgbtq-equality" },
      { name: "LGBTQ+ Rights", desc: "A comprehensive guide for LGBTQ+ students.", link: "/pdfs/lgbt-rights.pdf", isPdf: true },
      { name: "LGBTQ Community in India", desc: "Psychosocial and Educational Problems of LGBTQ Community in India.", link: "/pdfs/Psychosocial_and_Educational_Problems_of_LGBTQ_Community_in_India.pdf", isPdf: true },
      { name: "Shaping the Future of Legal Equality for LGBTQ+ in India", desc: "Policy brief on diversity and inclusion in India.", link: "/pdfs/uniting_diversity-policy_brief-final_version.pdf", isPdf: true },
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
          <div className="bg-background rounded-[calc(1rem-4px)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="text-primary shrink-0" size={28} />
              <h3 className="font-heading font-bold text-lg">Need Immediate Help?</h3>
            </div>
            
            {/* India Helplines */}
            <div className="space-y-3 mb-4">
              <p className="text-sm font-medium text-foreground"><span className="text-primary">National & 24/7 Support Lines</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="font-semibold text-foreground">National Tele-Manas Helpline</p>
                  <p className="text-muted-foreground">14416 or 1800-891-4416 (Free, 24×7)</p>
                  <p className="text-xs text-muted-foreground">Emotional crises, stress, depression, and suicidal thoughts</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="font-semibold text-foreground">KIRAN Mental Health Helpline</p>
                  <p className="text-muted-foreground">1800-599-0019 (Free, 24×7)</p>
                  <p className="text-xs text-muted-foreground">Guidance, listening support, and referral</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="font-semibold text-foreground">Suicide Prevention — National Crisis Line</p>
                  <p className="text-muted-foreground">9152987821 (24×7)</p>
                  <p className="text-xs text-muted-foreground">Crisis intervention and suicide prevention</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3">
                  <p className="font-semibold text-red-600">Emergency Services</p>
                  <p className="text-muted-foreground">112 (Medical, Police, Ambulance)</p>
                  <p className="text-xs text-muted-foreground">India's universal emergency number</p>
                </div>
              </div>
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
              <motion.div
                key={ri}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ri * 0.1 }}
                className="glass rounded-2xl p-6 card-hover group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-heading font-semibold group-hover:text-primary transition-colors">{r.name}</h4>
                  {r.isPdf && (
                    <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      <FileText size={12} /> PDF
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
                {r.isPdf ? (
                  <a
                    href={r.link}
                    download
                    className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                  >
                    <Download size={14} /> Download PDF
                  </a>
                ) : (
                  <a
                    href={r.link}
                    className="inline-flex items-center gap-1 text-sm text-primary font-medium"
                  >
                    Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    ))}
  </div>
);

export default Resources;
