import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronRight, AlertCircle, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import type { Severity } from "@/types";

export function HistoryScreen() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { diagnostics, loading } = useDiagnostics(user?.uid);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getSeverityConfig = (severity: Severity | string) => {
    switch (severity) {
      case "crítico":
        return { icon: AlertTriangle, color: "#E74C3C", label: "Crítico", bg: "bg-[#E74C3C]/10", border: "border-[#E74C3C]" };
      case "moderado":
        return { icon: AlertCircle, color: "#F39C12", label: "Moderado", bg: "bg-[#F39C12]/10", border: "border-[#F39C12]" };
      case "leve":
        return { icon: CheckCircle, color: "#2ECC71", label: "Leve", bg: "bg-[#2ECC71]/10", border: "border-[#2ECC71]" };
      default:
        return { icon: AlertCircle, color: "#888888", label: "Desconocido", bg: "bg-[#888888]/10", border: "border-[#888888]" };
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  };

  const filteredDiagnoses = diagnostics.filter((d) => {
    if (filter !== "all" && d.result.severity !== filter) return false;
    if (searchQuery && !d.result.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-[Space_Grotesk] mb-6" style={{ fontWeight: 700 }}>
          Historial
        </h1>

        {/* Search bar */}
        <div className="bg-[#1A1A1A] rounded-2xl px-4 py-3 flex items-center gap-3 mb-4 border border-transparent focus-within:border-[#FF6B2B] transition-colors">
          <Search className="w-5 h-5 text-[#888888]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar diagnóstico..."
            className="flex-1 bg-transparent outline-none text-white placeholder:text-[#888888]"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: "all", label: "Todos" },
            { value: "leve", label: "Leve" },
            { value: "moderado", label: "Moderado" },
            { value: "crítico", label: "Crítico" },
          ].map((chip) => (
            <button
              key={chip.value}
              onClick={() => setFilter(chip.value)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                filter === chip.value
                  ? "bg-[#FF6B2B] text-white"
                  : "bg-[#1A1A1A] text-[#888888] hover:bg-[#2A2A2A]"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#FF6B2B] animate-spin" />
        </div>
      )}

      {/* Diagnosis list */}
      {!loading && (
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          {filteredDiagnoses.length > 0 ? (
            <div className="space-y-3">
              {filteredDiagnoses.map((diagnosis) => {
                const config = getSeverityConfig(diagnosis.result.severity);
                const Icon = config.icon;

                return (
                  <button
                    key={diagnosis.id}
                    onClick={() => navigate(`/result/${diagnosis.id}`)}
                    className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-2xl p-5 transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Severity badge */}
                      <div className={`w-12 h-12 ${config.bg} rounded-2xl flex items-center justify-center flex-shrink-0 border ${config.border}`}>
                        <Icon className="w-6 h-6" style={{ color: config.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-left">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-[Space_Grotesk] pr-2" style={{ fontWeight: 600 }}>
                            {diagnosis.result.title}
                          </h3>
                          <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors flex-shrink-0" />
                        </div>
                        <p className="text-sm text-[#888888] mb-2">
                          {diagnosis.type === "text" ? "Chat IA" : diagnosis.type === "image" ? "Visual" : "Audio"}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${config.bg}`} style={{ color: config.color }}>
                            {config.label}
                          </span>
                          <span className="text-xs text-[#888888]">{formatDate(diagnosis.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-6">
                <Search className="w-12 h-12 text-[#888888]" />
              </div>
              <h3 className="text-xl font-[Space_Grotesk] mb-2" style={{ fontWeight: 600 }}>
                Sin diagnósticos aún
              </h3>
              <p className="text-[#888888] mb-6">¡Empieza tu primer análisis!</p>
              <button
                onClick={() => navigate("/home")}
                className="px-6 py-3 bg-[#FF6B2B] hover:bg-[#FF8C5A] rounded-2xl transition-colors"
              >
                Nuevo diagnóstico
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom navigation */}
      <div className="fixed bottom-8 left-0 right-0 max-w-[430px] mx-auto px-6">
        <div className="bg-[#1A1A1A]/95 backdrop-blur-xl rounded-3xl px-6 py-4 flex items-center justify-around border border-[#888888]/10">
          <button onClick={() => navigate("/home")} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xs text-[#888888]">Inicio</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 bg-[#FF6B2B] rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-[#FF6B2B]">Historial</span>
          </button>

          <button onClick={() => navigate("/settings")} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs text-[#888888]">Ajustes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
