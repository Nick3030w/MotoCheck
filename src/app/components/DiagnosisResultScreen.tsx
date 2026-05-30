import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, ChevronDown, ChevronUp, Bookmark, MapPin, Share2, AlertCircle, CheckCircle, Wrench, Video } from "lucide-react";

export function DiagnosisResultScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expandedSections, setExpandedSections] = useState({
    cause: true,
    symptoms: false,
    solution: true,
    cost: false,
    diy: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="h-full bg-[#0F0F0F] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#0F0F0F]/95 backdrop-blur-xl px-6 py-4 flex items-center gap-4 border-b border-[#1A1A1A] z-10">
        <button onClick={() => navigate("/home")} className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-[Space_Grotesk] flex-1" style={{ fontWeight: 700 }}>
          Resultado
        </h1>
        <button className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-6 space-y-6 pb-24">
        {/* Severity badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F39C12]/20 border border-[#F39C12] px-4 py-2 rounded-full">
            <AlertCircle className="w-4 h-4 text-[#F39C12]" />
            <span className="text-sm text-[#F39C12] font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
              Moderado
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#888888]">
            <span>92% certeza</span>
          </div>
        </div>

        {/* Main fault card */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 border border-[#888888]/10">
          <h2 className="text-2xl font-[Space_Grotesk] mb-4" style={{ fontWeight: 700 }}>
            Fallo en bujías de encendido
          </h2>

          {/* Motorcycle diagram */}
          <div className="bg-[#0F0F0F] rounded-2xl p-6 mb-4 relative overflow-hidden">
            <div className="text-center text-[#888888] mb-2 text-sm">Motor - Sistema de encendido</div>
            <div className="flex items-center justify-center">
              {/* Simplified motorcycle engine icon */}
              <div className="relative">
                <svg className="w-48 h-32 text-[#888888]" viewBox="0 0 200 120" fill="currentColor">
                  <rect x="60" y="20" width="80" height="80" rx="8" opacity="0.3" />
                  <rect x="80" y="30" width="40" height="60" rx="4" className="text-[#FF6B2B]" />
                  <circle cx="100" cy="60" r="8" className="text-[#FF6B2B]" />
                </svg>
                {/* Highlight pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#FF6B2B]/30 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-center text-sm text-[#FF6B2B] mt-2">Componente afectado resaltado</p>
          </div>
        </div>

        {/* Collapsible sections */}
        <div className="space-y-3">
          {/* Causa probable */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button
              onClick={() => toggleSection("cause")}
              className="w-full px-5 py-4 flex items-center justify-between"
            >
              <h3 className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                Causa probable
              </h3>
              {expandedSections.cause ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.cause && (
              <div className="px-5 pb-4 text-sm text-[#888888] leading-relaxed">
                Las bujías han acumulado depósitos de carbono o están desgastadas por el uso prolongado. Esto impide
                una chispa adecuada, causando fallos en la combustión.
              </div>
            )}
          </div>

          {/* Síntomas detectados */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button
              onClick={() => toggleSection("symptoms")}
              className="w-full px-5 py-4 flex items-center justify-between"
            >
              <h3 className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                Síntomas detectados
              </h3>
              {expandedSections.symptoms ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.symptoms && (
              <div className="px-5 pb-4 space-y-2">
                {["Arranque difícil o lento", "Ralentí irregular", "Pérdida de potencia", "Mayor consumo de combustible"].map(
                  (symptom, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
                      <span className="text-sm text-[#888888]">{symptom}</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Solución recomendada */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button
              onClick={() => toggleSection("solution")}
              className="w-full px-5 py-4 flex items-center justify-between"
            >
              <h3 className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                Solución recomendada
              </h3>
              {expandedSections.solution ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.solution && (
              <div className="px-5 pb-4 space-y-3">
                {[
                  { step: "Adquiere bujías nuevas NGK o Denso compatibles", icon: "🔧" },
                  { step: "Retira la tapa del motor y desconecta cables", icon: "⚡" },
                  { step: "Desenrosca las bujías viejas con llave de 16mm", icon: "🔩" },
                  { step: "Instala nuevas bujías con torque de 25 Nm", icon: "✅" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#FF6B2B]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#888888]">{item.step}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Costo estimado */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button
              onClick={() => toggleSection("cost")}
              className="w-full px-5 py-4 flex items-center justify-between"
            >
              <h3 className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                Costo estimado
              </h3>
              {expandedSections.cost ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.cost && (
              <div className="px-5 pb-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#888888]">Bujías (4 unidades)</span>
                  <span className="text-white">$800 - $1,200</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#888888]">Mano de obra (taller)</span>
                  <span className="text-white">$300 - $500</span>
                </div>
                <div className="h-px bg-[#888888]/20 my-2" />
                <div className="flex items-center justify-between">
                  <span className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                    Total aproximado
                  </span>
                  <span className="text-xl text-[#FF6B2B] font-[Space_Grotesk]" style={{ fontWeight: 700 }}>
                    $1,100 - $1,700
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* DIY */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button
              onClick={() => toggleSection("diy")}
              className="w-full px-5 py-4 flex items-center justify-between"
            >
              <h3 className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                ¿Puedo arreglarlo yo?
              </h3>
              {expandedSections.diy ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.diy && (
              <div className="px-5 pb-4">
                <div className="flex items-start gap-3 mb-3">
                  <Wrench className="w-5 h-5 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white mb-2">
                      <span className="text-[#2ECC71] font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                        Sí, es un trabajo DIY moderado
                      </span>
                    </p>
                    <p className="text-sm text-[#888888] leading-relaxed">
                      Requiere herramientas básicas y conocimiento mecánico medio. Si no tienes experiencia, considera
                      acudir a un taller para evitar daños.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/result/${id}/workshops`)}
            className="w-full bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] hover:opacity-90 py-4 rounded-3xl flex items-center justify-center gap-2 font-[Space_Grotesk]"
            style={{ fontWeight: 600 }}
          >
            <MapPin className="w-5 h-5" />
            Buscar taller cercano
          </button>
          <button
            onClick={() => navigate(`/result/${id}/tutorials`)}
            className="w-full bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 border border-[#2ECC71] text-[#2ECC71] py-4 rounded-3xl flex items-center justify-center gap-2 font-[Space_Grotesk]"
            style={{ fontWeight: 600 }}
          >
            <Video className="w-5 h-5" />
            Ver tutoriales de reparación
          </button>
          <button
            onClick={() => navigate("/history")}
            className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] py-4 rounded-3xl flex items-center justify-center gap-2 font-[Space_Grotesk]"
            style={{ fontWeight: 600 }}
          >
            <Bookmark className="w-5 h-5" />
            Guardar diagnóstico
          </button>
        </div>
      </div>
    </div>
  );
}
