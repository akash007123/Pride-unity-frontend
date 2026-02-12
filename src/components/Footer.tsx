import { Link } from "react-router-dom";
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Heart, 
  ArrowRight,
  Sparkles,
  Rainbow
} from "lucide-react";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";

const quickLinks = [
  { path: "/about", label: "About" },
  { path: "/my-story", label: "My Story" },
  { path: "/resources", label: "Resources" },
  { path: "/community", label: "Community" },
  { path: "/events", label: "Events" },
  { path: "/blog", label: "Blog" },
  { path: "/faq", label: "FAQ" },
  { path: "/contact", label: "Contact" },
];

const communityLinks = [
  { path: "/support", label: "Support Groups" },
  { path: "/volunteer", label: "Volunteer" },
  { path: "/partners", label: "Partners" },
  { path: "/pride-events", label: "Pride Events" },
];

export const Footer = () => (
  <footer className="relative mt-auto" role="contentinfo">
    {/* Animated rainbow gradient bar */}
    <div className="h-2 pride-gradient animate-gradient-shift relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
    
    <div className="bg-gradient-to-b from-background via-background/95 to-background border-t border-border/40">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pride-red/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pride-blue/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20 relative">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand column - lg:col-span-4 */}
          <div className="lg:col-span-4 space-y-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-3xl font-heading font-bold bg-gradient-to-r from-pride-red via-pride-orange to-pride-purple bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              PrideVoice
              <Sparkles size={20} className="text-pride-yellow" />
            </Link>
            
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-sm">
              Celebrating identity, embracing love, and advocating for a world where everyone belongs. 
              Your voice matters, your story matters, you matter.
            </p>
            
            {/* Social links with hover effects */}
            <div className="flex gap-3 pt-2">
              <a 
                href="#" 
                aria-label="Instagram" 
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-gradient-to-br hover:from-pride-purple/20 hover:to-pride-pink/20 border border-border/50 hover:border-pride-purple/30 transition-all duration-300 group"
              >
                <Instagram size={18} className="text-muted-foreground group-hover:text-pride-purple group-hover:scale-110 transition-all" />
              </a>
              <a 
                href="#" 
                aria-label="Twitter" 
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-gradient-to-br hover:from-pride-blue/20 hover:to-pride-cyan/20 border border-border/50 hover:border-pride-blue/30 transition-all duration-300 group"
              >
                <Twitter size={18} className="text-muted-foreground group-hover:text-pride-blue group-hover:scale-110 transition-all" />
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn" 
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-gradient-to-br hover:from-pride-blue/20 hover:to-pride-indigo/20 border border-border/50 hover:border-pride-indigo/30 transition-all duration-300 group"
              >
                <Linkedin size={18} className="text-muted-foreground group-hover:text-pride-indigo group-hover:scale-110 transition-all" />
              </a>
              <a 
                href="#" 
                aria-label="Pride Events" 
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-gradient-to-br hover:from-pride-red/20 hover:to-pride-orange/20 border border-border/50 hover:border-pride-red/30 transition-all duration-300 group"
              >
                <Rainbow size={18} className="text-muted-foreground group-hover:text-pride-red group-hover:scale-110 transition-all" />
              </a>
            </div>

            {/* Pride Quote - Now placed after social icons */}
            <div className="bg-gradient-to-br from-muted/30 via-muted/20 to-transparent p-5 rounded-2xl border border-border/30 backdrop-blur-sm max-w-sm">
              <h4 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-lg">✨</span>
                Pride Quote
              </h4>
              <blockquote className="text-sm text-muted-foreground/90 italic leading-relaxed pl-4 border-l-4 border-gradient-to-b from-pride-red via-pride-yellow to-pride-blue rounded">
                "It takes no compromise to give people their rights. It takes no money to respect the individual."
              </blockquote>
              <p className="text-xs text-muted-foreground/70 mt-3 font-medium flex items-center gap-2">
                <span className="w-1 h-1 bg-pride-red rounded-full" />
                — Harvey Milk, LGBTQ+ Rights Activist
              </p>
            </div>
          </div>

          {/* Quick Links - lg:col-span-2 */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-foreground mb-5 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-pride-red to-pride-orange rounded-full" />
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community - lg:col-span-2 */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-foreground mb-5 relative inline-block">
              Community
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-pride-blue to-pride-indigo rounded-full" />
            </h4>
            <ul className="space-y-3">
              {communityLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - lg:col-span-4 */}
          <div className="lg:col-span-4">
            <h4 className="font-heading font-semibold text-foreground mb-5 relative inline-block">
              Stay Connected
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-pride-green to-pride-blue rounded-full" />
            </h4>
            <NewsletterSubscription />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground/70 group">
              <span className="relative">
                Made with 
                <Heart 
                  size={12} 
                  className="inline mx-1 text-pride-red fill-pride-red/20 group-hover:scale-125 group-hover:fill-pride-red/40 transition-all duration-300" 
                /> 
                by PrideVoice
              </span>
              <span className="w-1 h-1 bg-muted-foreground/30 rounded-full mx-2" />
              <span>© {new Date().getFullYear()}</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
              <Link to="/privacy" className="hover:text-foreground transition-colors hover:underline underline-offset-4">
                Privacy
              </Link>
              <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
              <Link to="/terms" className="hover:text-foreground transition-colors hover:underline underline-offset-4">
                Terms
              </Link>
              <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
              <Link to="/accessibility" className="hover:text-foreground transition-colors hover:underline underline-offset-4">
                Accessibility
              </Link>
            </div>
            
            <p className="text-xs text-muted-foreground/70 font-medium bg-gradient-to-r from-pride-red/10 via-pride-purple/10 to-pride-blue/10 px-4 py-1.5 rounded-full border border-border/30">
              All love is valid. All identities are beautiful. 🏳️‍🌈
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);