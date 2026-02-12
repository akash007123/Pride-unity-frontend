import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Heart } from "lucide-react";

const faqCategories = [
  {
    title: "General Questions",
    items: [
      {
        question: "What is PrideVoice?",
        answer: "PrideVoice is a digital platform dedicated to celebrating LGBTQ+ identities, providing resources, fostering community connections, and amplifying voices that deserve to be heard. We believe in creating a safe, inclusive space where everyone can be their authentic self."
      },
      {
        question: "Who can use PrideVoice?",
        answer: "PrideVoice is designed for everyone! Whether you're a member of the LGBTQ+ community, an ally, a family member, or simply someone who wants to learn more, our platform welcomes all who share our values of love, acceptance, and equality."
      },
      {
        question: "Is PrideVoice free to use?",
        answer: "Yes! PrideVoice is completely free to access. All our resources, community features, blog content, and educational materials are available at no cost. We believe that access to information and community support should be available to everyone."
      }
    ]
  },
  {
    title: "Identity & Terminology",
    items: [
      {
        question: "What does LGBTQ+ mean?",
        answer: "LGBTQ+ stands for Lesbian, Gay, Bisexual, Transgender, and Queer (or Questioning). The '+' represents other identities including Pansexual, Non-binary, Asexual, Intersex, and more. It's an umbrella term for people whose sexual orientation or gender identity differs from the heterosexual and cisgender majority."
      },
      {
        question: "What's the difference between sex, gender identity, and sexual orientation?",
        answer: "Sex refers to biological characteristics. Gender identity is one's internal sense of being male, female, both, neither, or somewhere along the spectrum. Sexual orientation describes who you're attracted to. These are all distinct but related aspects of a person's identity."
      },
      {
        question: "What does it mean to be non-binary?",
        answer: "Non-binary individuals have a gender identity that doesn't fit exclusively into the traditional categories of male or female. Some non-binary people identify as a combination of genders, as no gender at all, or as a gender different from male/female."
      },
      {
        question: "What does cisgender mean?",
        answer: "Cisgender refers to people whose gender identity matches the sex they were assigned at birth. The prefix 'cis-' means 'on the same side.' It's simply the opposite of 'transgender' and is not a slur or offensive term."
      }
    ]
  },
  {
    title: "Coming Out",
    items: [
      {
        question: "How do I know if I'm ready to come out?",
        answer: "Coming out is a deeply personal decision. Ask yourself: Do I feel safe? Do I have support systems in place? Am I doing this for myself or others? There's no right timeline. You'll know when you feel ready, and it's okay to take your time."
      },
      {
        question: "How should I come out to my family?",
        answer: "Choose a calm time when you won't be interrupted. Be honest and clear about your feelings. Prepare for various reactions and give them time to process. Remember, their initial reaction may not be their final one. Consider having a supportive friend or counselor with you or available."
      },
      {
        question: "What if my family doesn't accept me?",
        answer: "Unfortunately, not everyone receives immediate acceptance. Your safety is the priority. Consider reaching out to chosen family, friends, or LGBTQ+ support organizations. Remember that your identity is valid regardless of others' acceptance. Professional counseling can also help you navigate difficult family dynamics."
      }
    ]
  },
  {
    title: "Mental Health & Support",
    items: [
      {
        question: "Where can I find LGBTQ+-affirming mental health support?",
        answer: "We recommend the Trevor Project (thetrevorproject.org) for youth, and organizations like GLMA (glma.org) can help you find LGBTQ+-friendly healthcare providers. Psychology Today also has a directory of therapists who specialize in LGBTQ+ issues."
      },
      {
        question: "I'm struggling with my mental health. What resources are available?",
        answer: "The 988 Suicide & Crisis Lifeline (call or text 988 in the US) is available 24/7. The Trevor Project offers crisis support for LGBTQ+ youth (1-866-488-7386). Remember, seeking help is a sign of strength, not weakness."
      },
      {
        question: "How can I support a friend who's coming out?",
        answer: "Listen without judgment, assure them of your love and support, use their chosen name and pronouns, educate yourself about LGBTQ+ issues, and respect their privacy about what they share with others. Your acceptance can make a world of difference."
      }
    ]
  },
  {
    title: "Community & Events",
    items: [
      {
        question: "How can I get involved in my local LGBTQ+ community?",
        answer: "Look for local LGBTQ+ centers, PFLAG chapters, or pride organizations in your area. Many cities have social groups, sports leagues, and volunteer opportunities. Online communities can also be a great starting point for connection."
      },
      {
        question: "What should I expect at my first pride event?",
        answer: "Pride events are celebrations of love and identity! Expect vibrant energy, rainbow colors everywhere, diverse communities coming together, and lots of positive vibes. Remember: you don't need to dress a certain way or be 'pride enough' – just being yourself is perfect."
      },
      {
        question: "Can straight/cisgender people attend pride events?",
        answer: "Absolutely! Allies are welcome and appreciated at pride events. Just be mindful to center LGBTQ+ voices, respect boundaries, and celebrate with genuine enthusiasm. Your presence shows solidarity and helps create a more inclusive world."
      }
    ]
  },
  {
    title: "Resources & Links",
    items: [
      {
        question: "How can I submit my story to PrideVoice?",
        answer: "We'd love to hear from you! Visit our Contact page and send us a message with 'Story Submission' in the subject line. We review all submissions and will get back to you about featuring your experience on our platform."
      },
      {
        question: "How can I partner with PrideVoice?",
        answer: "We're always open to collaborations that align with our mission. Please reach out through our Contact page with details about your organization or proposal. We'll review and get back to you promptly."
      },
      {
        question: "How can I support PrideVoice's mission?",
        answer: "There are many ways to support! You can share our resources with others, volunteer your time, participate in events, or make a donation. Every act of support helps us create a more inclusive world for everyone."
      }
    ]
  }
];

