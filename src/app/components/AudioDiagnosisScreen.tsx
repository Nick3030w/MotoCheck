import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Mic, ChevronLeft, Play, Lightbulb, Send } from "lucide-react";
import { motion } from "motion/react";

export function AudioDiagnosisScreen() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleRecord = () => {
    audioInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handlePlay = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleRetake = () => {
    setAudioFile(null);
    setAudioUrl(null);
  };

  const handleSubmit = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      navigate("/result/2");
    }, 3000);
  };


  return (
    <div className="h-full bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/home")} className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-[Space_Grotesk]" style={{ fontWeight: 700 }}>
          Diagnóstico por Sonido
        </h1>
      </div>

      {isAnalyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-4 border-[#1A1A1A] border-t-[#FF6B2B] mb-6"
          />
          <p className="text-xl font-[Space_Grotesk] mb-2" style={{ fontWeight: 600 }}>
            Procesando audio con IA...
          </p>
          <p className="text-[#888888] text-center">Analizando patrones de sonido y frecuencias</p>
        </div>
      ) : (
        <>
          {/* Recording interface */}
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            {!audioFile ? (
              <>
                {/* Microphone button */}
                <motion.button
                  onClick={handleRecord}
                  className="relative mb-8"
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-40 h-40 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] rounded-full flex items-center justify-center shadow-2xl shadow-[#FF6B2B]/50 hover:scale-105 transition-transform">
                    <Mic className="w-16 h-16 text-white" />
                  </div>
                </motion.button>

                {/* Status text */}
                <p className="text-xl font-[Space_Grotesk] mb-2" style={{ fontWeight: 600 }}>
                  Grabar sonido
                </p>
                <p className="text-[#888888] text-center mb-4">
                  Toca el micrófono para grabar el ruido anormal de tu moto
                </p>
              </>
            ) : (
              <>
                {/* Audio recorded */}
                <div className="w-40 h-40 bg-[#2ECC71]/10 rounded-full flex items-center justify-center mb-8 border-4 border-[#2ECC71]">
                  <Mic className="w-16 h-16 text-[#2ECC71]" />
                </div>

                <p className="text-xl font-[Space_Grotesk] mb-2 text-[#2ECC71]" style={{ fontWeight: 600 }}>
                  Audio grabado
                </p>
                <p className="text-[#888888] text-center mb-8">
                  {audioFile.name} ({(audioFile.size / 1024).toFixed(1)} KB)
                </p>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handlePlay}
                    className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-2xl flex items-center gap-2 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Reproducir</span>
                  </button>
                  <button
                    onClick={handleRetake}
                    className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-2xl transition-colors"
                  >
                    Grabar otra
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-4 px-8 py-3 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] hover:opacity-90 rounded-2xl flex items-center gap-2 transition-opacity"
                >
                  <Send className="w-5 h-5" />
                  <span className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                    Analizar audio
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Hidden audio input */}
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            capture="user"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Tips section */}
          <div className="px-6 pb-6">
            <div className="bg-[#1A1A1A] rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#FF6B2B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-[#FF6B2B]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-[Space_Grotesk] mb-2" style={{ fontWeight: 600 }}>
                    Consejos de grabación:
                  </h3>
                  <ul className="text-sm text-[#888888] space-y-1">
                    <li>• Reduce el ruido ambiental</li>
                    <li>• Sube la aceleración gradualmente</li>
                    <li>• Graba por al menos 5 segundos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
