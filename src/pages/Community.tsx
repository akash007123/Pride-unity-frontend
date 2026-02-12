import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Heart, Users, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MemberSpotlight } from "@/components/MemberSpotlight";
import { VolunteerSignupModal } from "@/components/VolunteerSignupForm";

const reasons = [
  { title: "Belonging", desc: "Finding your people — those who understand, accept, and celebrate you." },
  { title: "Support", desc: "A network of care that lifts you up during challenges and celebrations alike." },
  { title: "Visibility", desc: "Strength in numbers — together we show the world the beauty of diversity." },
  { title: "Growth", desc: "Learning from shared experiences and expanding your understanding of identity." },
];

const upcomingEvents = [
  { title: "Pride March 2026", date: "Jun 28", location: "Downtown", desc: "Join thousands in celebrating love and equality." },
  { title: "Community Meetup", date: "Mar 15", location: "Virtual", desc: "Monthly gathering for stories, support, and connection." },
  { title: "Ally Workshop", date: "Apr 5", location: "Community Center", desc: "Learn how to be a better ally to the LGBTQ+ community." },
];

const galleryColors = [
  "from-pride-red to-pride-orange",
  "from-pride-orange to-pride-yellow",
  "from-pride-yellow to-pride-green",
  "from-pride-green to-pride-blue",
  "from-pride-blue to-pride-purple",
  "from-pride-purple to-pride-pink",
];

const Community = () => (
  <div>
    <section className="py-20 sm:py-28 pride-gradient-subtle">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
            Our <span className="pride-gradient-text">Community</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Together we are stronger. Join a community that celebrates every color of the rainbow.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Why Community */}
    <AnimatedSection className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">Why Community Matters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center card-hover"
            >
              <h4 className="font-heading font-semibold mb-2">{r.title}</h4>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>

    {/* Join CTA */}
    <AnimatedSection className="py-16">
      <div className="container mx-auto px-4">
        <div className="glass rounded-3xl p-10 sm:p-16 text-center">
          <Users className="mx-auto mb-4 text-primary" size={40} />
          <h2 className="text-3xl font-heading font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Connect with like-minded individuals, share your story, and be part of a
            movement that celebrates love in all its forms.
          </p>
          <button className="btn-pride inline-flex items-center gap-2">
            <Heart size={16} /> Join Now
          </button>
        </div>
      </div>
    </AnimatedSection>

    {/* Event Preview */}
    <AnimatedSection className="py-20 pride-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-heading font-bold">Upcoming Events</h2>
          <Link to="/events" className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden card-hover"
            >
              <div className="pride-gradient h-2" />
              <div className="p-6">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
                  <Calendar size={10} className="inline mr-1" />{e.date}
                </div>
                <h4 className="font-heading font-semibold mb-1">{e.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{e.location}</p>
                <p className="text-sm text-muted-foreground">{e.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>

    {/* Gallery */}
    <AnimatedSection className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">Pride Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryColors.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className={`aspect-square rounded-2xl bg-gradient-to-br ${g} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>

    {/* Member Spotlight */}
    <MemberSpotlight />

    {/* Volunteer CTA */}
    <AnimatedSection className="py-20">
      <div className="container mx-auto px-4">
        <div className="glass rounded-3xl p-10 sm:p-16 text-center">
          <Users className="mx-auto mb-4 text-primary" size={40} />
          <h2 className="text-3xl font-heading font-bold mb-4">Become a Volunteer</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Share your skills and time to help make our community stronger and more inclusive.
          </p>
          <VolunteerSignupModal />
        </div>
      </div>
    </AnimatedSection>
  </div>
);

export default Community;
