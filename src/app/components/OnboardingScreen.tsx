import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Mic, MessageCircle, ChevronRight } from "lucide-react";

const slides = [
  {
    icon: Camera,
    title: "Diagnostica con una foto",
    description: "Captura o sube imágenes de tu moto. Nuestra IA analizará componentes y detectará fallas visibles al instante.",
    color: "#FF6B2B",
  },
  {
    icon: Mic,
    title: "Escucha inteligente",
    description: "Graba el sonido de tu motor o componentes. La IA identificará ruidos anormales y posibles problemas mecánicos.",
    color: "#FF8C5A",
  },
  {
    icon: MessageCircle,
    title: "Habla con la IA",
    description: "Describe síntomas en lenguaje natural. El asistente te guiará con preguntas precisas para un diagnóstico completo.",
    color: "#FFA07A",
  },
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/login");
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  return (
    <div className="h-full bg-[#0F0F0F] flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-[#888888] text-sm hover:text-white transition-colors"
        >
          Saltar
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {(() => {
              const CurrentIcon = slides[currentSlide].icon;
              return (
                <>
                  {/* Icon */}
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8"
                    style={{ backgroundColor: `${slides[currentSlide].color}20` }}
                  >
                    <CurrentIcon
                      className="w-16 h-16"
                      style={{ color: slides[currentSlide].color }}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-[Space_Grotesk] mb-4" style={{ fontWeight: 700 }}>
                    {slides[currentSlide].title}
                  </h2>

                  {/* Description */}
                  <p className="text-[#888888] text-base leading-relaxed max-w-sm">
                    {slides[currentSlide].description}
                  </p>
                </>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-[#FF6B2B]" : "w-2 bg-[#888888]/30"
            }`}
          />
        ))}
      </div>

      {/* Next button */}
      <div className="px-8 pb-8">
        <button
          onClick={handleNext}
          className="w-full bg-[#FF6B2B] hover:bg-[#FF8C5A] transition-colors py-4 rounded-3xl flex items-center justify-center gap-2 font-[Space_Grotesk]"
          style={{ fontWeight: 600 }}
        >
          {currentSlide < slides.length - 1 ? "Continuar" : "Comenzar"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
