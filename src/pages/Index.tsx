import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, Heart, Users, Globe, Sparkles, Quote, ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEOHead, StructuredData, organizationSchema, websiteSchema } from "@/components/SEOHead";
import heroPride from "@/assets/hero-pride.jpg";

const stats = [
  { value: "30M+", label: "LGBTQ+ Indians", icon: Users },
  { value: "15+", label: "Countries with communities", icon: Globe },
  { value: "∞", label: "Love to share", icon: Heart },
];

const quotes = [
  { text: "Be yourself; everyone else is already taken.", author: "Rohan Verma" },
  { text: "The beauty of standing up for your rights is others see you standing and stand up as well.", author: "Dev Shah" },
  { text: "We deserve to experience love fully, equally, without shame and without compromise.", author: "Vedant Mehta" },
];

const testimonials = [
  { name: "Sahil Ansari", role: "Community Member", text: "Finding this space changed my life. For the first time, I felt truly seen and accepted." },
  { name: "Ankit Malhotra", role: "Volunteer", text: "The resources here helped me navigate my journey with confidence and pride." },
  { name: "Arush Sharma", role: "Advocate", text: "This platform gives voice to stories that need to be heard. Powerful and beautiful." },
];

// Pride rainbow colors
const prideColors = [
  "#FF0018", // red
  "#FFA52C", // orange
  "#FFFF41", // yellow
  "#008018", // green
  "#0000F9", // blue
  "#86007D", // violet
  "#FF69B4", // pink
];

// Morphing words for the headline
const morphingWords = ["Beautiful", "Valid", "Enough", "Loved", "Worthy", "Powerful", "Free"];

// Stagger children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 14
    }
  }
};

// Morphing text component
const MorphingText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % morphingWords.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 40, filter: "blur(12px)", scale: 0.85 }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        exit={{ opacity: 0, y: -40, filter: "blur(12px)", scale: 1.1 }}
        transition={{ duration: 0.55, ease: [0.215, 0.61, 0.355, 1] }}
        className="pride-gradient-text inline-block"
      >
        {morphingWords[index]}
      </motion.span>
    </AnimatePresence>
  );
};

// Mouse parallax hook
const useMouseParallax = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX.set((clientX - centerX) / centerX);
    mouseY.set((clientY - centerY) / centerY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return { mouseX, mouseY };
};

// Orbiting particle component
const OrbitingParticle = ({ radius, duration, delay, color, size = 6 }: {
  radius: number; duration: number; delay: number; color: string; size?: number;
}) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    className="absolute top-1/2 left-1/2"
    style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
  >
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        top: 0,
        left: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, delay: delay * 0.5 }}
    />
  </motion.div>
);

// Pride stripe animated bar
const PrideStripes = () => (
  <div className="absolute bottom-0 left-0 right-0 h-1.5 flex overflow-hidden">
    {prideColors.map((color, i) => (
      <motion.div
        key={i}
        className="flex-1 h-full"
        style={{ background: color }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 + i * 0.08, ease: "easeOut" }}
      />
    ))}
  </div>
);

// Scroll indicator component
const ScrollIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 2.5, duration: 0.6 }}
    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
  >
    <motion.span
      className="text-xs text-muted-foreground tracking-widest uppercase"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Scroll */}
    </motion.span>
    <motion.div
      className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-1"
    >
      <motion.div
        className="w-1.5 h-2.5 rounded-full bg-primary"
        animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
    <motion.div
      animate={{ y: [0, 6, 0], opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
    >
      <ChevronDown size={16} className="text-primary/50" />
    </motion.div>
  </motion.div>
);

// Glitch text effect component
const GlitchText = ({ text, className }: { text: string; className?: string }) => (
  <motion.span
    className={`relative inline-block ${className}`}
    animate={{
      textShadow: [
        "0 0 0px transparent",
        "2px 0 0px rgba(255,0,100,0.3), -2px 0 0px rgba(0,100,255,0.3)",
        "0 0 0px transparent",
        "-1px 0 0px rgba(255,0,100,0.2), 1px 0 0px rgba(0,100,255,0.2)",
        "0 0 0px transparent",
      ],
    }}
    transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
  >
    {text}
  </motion.span>
);

// Ripple on click
const RippleButton = ({ children, className, style, onClick }: any) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    onClick?.();
  };

  return (
    <button className={`relative overflow-hidden ${className}`} style={style} onClick={addRipple}>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-white/20 pointer-events-none"
          style={{ left: r.x - 50, top: r.y - 50, width: 100, height: 100 }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
      {children}
    </button>
  );
};

