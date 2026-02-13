import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

const events = [
  { id: "1", title: "Pride March 2026", date: "June 28, 2026", time: "10:00 AM", location: "City Center, Downtown", attendees: "5000+", desc: "Join the annual Pride March celebrating love, diversity, and equality. Walk with us through the heart of the city.", featured: true },
  { id: "2", title: "Rainbow Gala", date: "March 22, 2026", time: "7:00 PM", location: "Grand Ballroom", attendees: "300", desc: "An elegant evening of celebration, fundraising, and community. Formal attire encouraged." },
  { id: "3", title: "Ally Training Workshop", date: "April 5, 2026", time: "2:00 PM", location: "Community Center", attendees: "50", desc: "Learn actionable ways to support the LGBTQ+ community in your workplace and daily life." },
  { id: "4", title: "Queer Film Festival", date: "May 10-12, 2026", time: "6:00 PM", location: "Indie Cinema", attendees: "200", desc: "Three days of powerful LGBTQ+ cinema featuring independent filmmakers from around the world." },
  { id: "5", title: "Virtual Pride Meetup", date: "Monthly", time: "8:00 PM", location: "Online (Zoom)", attendees: "100+", desc: "Our monthly virtual gathering for stories, support, laughter, and connection. Open to all." },
  { id: "6", title: "Youth Pride Camp", date: "July 15-20, 2026", time: "All Day", location: "Lakeside Retreat", attendees: "80", desc: "A safe, fun-filled camp for LGBTQ+ youth aged 14-18. Activities, mentorship, and friendship." },
];

const Events = () => {
  const navigate = useNavigate();

  return (
    <div>
      <section className="py-20 sm:py-28 pride-gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
              <span className="pride-gradient-text">Events</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Gather, celebrate, and connect. Find events that bring our community together.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass rounded-2xl overflow-hidden card-hover cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/10 ${e.featured ? "md:col-span-2" : ""}`}
                onClick={() => navigate(`/events/${e.id}`)}
              >
                {e.featured && <div className="pride-gradient h-1.5 animate-pride-shift" />}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      <Calendar size={12} /> {e.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} /> {e.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin size={12} /> {e.location}
                    </span>
                  </div>
                  <h3 className={`font-heading font-bold mb-2 ${e.featured ? "text-2xl" : "text-xl"}`}>{e.title}</h3>
                  <p className="text-muted-foreground mb-4">{e.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Users size={12} /> {e.attendees} expected
                    </span>
                    <button 
                      className="btn-pride text-sm px-4 py-2"
                      onClick={(evt) => {
                        evt.stopPropagation();
                        navigate(`/events/${e.id}`);
                      }}
                    >
                      RSVP
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
