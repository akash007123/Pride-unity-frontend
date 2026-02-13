import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Heart,
  Bookmark,
  Ticket,
  Star,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Sample event data with expanded details
const events = [
  {
    id: "1",
    title: "Pride March 2026",
    date: "June 28, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "City Center, Downtown",
    attendees: 5234,
    maxAttendees: 10000,
    desc: "Join the annual Pride March celebrating love, diversity, and equality. Walk with us through the heart of the city with thousands of community members, allies, and supporters.",
    fullDescription: `
      <p>Get ready for the most vibrant celebration of the year! Our Annual Pride March brings together thousands of community members, allies, and supporters for a day of joy, visibility, and solidarity.</p>
      
      <h2>What to Expect</h2>
      <p>The march will begin at City Hall at 10:00 AM and proceed through Downtown, ending at Pride Park where festivities continue until 4:00 PM.</p>
      
      <ul>
        <li>Colorful floats and decorated vehicles</li>
        <li>Live music and performances along the route</li>
        <li>Community organizations and resources</li>
        <li>Family-friendly activities and entertainment</li>
        <li>Food vendors and local artisans</li>
      </ul>
      
      <h2>Accessibility</h2>
      <p>We are committed to making this event accessible to all. Wheelchair-accessible viewing areas will be available along the route, and ASL interpreters will be present at the main stage.</p>
      
      <h2>What to Bring</h2>
      <ul>
        <li>Water bottle (refill stations available)</li>
        <li>Sunscreen and hat</li>
        <li>Comfortable walking shoes</li>
        <li>Rain gear (just in case!)</li>
        <li>Your pride and joy!</li>
      </ul>
    `,
    organizer: { name: "PrideVoice Community", email: "events@pridevoice.org" },
    featured: true,
    isFree: true,
    tags: ["In-Person", "Family-Friendly", "Accessible"],
    image: null,
    schedule: [
      { time: "10:00 AM", event: "March Begins - City Hall" },
      { time: "11:30 AM", event: "Main Stage Performances - Pride Park" },
      { time: "1:00 PM", event: "Community Awards Ceremony" },
      { time: "3:00 PM", event: "Final Celebration" },
    ],
  },
  {
    id: "2",
    title: "Rainbow Gala",
    date: "March 22, 2026",
    time: "7:00 PM - 11:00 PM",
    location: "Grand Ballroom, 500 Main Street",
    attendees: 287,
    maxAttendees: 300,
    desc: "An elegant evening of celebration, fundraising, and community. Formal attire encouraged.",
    fullDescription: "<p>An elegant evening of celebration, fundraising, and community...</p>",
    organizer: { name: "PrideVoice Foundation", email: "gala@pridevoice.org" },
    featured: false,
    isFree: false,
    price: 150,
    tags: ["Formal", "Fundraiser", "Adults Only"],
    image: null,
    schedule: [
      { time: "7:00 PM", event: "Cocktail Reception" },
      { time: "8:00 PM", event: "Dinner & Program" },
      { time: "10:00 PM", event: "Dancing & Networking" },
    ],
  },
  {
    id: "3",
    title: "Ally Training Workshop",
    date: "April 5, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Community Center, 123 Unity Ave",
    attendees: 42,
    maxAttendees: 50,
    desc: "Learn actionable ways to support the LGBTQ+ community in your workplace and daily life.",
    fullDescription: "<p>Learn actionable ways to support the LGBTQ+ community...</p>",
    organizer: { name: "Education Team", email: "training@pridevoice.org" },
    featured: false,
    isFree: true,
    tags: ["Workshop", "Educational"],
    image: null,
    schedule: [],
  },
  {
    id: "4",
    title: "Queer Film Festival",
    date: "May 10-12, 2026",
    time: "6:00 PM - 11:00 PM",
    location: "Indie Cinema, 456 Arts District",
    attendees: 156,
    maxAttendees: 200,
    desc: "Three days of powerful LGBTQ+ cinema featuring independent filmmakers from around the world.",
    fullDescription: "<p>Three days of powerful LGBTQ+ cinema...</p>",
    organizer: { name: "Film Committee", email: "films@pridevoice.org" },
    featured: false,
    isFree: false,
    price: 25,
    tags: ["Film", "Festival", "Arts"],
    image: null,
    schedule: [],
  },
  {
    id: "5",
    title: "Virtual Pride Meetup",
    date: "Monthly",
    time: "8:00 PM - 9:30 PM",
    location: "Online (Zoom)",
    attendees: 134,
    maxAttendees: null,
    desc: "Our monthly virtual gathering for stories, support, laughter, and connection. Open to all.",
    fullDescription: "<p>Our monthly virtual gathering...</p>",
    organizer: { name: "Virtual Community", email: "virtual@pridevoice.org" },
    featured: false,
    isFree: true,
    tags: ["Virtual", "Monthly", "Open to All"],
    image: null,
    schedule: [],
  },
  {
    id: "6",
    title: "Youth Pride Camp",
    date: "July 15-20, 2026",
    time: "All Day",
    location: "Lakeside Retreat, 50 miles from city",
    attendees: 68,
    maxAttendees: 80,
    desc: "A safe, fun-filled camp for LGBTQ+ youth aged 14-18. Activities, mentorship, and friendship.",
    fullDescription: "<p>A safe, fun-filled camp for LGBTQ+ youth...</p>",
    organizer: { name: "Youth Programs", email: "youth@pridevoice.org" },
    featured: false,
    isFree: false,
    price: 350,
    tags: ["Youth", "Overnight Camp", "Mentorship"],
    image: null,
    schedule: [],
  },
];

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const event = events.find((e) => e.id === id) || events[0];
  const relatedEvents = events.filter((e) => e.id !== event.id).slice(0, 3);
  const upcomingEvents = events.filter((e) => e.id !== event.id).slice(0, 4);

  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.attendees : null;
  const isSoldOut = spotsLeft !== null && spotsLeft <= 0;

  const handleRegister = () => {
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      alert(`Registration for ${event.title} would open the modal here!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 pride-gradient-subtle overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary))_0%,transparent_50%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/events")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Events
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {event.tags.map((tag) => (
                <Badge key={tag} className="btn-pride" variant="secondary">
                  {tag}
                </Badge>
              ))}
              {event.featured && (
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  <Star size={12} className="mr-1" /> Featured
                </Badge>
              )}
              {isSoldOut && (
                <Badge variant="destructive">Sold Out</Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
              <span className="pride-gradient-text">{event.title}</span>
            </h1>

            {/* Key Info Cards */}
            <div className="flex flex-wrap gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 glass px-4 py-2 rounded-full"
              >
                <Calendar size={16} className="text-primary" />
                <span className="text-sm font-medium">{event.date}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 glass px-4 py-2 rounded-full"
              >
                <Clock size={16} className="text-primary" />
                <span className="text-sm font-medium">{event.time}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 glass px-4 py-2 rounded-full"
              >
                <MapPin size={16} className="text-primary" />
                <span className="text-sm font-medium">{event.location}</span>
              </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-muted-foreground" />
                <span>{event.attendees.toLocaleString()} attending</span>
              </div>
              {spotsLeft !== null && (
                <div className={`flex items-center gap-2 ${spotsLeft < 50 ? "text-amber-500" : "text-green-500"}`}>
                  <Ticket size={16} />
                  <span className="font-medium">
                    {isSoldOut ? "Sold Out" : `${spotsLeft} spots left`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
                  {event.isFree ? "FREE" : `$${event.price}`}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <AnimatedSection className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Event Details */}
            <article className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-3xl overflow-hidden"
              >
                <div className="h-64 sm:h-80 pride-gradient-subtle relative overflow-hidden">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-0 opacity-30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Calendar size={80} className="text-primary/20 mx-auto mb-4" />
                      <p className="text-primary/30 font-medium">{event.title}</p>
                    </div>
                  </div>
                  {event.featured && (
                    <div className="absolute top-4 left-4 pride-gradient text-white px-4 py-1.5 rounded-full text-sm font-bold">
                      Featured Event
                    </div>
                  )}
                </div>

                <div className="p-8">
                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/50 mb-8">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsLiked(!isLiked)}
                        className={`transition-all ${isLiked ? "text-red-500" : ""}`}
                      >
                        <Heart size={18} className={isLiked ? "fill-current" : ""} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`transition-all ${isBookmarked ? "text-amber-500" : ""}`}
                      >
                        <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
                      </Button>
                    </div>
                    <SocialShareButtons
                      title={event.title}
                      description={event.desc}
                      showLabel={true}
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-heading font-bold mb-4">About This Event</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                      {event.desc}
                    </p>
                    <div
                      className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-li:text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: event.fullDescription || `<p>${event.desc}</p>` }}
                    />
                  </div>

                  {/* Schedule */}
                  {event.schedule && event.schedule.length > 0 && (
                    <div className="mb-10">
                      <h2 className="text-2xl font-heading font-bold mb-4">Event Schedule</h2>
                      <div className="space-y-4">
                        {event.schedule.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="w-24 shrink-0 font-medium text-primary">{item.time}</div>
                            <div className="flex-1 font-medium">{item.event}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Organizer */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-heading font-bold mb-4">Organized by</h3>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {event.organizer.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{event.organizer.name}</p>
                        <a
                          href={`mailto:${event.organizer.email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {event.organizer.email}
                        </a>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink size={14} className="mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Registration Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-3xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-heading font-bold mb-1">Ready to Join?</h3>
                      <p className="text-muted-foreground">
                        {isSoldOut
                          ? "This event is currently sold out"
                          : spotsLeft && spotsLeft < 100
                          ? `Only ${spotsLeft} spots remaining!`
                          : "Secure your spot today"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-heading font-bold text-primary">
                        {event.isFree ? "Free" : `$${event.price}`}
                      </p>
                      {event.price > 0 && <p className="text-xs text-muted-foreground">per person</p>}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {event.maxAttendees && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="font-medium">
                          {event.attendees} / {event.maxAttendees}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                          transition={{ delay: 0.6, duration: 1 }}
                          className="h-full pride-gradient rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full btn-pride"
                    size="lg"
                    onClick={handleRegister}
                    disabled={isSoldOut || isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isSoldOut ? (
                      "Sold Out - Join Waitlist"
                    ) : (
                      <>
                        <Ticket size={18} className="mr-2" />
                        {event.isFree ? "Register Now" : `Pay $${event.price} & Register`}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By registering, you agree to our terms and conditions. Cancellation available up to 48 hours before event.
                  </p>
                </div>
              </motion.div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Event Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6 sticky top-24"
              >
                <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  Event Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Attendees</p>
                      <p className="text-sm text-muted-foreground">
                        {event.attendees.toLocaleString()}
                        {event.maxAttendees && ` / ${event.maxAttendees.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <Button variant="outline" className="w-full" size="sm">
                    <Calendar size={14} className="mr-2" />
                    Add to Calendar
                  </Button>
                </div>
              </motion.div>

              {/* Related Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  Similar Events
                </h3>
                <div className="space-y-4">
                  {relatedEvents.map((relatedEvent, i) => (
                    <motion.article
                      key={relatedEvent.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      onClick={() => navigate(`/events/${relatedEvent.id}`)}
                      className="group cursor-pointer"
                    >
                      <Badge variant="outline" className="mb-2 text-xs">
                        {relatedEvent.tags[0]}
                      </Badge>
                      <h4 className="font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedEvent.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={10} />
                        {relatedEvent.date}
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  More Events
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.map((upcomingEvent, i) => (
                    <motion.div
                      key={upcomingEvent.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      onClick={() => navigate(`/events/${upcomingEvent.id}`)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg pride-gradient-subtle flex items-center justify-center shrink-0">
                        <Calendar size={16} className="text-primary/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                          {upcomingEvent.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{upcomingEvent.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </AnimatedSection>

      {/* Navigation Footer */}
      <section className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate("/events")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Events</span>
            </motion.button>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <SocialShareButtons
                title={event.title}
                description={event.desc}
                showLabel={false}
                size="icon"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetail;
