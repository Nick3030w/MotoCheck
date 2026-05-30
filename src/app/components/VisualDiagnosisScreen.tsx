import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Camera, Upload, ChevronLeft, Lightbulb, Image } from "lucide-react";
import { motion } from "motion/react";

export function VisualDiagnosisScreen() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleGallery = () => {
    galleryInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      navigate("/result/1");
    }, 3000);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="h-full bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-[Space_Grotesk]" style={{ fontWeight: 700 }}>
          Diagnóstico Visual
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
            Analizando imagen con IA...
          </p>
          <p className="text-[#888888] text-center">Identificando componentes y posibles fallas</p>
        </div>
      ) : (
        <>
          {/* Photo preview or capture interface */}
          <div className="flex-1 mx-6 mb-4 bg-[#1A1A1A] rounded-3xl overflow-hidden relative">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                  <div className="w-20 h-20 bg-[#FF6B2B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-[#FF6B2B]" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-lg font-[Space_Grotesk] mb-2" style={{ fontWeight: 600 }}>
                    Captura o sube una foto
                  </h3>
                  <p className="text-sm text-[#888888] mb-6">
                    Fotografía el componente de tu moto que presenta la falla
                  </p>

                  {/* Capture from camera */}
                  <button
                    onClick={handleCapture}
                    className="w-full bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] hover:opacity-90 py-4 rounded-2xl flex items-center justify-center gap-2 mb-3 transition-opacity"
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <span className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                      Tomar foto
                    </span>
                  </button>

                  {/* Upload from gallery */}
                  <button
                    onClick={handleGallery}
                    className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <Image className="w-4 h-4" />
                    <span>Elegir desde galería</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Action buttons when photo is captured */}
          {capturedImage && (
            <div className="px-6 mb-6 flex items-center justify-center gap-4">
              <button
                onClick={handleRetake}
                className="px-6 py-3 bg-[#1A1A1A] rounded-2xl hover:bg-[#2A2A2A] transition-colors"
              >
                Tomar otra
              </button>
              <button
                onClick={handleAnalyze}
                className="px-6 py-3 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] rounded-2xl hover:opacity-90 transition-opacity font-[Space_Grotesk]"
                style={{ fontWeight: 600 }}
              >
                Analizar foto
              </button>
            </div>
          )}

          {/* Tips section */}
          <div className="px-6 pb-6">
            <div className="bg-[#1A1A1A] rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#FF6B2B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-[#FF6B2B]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-[Space_Grotesk] mb-2" style={{ fontWeight: 600 }}>
                    Para mejor resultado:
                  </h3>
                  <ul className="text-sm text-[#888888] space-y-1">
                    <li>• Asegura buena iluminación</li>
                    <li>• Enfoca la parte afectada</li>
                    <li>• Toma múltiples ángulos si es posible</li>
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
