import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, ChevronDown, ChevronUp, MapPin, Share2, AlertCircle, AlertTriangle, CheckCircle, Wrench, Video, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import type { Diagnosis, Severity } from "@/types";

export function DiagnosisResultScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthContext();
  const { getDiagnosisById } = useDiagnostics(user?.uid);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);

  const [expandedSections, setExpandedSections] = useState({
    cause: true,
    symptoms: false,
    solution: true,
    cost: false,
    diy: false,
  });

  useEffect(() => {
    async function loadDiagnosis() {
      if (!id) return;
      try {
        const result = await getDiagnosisById(id);
        setDiagnosis(result);
      } catch (err) {
        console.error("Error loading diagnosis:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDiagnosis();
  }, [id, getDiagnosisById]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getSeverityConfig = (severity: Severity) => {
    switch (severity) {
      case "crítico":
        return { icon: AlertTriangle, color: "#E74C3C", label: "Crítico", bg: "bg-[#E74C3C]/20", border: "border-[#E74C3C]" };
      case "moderado":
        return { icon: AlertCircle, color: "#F39C12", label: "Moderado", bg: "bg-[#F39C12]/20", border: "border-[#F39C12]" };
      case "leve":
        return { icon: CheckCircle, color: "#2ECC71", label: "Leve", bg: "bg-[#2ECC71]/20", border: "border-[#2ECC71]" };
      default:
        return { icon: AlertCircle, color: "#888888", label: severity, bg: "bg-[#888888]/20", border: "border-[#888888]" };
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-[#0F0F0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6B2B] animate-spin" />
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="h-full bg-[#0F0F0F] flex flex-col items-center justify-center px-8">
        <AlertCircle className="w-16 h-16 text-[#888888] mb-4" />
        <p className="text-[#888888] text-center mb-4">No se encontró el diagnóstico</p>
        <button onClick={() => navigate("/home")} className="px-6 py-3 bg-[#FF6B2B] rounded-2xl">
          Volver al inicio
        </button>
      </div>
    );
  }

  const { result } = diagnosis;
  const severityConfig = getSeverityConfig(result.severity);
  const SeverityIcon = severityConfig.icon;

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
          <div className={`flex items-center gap-2 ${severityConfig.bg} border ${severityConfig.border} px-4 py-2 rounded-full`}>
            <SeverityIcon className="w-4 h-4" style={{ color: severityConfig.color }} />
            <span className="text-sm font-[Space_Grotesk]" style={{ fontWeight: 600, color: severityConfig.color }}>
              {severityConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#888888]">
            <span>{result.confidence}% certeza</span>
          </div>
        </div>

        {/* Main fault card */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 border border-[#888888]/10">
          <h2 className="text-2xl font-[Space_Grotesk] mb-3" style={{ fontWeight: 700 }}>
            {result.title}
          </h2>
          <p className="text-sm text-[#888888] leading-relaxed mb-4">{result.description}</p>

          {/* Affected component */}
          <div className="bg-[#0F0F0F] rounded-2xl p-4 relative overflow-hidden">
            <div className="text-center text-[#FF6B2B] text-sm font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
              Componente afectado: {result.affectedComponent}
            </div>
          </div>
        </div>

        {/* Collapsible sections */}
        <div className="space-y-3">
          {/* Causas */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button onClick={() => toggleSection("cause")} className="w-full px-5 py-4 flex items-center justify-between">
              <h3 className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>Causas probables</h3>
              {expandedSections.cause ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.cause && (
              <div className="px-5 pb-4 space-y-2">
                {result.causes.map((cause, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#FF6B2B] mt-1">•</span>
                    <span className="text-sm text-[#888888] leading-relaxed">{cause}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Síntomas */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button onClick={() => toggleSection("symptoms")} className="w-full px-5 py-4 flex items-center justify-between">
              <h3 className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>Síntomas detectados</h3>
              {expandedSections.symptoms ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.symptoms && (
              <div className="px-5 pb-4 space-y-2">
                {result.symptoms.map((symptom, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
                    <span className="text-sm text-[#888888]">{symptom}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Soluciones */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button onClick={() => toggleSection("solution")} className="w-full px-5 py-4 flex items-center justify-between">
              <h3 className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>Solución recomendada</h3>
              {expandedSections.solution ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.solution && (
              <div className="px-5 pb-4 space-y-3">
                {result.solutions.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#FF6B2B]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#888888]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Costo estimado */}
          {result.estimatedCost && (
            <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
              <button onClick={() => toggleSection("cost")} className="w-full px-5 py-4 flex items-center justify-between">
                <h3 className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>Costo estimado</h3>
                {expandedSections.cost ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.cost && (
                <div className="px-5 pb-4 space-y-3">
                  {result.estimatedCost.parts.map((part, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[#888888]">{part.name}</span>
                      <span className="text-white">${part.min.toLocaleString()} - ${part.max.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#888888]">Mano de obra</span>
                    <span className="text-white">
                      ${result.estimatedCost.labor.min.toLocaleString()} - ${result.estimatedCost.labor.max.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-[#888888]/20 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>Total aproximado</span>
                    <span className="text-xl text-[#FF6B2B] font-[Space_Grotesk]" style={{ fontWeight: 700 }}>
                      ${result.estimatedCost.totalMin.toLocaleString()} - ${result.estimatedCost.totalMax.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#888888]">* Precios en {result.estimatedCost.currency}</p>
                </div>
              )}
            </div>
          )}

          {/* DIY */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button onClick={() => toggleSection("diy")} className="w-full px-5 py-4 flex items-center justify-between">
              <h3 className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>¿Puedo arreglarlo yo?</h3>
              {expandedSections.diy ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            {expandedSections.diy && (
              <div className="px-5 pb-4">
                <div className="flex items-start gap-3">
                  <Wrench className={`w-5 h-5 flex-shrink-0 mt-0.5 ${result.canDIY ? "text-[#2ECC71]" : "text-[#E74C3C]"}`} />
                  <div>
                    <p className="text-sm text-white mb-2">
                      <span className={`font-[Space_Grotesk] ${result.canDIY ? "text-[#2ECC71]" : "text-[#E74C3C]"}`} style={{ fontWeight: 600 }}>
                        {result.canDIY
                          ? `Sí, dificultad: ${result.diyDifficulty || "moderada"}`
                          : "No recomendado, acude a un taller"}
                      </span>
                    </p>
                    {result.diyNotes && (
                      <p className="text-sm text-[#888888] leading-relaxed">{result.diyNotes}</p>
                    )}
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
            Ver historial
          </button>
        </div>
      </div>
    </div>
  );
}
