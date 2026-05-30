import { useNavigate } from "react-router";
import { Camera, Mic, MessageCircle, Bell, ChevronRight, Activity } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

export function HomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Obtener primer nombre del usuario
  const firstName = user?.displayName?.split(" ")[0] || "Usuario";

  return (
    <div className="h-full bg-[#0F0F0F] overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div>
          <p className="text-[#888888] text-sm">Hola,</p>
          <h1 className="text-2xl font-[Space_Grotesk]" style={{ fontWeight: 700 }}>
            {firstName} 👋
          </h1>
        </div>
        <button className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-white" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B2B] rounded-full" />
        </button>
      </div>

      {/* Motorcycle card */}
      <div className="mx-6 mb-6 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 border border-[#888888]/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-[Space_Grotesk] mb-1" style={{ fontWeight: 600 }}>
              Mi Ninja 400
            </h3>
            <p className="text-[#888888] text-sm">Kawasaki Ninja 400 · 2022</p>
          </div>
          <div className="w-12 h-12 bg-[#FF6B2B]/10 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏍️</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#888888]">
          <Activity className="w-4 h-4" />
          <span>Último diagnóstico: hace 3 días</span>
        </div>
      </div>

      {/* Action cards */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-[Space_Grotesk] mb-4" style={{ fontWeight: 600 }}>
          Nuevo Diagnóstico
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => navigate("/diagnose/visual")}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors rounded-2xl p-5 flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-[#FF6B2B]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#FF6B2B]/20 transition-colors">
              <Camera className="w-7 h-7 text-[#FF6B2B]" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-[Space_Grotesk] mb-1" style={{ fontWeight: 600 }}>
                Diagnóstico Visual
              </h3>
              <p className="text-sm text-[#888888]">Foto o video del componente</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={() => navigate("/diagnose/audio")}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors rounded-2xl p-5 flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-[#FF6B2B]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#FF6B2B]/20 transition-colors">
              <Mic className="w-7 h-7 text-[#FF6B2B]" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-[Space_Grotesk] mb-1" style={{ fontWeight: 600 }}>
                Diagnóstico por Sonido
              </h3>
              <p className="text-sm text-[#888888]">Graba el ruido anormal</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={() => navigate("/diagnose/chat")}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors rounded-2xl p-5 flex items-center gap-4 group"
          >
            <div className="w-14 h-14 bg-[#FF6B2B]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#FF6B2B]/20 transition-colors">
              <MessageCircle className="w-7 h-7 text-[#FF6B2B]" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-[Space_Grotesk] mb-1" style={{ fontWeight: 600 }}>
                Chat con IA
              </h3>
              <p className="text-sm text-[#888888]">Describe el problema</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-6 pb-24">
        <h2 className="text-lg font-[Space_Grotesk] mb-4" style={{ fontWeight: 600 }}>
          Estadísticas
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1A1A1A] rounded-2xl p-4 text-center">
            <p className="text-2xl font-[Space_Grotesk] text-[#FF6B2B] mb-1" style={{ fontWeight: 700 }}>
              12
            </p>
            <p className="text-xs text-[#888888]">Diagnósticos</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-2xl p-4 text-center">
            <p className="text-2xl font-[Space_Grotesk] text-[#2ECC71] mb-1" style={{ fontWeight: 700 }}>
              9
            </p>
            <p className="text-xs text-[#888888]">Resueltos</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-2xl p-4 text-center">
            <p className="text-2xl font-[Space_Grotesk] text-[#FF6B2B] mb-1" style={{ fontWeight: 700 }}>
              87
            </p>
            <p className="text-xs text-[#888888]">Salud</p>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-8 left-0 right-0 max-w-[430px] mx-auto px-6">
        <div className="bg-[#1A1A1A]/95 backdrop-blur-xl rounded-3xl px-6 py-4 flex items-center justify-around border border-[#888888]/10">
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 bg-[#FF6B2B] rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xs text-[#FF6B2B]">Inicio</span>
          </button>

          <button onClick={() => navigate("/history")} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-[#888888]">Historial</span>
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