// NEW: Floating hearts component
const FloatingHearts = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100
          }}
          animate={{ 
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            y: [-100, -window.innerHeight - 200],
            x: (Math.random() - 0.5) * 200
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeOut"
          }}
          className="absolute"
        >
          <Heart 
            size={16 + Math.random() * 20} 
            className="text-pride-pink/40" 
            fill="rgba(255,105,180,0.2)"
          />
        </motion.div>
      ))}
    </div>
  );
};

// NEW: Color wave background
const ColorWave = () => {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
      <defs>
        <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          {prideColors.map((color, i) => (
            <stop 
              key={i} 
              offset={`${(i / (prideColors.length - 1)) * 100}%`} 
              stopColor={color} 
              stopOpacity="0.3"
            />
          ))}
        </linearGradient>
      </defs>
      <motion.path
        d="M0 300 Q 150 200, 300 300 T 600 300 T 900 300 T 1200 300 T 1500 300 V 600 H 0 Z"
        fill="url(#wave-gradient)"
        animate={{
          d: [
            "M0 300 Q 150 200, 300 300 T 600 300 T 900 300 T 1200 300 T 1500 300 V 600 H 0 Z",
            "M0 250 Q 150 350, 300 250 T 600 250 T 900 250 T 1200 250 T 1500 250 V 600 H 0 Z",
            "M0 300 Q 150 200, 300 300 T 600 300 T 900 300 T 1200 300 T 1500 300 V 600 H 0 Z",
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </svg>
  );
};

// NEW: Animated Pride Flag Banner
const AnimatedPrideFlag = () => {
  return (
    <motion.div 
      className="absolute top-0 left-0 w-full h-2 flex"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {prideColors.map((color, i) => (
        <motion.div
          key={i}
          className="flex-1 h-full"
          style={{ backgroundColor: color }}
          animate={{
            height: ["4px", "8px", "4px"],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

// NEW: Confetti pieces
const ConfettiPieces = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-2 h-2"
          style={{
            backgroundColor: prideColors[i % prideColors.length],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, 100, 0],
            x: [0, (Math.random() - 0.5) * 50, 0],
            rotate: [0, 360],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// NEW: Pulsing text effect
const PulsingText = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    animate={{
      scale: [1, 1.02, 1],
      opacity: [1, 0.8, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.span>
);

// NEW: Rainbow trail effect for cursor
const useRainbowTrail = () => {
  const [trailPoints, setTrailPoints] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const id = Date.now();
      setTrailPoints(prev => [...prev, { x: e.clientX, y: e.clientY, id }].slice(-8));
      setTimeout(() => {
        setTrailPoints(prev => prev.filter(p => p.id !== id));
      }, 500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return trailPoints;
};

// NEW: Rainbow trail component
const RainbowTrail = () => {
  const trailPoints = useRainbowTrail();

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {trailPoints.map((point, index) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-4 h-4 rounded-full"
            style={{
              left: point.x - 8,
              top: point.y - 8,
              background: prideColors[index % prideColors.length],
              boxShadow: `0 0 15px ${prideColors[index % prideColors.length]}`,
              filter: 'blur(2px)'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// NEW: Bouncing gradient orbs
const BouncingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {prideColors.slice(0, 5).map((color, i) => (
        <motion.div
          key={`bounce-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 100 + i * 50,
            height: 100 + i * 50,
            background: `radial-gradient(circle, ${color}40, transparent)`,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// NEW: Sparkle trail on hover for CTA buttons
const SparkleTrail = ({ children }: { children: React.ReactNode }) => {
  const [sparkles, setSparkles] = useState<{ x: number; y: number; id: number }[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (Math.random() > 0.7) {
      const id = Date.now();
      setSparkles(prev => [...prev, { x, y, id }].slice(-5));
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== id));
      }, 500);
    }
  };

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className="relative">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 2, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute pointer-events-none"
          style={{ left: sparkle.x, top: sparkle.y }}
        >
          <Sparkles size={12} className="text-pride-yellow" />
        </motion.div>
      ))}
      {children}
    </div>
  );
};

const Index = () => {
  const { mouseX, mouseY } = useMouseParallax();
  const heroRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Smooth spring-based parallax
  const springConfig = { stiffness: 50, damping: 20 };
  const orb1X = useSpring(useTransform(mouseX, [-1, 1], [-30, 30]), springConfig);
  const orb1Y = useSpring(useTransform(mouseY, [-1, 1], [-20, 20]), springConfig);
  const orb2X = useSpring(useTransform(mouseX, [-1, 1], [20, -20]), springConfig);
  const orb2Y = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), springConfig);
  const contentX = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), springConfig);
  const contentY = useSpring(useTransform(mouseY, [-1, 1], [-5, 5]), springConfig);

  // Track mouse position for dynamic effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate gradient angle based on mouse position
  const gradientAngle = useTransform(
    mouseX,
    [-1, 1],
    [0, 360]
  );

  return (
    <>
      <SEOHead
        title="Home"
        description="Join PrideCommunity - a safe space for LGBTQ+ individuals. Access resources, connect with community members, attend events, and find support. Together we unite in diversity and celebrate pride."
        keywords={['LGBTQ+', 'pride', 'LGBTQ+ community', 'LGBTQ+ support', 'gay rights', 'transgender support', 'pride events', 'LGBT community']}
        canonicalUrl="/"
      />
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />

      {/* Rainbow trail effect */}
      <RainbowTrail />

      {/* ═══════════════════════════════════════════════════════ HERO */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden">

        {/* NEW: Animated Pride Flag at top */}
        <AnimatedPrideFlag />

        {/* NEW: Color wave background */}
        <ColorWave />

        {/* NEW: Bouncing orbs */}
        <BouncingOrbs />

        {/* ── Animated Grid Background */}
        <motion.div
          animate={{ 
            opacity: [0.4, 0.7, 0.4], 
            scale: [1, 1.02, 1],
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[linear-gradient(rgba(120,80,200,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,80,200,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)]"
        />

        {/* ── Slow Zoom Background Image */}
        <motion.div
          animate={{ 
            scale: [1, 1.08, 1], 
            rotate: [0, 0.5, -0.5, 0],
            filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)']
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full absolute inset-0"
        >
          <img src={heroPride} alt="" className="w-full h-full object-cover opacity-20 dark:opacity-10" />
        </motion.div>

        {/* ── Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />

        {/* ── Animated light sweep left→right */}
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-pride-purple/6 to-transparent"
        />
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 7 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-pride-pink/5 to-transparent"
        />

        {/* NEW: Rotating gradient overlay based on mouse */}
        <motion.div
          style={{
            background: useTransform(gradientAngle, (angle) => 
              `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168,85,247,0.15) 0%, transparent 50%)`
            )
          }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* ── Animated color-shifting radial glow */}
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 25% 50%, rgba(168,85,247,0.18) 0%, transparent 55%)",
              "radial-gradient(circle at 75% 50%, rgba(236,72,153,0.18) 0%, transparent 55%)",
              "radial-gradient(circle at 50% 25%, rgba(59,130,246,0.18) 0%, transparent 55%)",
              "radial-gradient(circle at 50% 75%, rgba(34,197,94,0.12) 0%, transparent 55%)",
              "radial-gradient(circle at 25% 50%, rgba(168,85,247,0.18) 0%, transparent 55%)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute inset-0"
        />

        {/* NEW: Floating hearts */}
        <FloatingHearts />

        {/* NEW: Confetti pieces */}
        <ConfettiPieces />

        {/* ══════════════ MOUSE-PARALLAX ORBS */}
        <motion.div
          style={{ x: orb1X, y: orb1Y }}
          className="absolute top-20 left-[5%] w-80 h-80 pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 0.9, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
              borderRadius: ["50%", "40% 60% 70% 30% / 40% 50% 60% 50%", "50%"],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full rounded-full bg-gradient-to-br from-pride-purple/35 to-pride-blue/25 blur-3xl"
          />
        </motion.div>

        <motion.div
          style={{ x: orb2X, y: orb2Y }}
          className="absolute bottom-20 right-[10%] w-96 h-96 pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 0.85, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-full h-full rounded-full bg-gradient-to-br from-pride-pink/30 to-pride-red/20 blur-3xl"
          />
        </motion.div>

        <motion.div
          animate={{
            x: [0, 60, -30, 50, 0],
            y: [0, -60, 40, -50, 0],
            scale: [1, 1.1, 1.3, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 right-[25%] w-64 h-64 bg-gradient-to-br from-pride-orange/25 to-pride-yellow/18 blur-3xl pointer-events-none"
        />

        {/* ══════════════ ORBITING PARTICLE SYSTEM */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {prideColors.map((color, i) => (
            <OrbitingParticle
              key={i}
              radius={200 + i * 40}
              duration={20 + i * 5}
              delay={i * 1.2}
              color={color}
              size={i % 2 === 0 ? 6 : 4}
            />
          ))}
          {/* Inner fast orbit */}
          {prideColors.slice(0, 4).map((color, i) => (
            <OrbitingParticle
              key={`inner-${i}`}
              radius={80 + i * 20}
              duration={8 + i * 2}
              delay={i * 0.5}
              color={color}
              size={3}
            />
          ))}
        </div>

        {/* ══════════════ ROTATING RINGS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              rotate: [0, 360],
              borderColor: [
                "rgba(168,85,247,0.2)", "rgba(236,72,153,0.2)",
                "rgba(59,130,246,0.2)", "rgba(168,85,247,0.2)",
              ],
            }}
            transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" }, borderColor: { duration: 10, repeat: Infinity } }}
            className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
          />
          <motion.div
            animate={{
              rotate: [0, -360],
              borderColor: [
                "rgba(236,72,153,0.15)", "rgba(168,85,247,0.15)",
                "rgba(59,130,246,0.15)", "rgba(236,72,153,0.15)",
              ],
            }}
            transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" }, borderColor: { duration: 8, repeat: Infinity } }}
            className="absolute top-1/2 left-1/2 w-[480px] h-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
          />
          {/* Dashed inner ring with dot tracer */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="absolute inset-0 border-2 border-dashed border-pride-purple/20 rounded-full" />
            <motion.div
              className="absolute top-0 left-1/2 w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-pride-pink/50 blur-sm"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Pulsing core */}
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.08, 0.25, 0.08] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pride-purple/40 to-pride-pink/40 blur-xl"
          />
        </div>

        {/* ══════════════ TWINKLING STARS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.8, 0] }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 6,
                ease: "easeInOut",
              }}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: "0 0 8px rgba(255,255,255,0.9)",
              }}
            />
          ))}
        </div>

        {/* ══════════════ FLOATING PARTICLES */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(28)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1.5, 0],
                y: [0, -160 - Math.random() * 80],
                x: [0, (Math.random() - 0.5) * 90],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut",
              }}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: `${55 + Math.random() * 30}%`,
                background: prideColors[i % 7],
                boxShadow: `0 0 8px ${prideColors[i % 7]}`,
              }}
            />
          ))}

          {/* Larger floating shapes */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`shape-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.35, 0],
                scale: [0, 1, 0],
                y: [0, -220],
                x: [0, (Math.random() - 0.5) * 140],
                rotate: [0, 180],
              }}
              transition={{
                duration: 9 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "easeOut",
              }}
              className="absolute w-5 h-5 rounded-lg"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${68 + Math.random() * 20}%`,
                background: `linear-gradient(135deg, ${prideColors[i % 7]}55, transparent)`,
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          ))}

          {/* Horizontal streak lines */}
          <motion.div
            animate={{ x: [-200, typeof window !== "undefined" ? window.innerWidth + 200 : 1800] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute top-[18%] w-40 h-px bg-gradient-to-r from-transparent via-pride-purple/40 to-transparent"
          />
          <motion.div
            animate={{ x: [-200, typeof window !== "undefined" ? window.innerWidth + 200 : 1800] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear", delay: 6 }}
            className="absolute top-[80%] w-56 h-px bg-gradient-to-r from-transparent via-pride-pink/35 to-transparent"
          />
          <motion.div
            animate={{ x: [typeof window !== "undefined" ? window.innerWidth + 200 : 1800, -200] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 10 }}
            className="absolute top-[45%] w-32 h-px bg-gradient-to-r from-transparent via-pride-blue/30 to-transparent"
          />
        </div>

        {/* ══════════════ MAIN CONTENT (with subtle mouse parallax) */}
        <motion.div
          style={{ x: contentX, y: contentY }}
          className="container mx-auto px-4 relative z-10"
        >
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* ── Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-sm font-medium text-primary mb-8 group cursor-pointer"
              whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(168,85,247,0.25)" }}
              whileTap={{ scale: 0.94 }}
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Sparkles size={16} className="text-pride-yellow" />
              </motion.span>
              <span>Celebrating Pride &amp; Identity</span>
              <motion.div
                animate={{ x: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                <ArrowRight size={13} className="opacity-70" />
              </motion.div>
            </motion.div>

            {/* ── Heading with glitch + morphing word */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold leading-tight mb-6"
            >
              <motion.span
                className="block text-foreground"
                animate={{
                  textShadow: [
                    "0 0 0px rgba(168,85,247,0)",
                    "0 0 25px rgba(168,85,247,0.3)",
                    "0 0 0px rgba(168,85,247,0)",
                  ],
                  y: [0, -3, 0, 3, 0],
                }}
                transition={{
                  textShadow: { duration: 3.5, repeat: Infinity },
                  y: { duration: 6, repeat: Infinity },
                }}
              >
                <GlitchText text="Your Identity Is" />
              </motion.span>

              {/* Morphing animated word */}
              <span className="inline-block min-w-[300px]">
                <MorphingText />
              </span>
            </motion.h1>

            {/* ── Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              A safe space to celebrate who you are, share your story, and connect with a community
              that embraces{" "}
              <motion.span
                className="text-pride-pink font-semibold inline-block"
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 4, -4, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                love
              </motion.span>{" "}
              in all its{" "}
              <motion.span
                className="pride-gradient-text font-semibold inline-block"
                animate={{ filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                colors
              </motion.span>.
            </motion.p>

            {/* ── CTA Buttons with sparkle trail */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              <Link to="/my-story">
                <SparkleTrail>
                  <RippleButton
                    className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-heading font-semibold text-white overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                      boxShadow: "0 4px 25px hsl(var(--primary) / 0.3)",
                    }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
                    />
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <Sparkles size={18} className="mr-1" />
                    </motion.span>
                    <span>Read My Story</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  </RippleButton>
                </SparkleTrail>
              </Link>

              <Link to="/community">
                <SparkleTrail>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "hsl(var(--primary) / 0.12)",
                      boxShadow: "0 0 25px hsl(var(--primary) / 0.2)",
                      y: -2,
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-heading font-semibold border-2 transition-all duration-300 overflow-hidden"
                    style={{ borderColor: "hsl(var(--primary))", color: "hsl(var(--primary))" }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart size={18} className="text-pride-pink fill-pride-pink/30" />
                    </motion.span>
                    <span>Join Community</span>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/6 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"
                    />
                  </motion.button>
                </SparkleTrail>
              </Link>
            </motion.div>

            {/* ── NEW: Animated progress bar */}
            <motion.div
              variants={itemVariants}
              className="max-w-md mx-auto mt-8"
            >
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Community Growth</span>
                <PulsingText>
                  <span className="pride-gradient-text">+15% this month</span>
                </PulsingText>
              </div>
              <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full pride-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Pride stripe bar at bottom of hero */}
        <PrideStripes />

        {/* ── Scroll indicator */}
        <ScrollIndicator />
      </section>

      {/* Rest of the sections remain the same... */}
      
      {/* ═══════════════════════════════════════════════════════ PRIDE STATEMENT */}
      <AnimatedSection className="py-20 relative overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-pride-purple/10 to-pride-pink/10 blur-3xl"
        />
        <motion.div
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-pride-blue/10 to-pride-green/10 blur-3xl"
        />

        <div className="container mx-auto px-4 text-center max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block p-1 rounded-2xl pride-gradient mb-8 animate-pride-shift">
              <div className="bg-background rounded-xl px-8 py-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl font-heading font-bold mb-4"
                >
                  Everyone Deserves to Be{" "}
                  <span className="pride-gradient-text">Loved</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground leading-relaxed"
                >
                  We believe that love knows no boundaries. Regardless of who you are or whom you love,
                  you deserve dignity, respect, and the freedom to live authentically.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════ STATS */}
      <AnimatedSection className="py-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,80,200,0.05)_0%,transparent_70%)]" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass rounded-2xl p-8 text-center group cursor-default"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  <stat.icon className="mx-auto mb-3 text-primary group-hover:text-pride-pink transition-colors" size={32} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                  className="text-5xl font-heading font-bold pride-gradient-text mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════ QUOTES */}
      <AnimatedSection className="py-20 pride-gradient-subtle relative overflow-hidden">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-10 left-[10%] w-4 h-4 rounded-full bg-pride-purple/30"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 right-[15%] w-3 h-3 rounded-full bg-pride-pink/30"
        />

        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-heading font-bold text-center mb-12"
          >
            Words That <span className="pride-gradient-text">Inspire</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quotes.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.1, type: "spring" }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass rounded-2xl p-6 group"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i }}
                >
                  <Quote size={28} className="text-primary/50 mb-4 group-hover:text-pride-purple transition-colors" />
                </motion.div>
                <p className="text-foreground leading-relaxed mb-4 italic text-lg">"{q.text}"</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-sm font-medium pride-gradient-text"
                >
                  — {q.author}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════ TESTIMONIALS */}
      <AnimatedSection className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pride-purple/5 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-heading font-bold text-center mb-4"
          >
            Community <span className="pride-gradient-text">Voices</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center text-muted-foreground mb-12 max-w-lg mx-auto"
          >
            Hear from people whose lives have been touched by this community.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="glass rounded-2xl p-6 group relative overflow-hidden"
              >
                <motion.div
                  className="absolute top-4 right-4 text-6xl font-heading text-primary/10 group-hover:text-primary/20 transition-colors"
                >
                  "
                </motion.div>
                <p className="text-muted-foreground leading-relaxed mb-6 relative z-10 group-hover:text-foreground transition-colors">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-full pride-gradient flex items-center justify-center text-white font-bold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {t.name.charAt(0)}
                  </motion.div>
                  <div>
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="font-semibold"
                    >
                      {t.name}
                    </motion.p>
                    <p className="text-xs text-primary">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════ CTA */}
      <AnimatedSection className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-pride-purple/20 via-pride-pink/20 to-pride-blue/20 blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="pride-gradient rounded-3xl p-1 animate-pride-shift"
          >
            <motion.div
              className="bg-background rounded-[calc(1.5rem-4px)] p-10 sm:p-16 text-center"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl font-heading font-bold mb-4"
              >
                Ready to Make a <span className="pride-gradient-text">Difference</span>?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-8 max-w-lg mx-auto"
              >
                Join us in building a more inclusive world. Every voice matters, every story counts.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to="/resources">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--primary) / 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-pride inline-flex items-center gap-2"
                  >
                    Explore Resources <ArrowRight size={16} />
                  </motion.button>
                </Link>
                <Link to="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-outline-pride"
                  >
                    Get in Touch
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
};

export default Index;