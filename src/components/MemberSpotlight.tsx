import { motion } from "framer-motion";
import { Quote, Heart, Star, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SpotlightMember {
  id: number;
  name: string;
  pronouns: string;
  role: string;
  story: string;
  quote: string;
  flag: string;
  flagColors: string[];
  avatar?: string;
}

const spotlightMembers: SpotlightMember[] = [
  {
    id: 1,
    name: "Jordan Lee",
    pronouns: "they/them",
    role: "Community Leader",
    story:
      "After years of hiding their true self, Jordan found the courage to come out and now dedicates their life to helping others on their journey.",
    quote:
      "The moment I stopped trying to fit into someone else's mold was the moment I finally felt free.",
    flag: "Non-binary",
    flagColors: ["#FCF434", "#FFFFFF", "#9C59D6", "#2C2C2C"],
  },
  {
    id: 2,
    name: "Alex Rivera",
    pronouns: "he/him",
    role: "Pride Organizer",
    story:
      "Alex has organized pride events across three cities, creating spaces where everyone feels welcome and celebrated.",
    quote:
      "Pride isn't just a month—it's a daily commitment to being unapologetically yourself.",
    flag: "Gay Male",
    flagColors: ["#0072FF", "#00D4FF", "#FFFFFF", "#7B2CBF", "#9B26B6"],
  },
  {
    id: 3,
    name: "Sam Chen",
    pronouns: "xe/xem",
    role: "Youth Advocate",
    story:
      "Starting as a scared teenager, Sam now runs workshops for LGBTQ+ youth, ensuring no one feels as alone as they once did.",
    quote:
      "Every young person deserves to know that their identity is something to celebrate, not hide.",
    flag: "Queer",
    flagColors: ["#FF6B6B", "#FF9E00", "#FFD93D", "#6BCB77", "#4D96FF", "#9B59D6"],
  },
];

export const MemberSpotlight = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles size={14} />
            Community Spotlight
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Faces of Our <span className="pride-gradient-text">Community</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the incredible individuals who make our community vibrant, diverse, and full of love.
          </p>
        </motion.div>

        {/* Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spotlightMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full glass card-hover overflow-hidden">
                {/* Pride Flag Strip */}
                <div
                  className="h-2 flex"
                  style={{
                    background: `linear-gradient(to right, ${member.flagColors.join(", ") || member.flagColors[0]})`,
                  }}
                />

                <CardContent className="p-6">
                  {/* Avatar with Flag Background */}
                  <div className="relative mb-6">
                    <div
                      className="absolute inset-0 rounded-full opacity-20"
                      style={{
                        background: `linear-gradient(135deg, ${member.flagColors.slice(0, 2).join(", ") || member.flagColors[0]})`,
                      }}
                    />
                    <Avatar className="w-24 h-24 mx-auto border-4 border-background relative z-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {/* Flag Badge */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 px-3 py-1 rounded-full bg-background border text-xs font-medium shadow-sm">
                      {member.flag}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-heading font-bold">{member.name}</h3>
                    <p className="text-sm text-primary">{member.pronouns}</p>
                    <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
                  </div>

                  {/* Story */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {member.story}
                  </p>

                  {/* Quote */}
                  <div className="relative p-4 rounded-xl bg-muted/50">
                    <Quote
                      size={20}
                      className="text-primary/30 absolute top-2 left-2"
                    />
                    <p className="text-sm italic text-muted-foreground pl-6">
                      "{member.quote}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Heart size={16} className="mr-1" />
                      Support
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Star size={16} className="mr-1" />
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Button variant="outline" className="btn-outline-pride">
            View All Members
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
