import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const PageLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* Pride spinner */}
            <div className="relative w-16 h-16">
              <motion.div
                className="absolute inset-0 rounded-full pride-gradient"
                style={{ padding: "3px" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-background" />
              </motion.div>
            </div>
            <motion.span
              className="font-heading text-lg font-semibold pride-gradient-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              PrideVoice
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
