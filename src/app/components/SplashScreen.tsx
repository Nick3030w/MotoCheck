import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Zap, Cpu } from "lucide-react";

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-full bg-gradient-to-b from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] rounded-3xl flex items-center justify-center shadow-lg shadow-[#FF6B2B]/50">
          <div className="relative">
            <Cpu className="w-16 h-16 text-white absolute top-0 left-0" strokeWidth={1.5} />
            <Zap className="w-10 h-10 text-[#0F0F0F] absolute bottom-0 right-0" strokeWidth={3} />
          </div>
        </div>
      </motion.div>

      {/* Brand name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center mb-4"
      >
        <h1 className="text-4xl font-[Space_Grotesk] mb-2" style={{ fontWeight: 700 }}>
          MOTO<span className="text-[#FF6B2B]">CHECK</span>
        </h1>
        <p className="text-[#888888] text-sm">Tu mecánico inteligente 24/7</p>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="mt-12"
      >
        <div className="w-48 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-[#FF6B2B] to-[#FF8C5A]"
          />
        </div>
      </motion.div>
    </div>
  );
}
