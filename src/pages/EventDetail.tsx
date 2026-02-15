import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { EventRegistrationModal } from "@/components/EventRegistrationModal";
import { eventApi, Event } from "@/services/eventApi";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: eventData, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.getEvent(id!),
    enabled: !!id,
  });

  const { data: eventsData } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventApi.getEvents({ limit: 5 }),
  });

  const event = eventData?.data;
  const allEvents = eventsData?.data || [];
  const relatedEvents = event 
    ? allEvents.filter((e) => e.id !== event.id).slice(0, 3)
    : [];

  const spotsLeft = event?.spotsLeft ?? null;
  const isSoldOut = event?.isSoldOut ?? false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading event...</span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">Event not found</p>
        <Button onClick={() => navigate("/events")}>
          Back to Events
        </Button>
      </div>
    );
  }

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
              {event.tags?.map((tag) => (
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
                <span>{event.currentAttendees.toLocaleString()} attending</span>
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
                  {event.isFree ? "FREE" : `₹${event.price}`}
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
                      description={event.description}
                      showLabel={true}
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-heading font-bold mb-4">About This Event</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                      {event.description}
                    </p>
                    {event.fullDescription && (
                      <div
                        className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-li:text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: event.fullDescription }}
                      />
                    )}
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
                          {event.organizer?.name?.split(" ").map((n) => n[0]).join("") || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{event.organizer?.name || "PrideVoice"}</p>
                        {event.organizer?.email && (
                          <a
                            href={`mailto:${event.organizer.email}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {event.organizer.email}
                          </a>
                        )}
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
                        {event.isFree ? "Free" : `₹${event.price}`}
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
                          {event.currentAttendees} / {event.maxAttendees}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                          transition={{ delay: 0.6, duration: 1 }}
                          className="h-full pride-gradient rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {event.registrationOpen && !isSoldOut ? (
                    <EventRegistrationModal event={event}>
                      <Button className="w-full btn-pride" size="lg">
                        <Ticket size={18} className="mr-2" />
                        {event.isFree ? "Register Now" : `Pay ₹${event.price} & Register`}
                      </Button>
                    </EventRegistrationModal>
                  ) : (
                    <Button className="w-full btn-pride" size="lg" disabled>
                      {isSoldOut ? "Sold Out - Join Waitlist" : "Registration Closed"}
                    </Button>
                  )}

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
                      {event.endDate && (
                        <p className="text-sm text-muted-foreground">to {event.endDate}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                      {event.endTime && (
                        <p className="text-sm text-muted-foreground">to {event.endTime}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                      {event.isOnline && (
                        <Badge variant="outline" className="mt-1">Online Event</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Attendees</p>
                      <p className="text-sm text-muted-foreground">
                        {event.currentAttendees} registered
                        {event.maxAttendees && ` of ${event.maxAttendees}`}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Related Events */}
              {relatedEvents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="font-heading font-bold mb-4">Related Events</h3>
                  <div className="space-y-4">
                    {relatedEvents.map((relatedEvent) => (
                      <div
                        key={relatedEvent.id}
                        className="flex gap-3 cursor-pointer group"
                        onClick={() => navigate(`/events/${relatedEvent.slug || relatedEvent.id}`)}
                      >
                        <div className="w-16 h-16 rounded-lg pride-gradient-subtle flex items-center justify-center shrink-0">
                          <Calendar size={24} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                            {relatedEvent.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {relatedEvent.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </aside>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default EventDetail;
