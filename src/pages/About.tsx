import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Heart, Target, Eye, Shield, Lightbulb, Users } from "lucide-react";

const values = [
  { icon: Heart, title: "Love", desc: "We believe love is the most powerful force for change and acceptance." },
  { icon: Shield, title: "Safety", desc: "Creating safe spaces where everyone can express themselves freely." },
  { icon: Users, title: "Community", desc: "Building bridges between people of all backgrounds and identities." },
  { icon: Lightbulb, title: "Education", desc: "Raising awareness through knowledge, stories, and open dialogue." },
];

const timeline = [
  { year: "2018", title: "The Awakening", desc: "Began the journey of self-discovery and acceptance." },
  { year: "2019", title: "Finding Voice", desc: "Started speaking openly about identity and LGBTQ+ advocacy." },
  { year: "2020", title: "Building Community", desc: "Founded an online support group connecting hundreds of people." },
  { year: "2021", title: "Taking Action", desc: "Organized local pride events and educational workshops." },
  { year: "2022", title: "Growing Impact", desc: "Partnered with organizations to expand resources and outreach." },
  { year: "2023", title: "PrideVoice Launched", desc: "Created this platform to amplify LGBTQ+ stories worldwide." },
];

const About = () => (
  <div>
    {/* Hero */}
    <section className="py-20 sm:py-28 pride-gradient-subtle">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
            About <span className="pride-gradient-text">PrideVoice</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm an advocate, storyteller, and proud member of the LGBTQ+ community. This space is
            dedicated to celebrating identity, fostering understanding, and building a world where
            everyone can live as their authentic self.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Mission & Vision */}
    <AnimatedSection className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass rounded-2xl p-8 card-hover">
            <Target className="text-primary mb-4" size={32} />
            <h3 className="text-2xl font-heading font-bold mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To create an inclusive digital space that empowers LGBTQ+ individuals through
              storytelling, resources, and community connection. We strive to amplify marginalized
              voices and champion equality for all.
            </p>
          </div>
          <div className="glass rounded-2xl p-8 card-hover">
            <Eye className="text-secondary mb-4" size={32} />
            <h3 className="text-2xl font-heading font-bold mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              A world where sexual orientation and gender identity are celebrated as beautiful
              aspects of human diversity, where every person can live freely, love openly, and
              thrive without fear of discrimination.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>

    {/* Values */}
    <AnimatedSection className="py-20 pride-gradient-subtle">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center card-hover"
            >
              <v.icon className="mx-auto mb-3 text-primary" size={28} />
              <h4 className="font-heading font-semibold mb-2">{v.title}</h4>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>

    {/* Timeline */}
    <AnimatedSection className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">Our Journey</h2>
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 pride-gradient" />
          {timeline.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative mb-8 pl-12 sm:pl-0 ${i % 2 === 0 ? "sm:pr-[55%]" : "sm:pl-[55%]"}`}
            >
              <div className="absolute left-2 sm:left-1/2 top-1 w-5 h-5 rounded-full bg-primary border-4 border-background transform sm:-translate-x-1/2" />
              <div className="glass rounded-xl p-5 card-hover">
                <span className="text-xs font-bold text-primary">{t.year}</span>
                <h4 className="font-heading font-semibold mt-1">{t.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  </div>
);

export default About;
