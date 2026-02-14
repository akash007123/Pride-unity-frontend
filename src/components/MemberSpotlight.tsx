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
    name: "Arjun Patel",
    pronouns: "he/him",
    role: "Community Leader",
    story:
      "After years of hiding his true self, Arjun found the courage to come out and now dedicates his life to helping others on their journey in India.",
    quote:
      "The moment I stopped trying to fit into someone else's expectations was the moment I finally felt free.",
    flag: "Gay",
    flagColors: ["#0072FF", "#00D4FF", "#FFFFFF", "#7B2CBF", "#9B26B6"],
  },
  {
    id: 2,
    name: "Vikram Sharma",
    pronouns: "he/him",
    role: "Pride Organizer",
    story:
      "Vikram has organized pride events across multiple Indian cities, creating spaces where everyone feels welcome and celebrated.",
    quote:
      "Pride isn't just a month—it's a daily commitment to being unapologetically yourself.",
    flag: "Bisexual",
    flagColors: ["#D1136E", "#0057B7", "#FFFFFF"],
  },
  {
    id: 3,
    name: "Aditya Nair",
    pronouns: "he/him",
    role: "Youth Advocate",
    story:
      "Starting as a scared teenager, Aditya now runs workshops for LGBTQ+ youth, ensuring no one feels as alone as they once did.",
    quote:
      "Every young person deserves to know that their identity is something to celebrate, not hide.",
    flag: "Queer",
    flagColors: ["#FF6B6B", "#FF9E00", "#FFD93D", "#6BCB77", "#4D96FF", "#9B59D6"],
  },
];

export const MemberSpotlight = () => {
  return (
    <section className="py-16">
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
          <h2 className="text-3xl font-bold mb-4">
            Faces of Our <span className="text-primary">Community</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the incredible individuals who make our community vibrant, diverse, and full of love.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spotlightMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden">
                {/* Simple flag strip */}
                <div 
                  className="h-1 w-full"
                  style={{ 
                    background: `linear-gradient(to right, ${member.flagColors.join(", ")})` 
                  }}
                />
                
                <CardContent className="p-6">
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-20 h-20 border-2 border-border">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Info */}
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-primary">{member.pronouns}</p>
                    <p className="text-xs text-muted-foreground mt-1">{member.flag}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>

                  {/* Story */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {member.story}
                  </p>

                  {/* Quote */}
                  <div className="bg-muted/30 p-4 rounded-lg mb-4">
                    <Quote size={16} className="text-primary/40 mb-1" />
                    <p className="text-sm italic text-muted-foreground">
                      "{member.quote}"
                    </p>
                  </div>

                  {/* Actions */}
                  {/* <div className="flex items-center justify-center gap-2 pt-4 border-t">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Heart size={14} />
                      Support
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Star size={14} />
                      Follow
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          {/* <Button variant="outline"> */}
            {/* View All Members */}
          {/* </Button> */}
        </motion.div>
      </div>
    </section>
  );
};