import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Quote, Sparkles, Heart } from "lucide-react";

const chapters = [
  {
    title: "The Beginning",
    text: "Growing up, I always felt different. Not in a way I could easily explain — just a quiet knowing that I experienced the world through a different lens. In a small town where conformity was the norm, I learned early to blend in, to mirror what was expected.",
  },
  {
    title: "The Struggle",
    text: "For years, I carried the weight of hiding who I truly was. The fear of rejection, the anxiety of being discovered — it was exhausting. I watched my peers navigate life with an ease I envied, wondering if I'd ever feel that freedom.",
  },
  {
    title: "The Turning Point",
    text: "Then one day, I found a community online — people who understood, who had walked similar paths. Their stories gave me courage. Their vulnerability gave me strength. For the first time, I realized I wasn't alone.",
  },
  {
    title: "Coming Out",
    text: "Coming out wasn't a single moment — it was a journey. Some conversations were met with open arms, others with silence. But each time I spoke my truth, I reclaimed a piece of myself. The relief of being seen was immeasurable.",
  },
  {
    title: "Finding Pride",
    text: "Today, I stand proud of every part of my journey. The struggles shaped my empathy. The victories fueled my advocacy. I've learned that being authentic isn't just brave — it's essential. And I want to help others find that same freedom.",
  },
];

const MyStory = () => (
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-primary mb-6">
            <Sparkles size={14} /> Personal Journey
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
            My <span className="pride-gradient-text">Story</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every person's journey is unique. This is mine — a story of discovery, struggle,
            resilience, and ultimately, pride.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Story Cards */}
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-8">
          {chapters.map((ch, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-8 card-hover"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full pride-gradient flex items-center justify-center text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="text-xl font-heading font-bold">{ch.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{ch.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Quote Highlight */}
    <AnimatedSection className="py-20 pride-gradient-subtle">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <Quote size={40} className="mx-auto text-primary/30 mb-4" />
        <blockquote className="text-2xl sm:text-3xl font-heading font-bold leading-snug mb-4">
          "The most courageous act is still to{" "}
          <span className="pride-gradient-text">think for yourself</span>. Aloud."
        </blockquote>
        <p className="text-muted-foreground">— Coco Chanel</p>
      </div>
    </AnimatedSection>

    {/* Inspirational Close */}
    <AnimatedSection className="py-20">
      <div className="container mx-auto px-4 text-center max-w-xl">
        <Heart className="mx-auto mb-4 text-pride-red" size={32} />
        <h2 className="text-3xl font-heading font-bold mb-4">Your Story Matters</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you're on your own journey of self-discovery, know this: you are not alone.
          You are valid. You are loved. And your story deserves to be told.
        </p>
      </div>
    </AnimatedSection>
  </div>
);

export default MyStory;
