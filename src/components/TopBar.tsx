import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, Heart } from "lucide-react";

export const TopBar = () => (
  <div className="pride-gradient animate-pride-shift relative overflow-hidden">
    <div className="container mx-auto px-4 h-9 flex items-center justify-between text-sm font-medium text-white">
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-1.5"
      >
        Love is Love <span className="text-base">🏳️‍🌈</span>
      </motion.span>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <a href="#" aria-label="Instagram" className="hover:scale-110 transition-transform"><Instagram size={14} /></a>
          <a href="#" aria-label="Twitter" className="hover:scale-110 transition-transform"><Twitter size={14} /></a>
          <a href="#" aria-label="LinkedIn" className="hover:scale-110 transition-transform"><Linkedin size={14} /></a>
        </div>
        <a href="#" className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-3 py-0.5 text-xs font-semibold transition-all">
          <Heart size={10} /> Support
        </a>
      </div>
    </div>
  </div>
);
