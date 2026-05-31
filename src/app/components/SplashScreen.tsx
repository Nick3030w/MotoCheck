import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuthContext } from "@/contexts/AuthContext";

export function SplashScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuthContext();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // No navegar hasta que auth termine de cargar
    if (loading) return;
    if (hasNavigated.current) return;

    // Esperar mínimo 2.5s para la animación del splash
    const timer = setTimeout(() => {
      if (hasNavigated.current) return;
      hasNavigated.current = true;

      if (isAuthenticated) {
        navigate("/home", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="h-full bg-gradient-to-b from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative mb-8"
      >
        <img src="/logo.png" alt="MotoCheck" className="w-48 h-48 object-contain" />
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
