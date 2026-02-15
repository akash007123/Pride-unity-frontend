import { useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Calendar, MapPin, Clock, Users, Loader2 } from "lucide-react";
import { eventApi, Event } from "@/services/eventApi";

const Events = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventApi.getEvents({ limit: 50 }),
  });

  const events = data?.data || [];

  return (
    <div>
      <section className="py-20 sm:py-28 pride-gradient-subtle">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            className="max-w-2xl"
          >
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading events...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">Failed to load events. Please try again later.</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Events Yet</h3>
              <p className="text-muted-foreground">
                Check back soon for upcoming events in our community.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`glass rounded-2xl overflow-hidden card-hover cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/10 ${e.featured ? "md:col-span-2" : ""}`}
                  onClick={() => navigate(`/events/${e.slug || e.id}`)}
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
                    <p className="text-muted-foreground mb-4">{e.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Users size={12} /> {e.currentAttendees}
                        {e.maxAttendees ? ` / ${e.maxAttendees}` : '+'} expected
                      </span>
                      <button 
                        className="btn-pride text-sm px-4 py-2"
                        onClick={(evt) => {
                          evt.stopPropagation();
                          navigate(`/events/${e.slug || e.id}`);
                        }}
                      >
                        RSVP
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