const FAQ = () => (
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
            <HelpCircle size={14} /> Frequently Asked Questions
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
            Your Questions, <span className="pride-gradient-text">Answered</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Find answers to common questions about LGBTQ+ identities, community resources,
            and how PrideVoice can support you on your journey.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Quick Help Banner */}
    <AnimatedSection className="py-8">
      <div className="container mx-auto px-4">
        <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-heading font-semibold">Can't find what you're looking for?</h3>
              <p className="text-sm text-muted-foreground">Our team is here to help answer any questions.</p>
            </div>
          </div>
          <a href="/contact" className="btn-pride whitespace-nowrap">
            Contact Us
          </a>
        </div>
      </div>
    </AnimatedSection>

    {/* FAQ Categories */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        {faqCategories.map((category, ci) => (
          <AnimatedSection key={ci} className={`mb-12 ${ci % 2 === 1 ? "pride-gradient-subtle rounded-3xl p-8" : ""}`}>
            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
              {category.title}
            </h2>
            <div className="glass rounded-2xl overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                {category.items.map((item, ii) => (
                  <AccordionItem key={ii} value={`${ci}-${ii}`} className="px-6">
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="font-medium text-foreground pr-4">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>

    {/* Additional Support */}
    <AnimatedSection className="py-20 pride-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="glass rounded-3xl p-10 sm:p-16 text-center">
          <Heart className="mx-auto mb-4 text-pride-red" size={40} />
          <h2 className="text-3xl font-heading font-bold mb-4">Remember: You Are Not Alone</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Whether you're questioning, coming out, or celebrating your authentic self,
            there's a community here for you. Every question is valid, and every journey matters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/resources" className="btn-pride inline-flex items-center gap-2">
              Explore Resources
            </a>
            <a href="/community" className="btn-outline-pride inline-flex items-center gap-2">
              Join Community
            </a>
          </div>
        </div>
      </div>
    </AnimatedSection>
  </div>
);

export default FAQ;
