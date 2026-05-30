import { useNavigate } from "react-router";
import { ChevronRight, User, Bike, Bell, Globe, Download, HelpCircle, Info, LogOut, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useDiagnostics } from "@/hooks/useDiagnostics";
import { useState } from "react";

export function SettingsScreen() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuthContext();
  const { diagnostics } = useDiagnostics(user?.uid);
  const [exporting, setExporting] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleExportHistory = () => {
    if (diagnostics.length === 0) {
      alert("No tienes diagnósticos para exportar.");
      return;
    }

    setExporting(true);

    try {
      let content = "═══════════════════════════════════════\n";
      content += "    MOTOCHECK - Historial de Diagnósticos\n";
      content += "═══════════════════════════════════════\n\n";
      content += `Usuario: ${user?.displayName || "Usuario"}\n`;
      content += `Correo: ${user?.email || ""}\n`;
      content += `Fecha de exportación: ${new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}\n`;
      content += `Total de diagnósticos: ${diagnostics.length}\n\n`;

      diagnostics.forEach((diag, index) => {
        content += `───────────────────────────────────────\n`;
        content += `DIAGNÓSTICO #${index + 1}\n`;
        content += `───────────────────────────────────────\n`;
        content += `Título: ${diag.result.title}\n`;
        content += `Fecha: ${new Date(diag.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}\n`;
        content += `Tipo: ${diag.type === "text" ? "Chat IA" : diag.type === "image" ? "Visual" : "Audio"}\n`;
        content += `Gravedad: ${diag.result.severity.toUpperCase()}\n`;
        content += `Certeza: ${diag.result.confidence}%\n`;
        content += `Componente: ${diag.result.affectedComponent}\n\n`;
        content += `Descripción:\n${diag.result.description}\n\n`;
        content += `Causas:\n`;
        diag.result.causes.forEach((c) => { content += `  • ${c}\n`; });
        content += `\nSíntomas:\n`;
        diag.result.symptoms.forEach((s) => { content += `  • ${s}\n`; });
        content += `\nSoluciones:\n`;
        diag.result.solutions.forEach((s) => { content += `  ${s.step}. ${s.description}\n`; });
        if (diag.result.estimatedCost) {
          content += `\nCosto estimado: $${diag.result.estimatedCost.totalMin.toLocaleString()} - $${diag.result.estimatedCost.totalMax.toLocaleString()} COP\n`;
        }
        content += `\nReparación casera: ${diag.result.canDIY ? `Sí (${diag.result.diyDifficulty})` : "No recomendado"}\n`;
        content += `\n`;
      });

      content += `═══════════════════════════════════════\n`;
      content += `Generado por MotoCheck\n`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MotoCheck_Historial_${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error al exportar el historial.");
    } finally {
      setExporting(false);
    }
  };

  const displayName = user?.displayName || profile?.displayName || "Usuario";
  const displayEmail = user?.email || "";
  const totalDiagnostics = profile?.totalDiagnostics || 0;
  const resolvedDiagnostics = profile?.resolvedDiagnostics || 0;

  return (
    <div className="h-full bg-[#0F0F0F] overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-[Space_Grotesk] mb-2" style={{ fontWeight: 700 }}>
          Ajustes
        </h1>
        <p className="text-[#888888] text-sm">Personaliza tu experiencia</p>
      </div>

      {/* Profile section */}
      <div className="mx-6 mb-6 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 border border-[#888888]/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
              {displayName}
            </h2>
            <p className="text-sm text-[#888888]">{displayEmail}</p>
          </div>
          <button className="px-4 py-2 bg-[#FF6B2B]/10 hover:bg-[#FF6B2B]/20 rounded-xl text-sm text-[#FF6B2B] transition-colors">
            Editar
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#888888]/10">
          <div className="text-center">
            <p className="text-xl font-[Space_Grotesk] text-[#FF6B2B]" style={{ fontWeight: 700 }}>
              {totalDiagnostics}
            </p>
            <p className="text-xs text-[#888888]">Diagnósticos</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-[Space_Grotesk] text-[#2ECC71]" style={{ fontWeight: 700 }}>
              {resolvedDiagnostics}
            </p>
            <p className="text-xs text-[#888888]">Resueltos</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-[Space_Grotesk] text-[#FF6B2B]" style={{ fontWeight: 700 }}>
              1
            </p>
            <p className="text-xs text-[#888888]">Motos</p>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      <div className="px-6 space-y-6">
        {/* Motorcycles */}
        <div>
          <h3 className="text-sm text-[#888888] mb-3 uppercase tracking-wider">Mis Motos</h3>
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button
              onClick={() => navigate("/settings/motorcycles")}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#2A2A2A] transition-colors"
            >
              <div className="w-12 h-12 bg-[#FF6B2B]/10 rounded-2xl flex items-center justify-center">
                <Bike className="w-6 h-6 text-[#FF6B2B]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                  Gestionar mis motos
                </p>
                <p className="text-sm text-[#888888]">Agregar, editar o eliminar</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#888888]" />
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-sm text-[#888888] mb-3 uppercase tracking-wider">Preferencias</h3>
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button onClick={() => navigate("/settings/permissions")} className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#2A2A2A] transition-colors">
              <div className="w-10 h-10 bg-[#888888]/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                  Permisos
                </p>
                <p className="text-sm text-[#888888]">Cámara, micrófono, notificaciones</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#888888]" />
            </button>
            <div className="h-px bg-[#888888]/10 mx-5" />
            <button className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#2A2A2A] transition-colors">
              <div className="w-10 h-10 bg-[#888888]/10 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                  Idioma
                </p>
                <p className="text-sm text-[#888888]">Español</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#888888]" />
            </button>
          </div>
        </div>

        {/* Data */}
        <div>
          <h3 className="text-sm text-[#888888] mb-3 uppercase tracking-wider">Datos</h3>
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button onClick={handleExportHistory} disabled={exporting} className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#2A2A2A] transition-colors disabled:opacity-50">
              <div className="w-10 h-10 bg-[#888888]/10 rounded-xl flex items-center justify-center">
                {exporting ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Download className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1 text-left">
                <p className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                  Exportar historial
                </p>
                <p className="text-sm text-[#888888]">{exporting ? "Generando archivo..." : "Descargar diagnósticos"}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#888888]" />
            </button>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm text-[#888888] mb-3 uppercase tracking-wider">Soporte</h3>
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#888888]/10">
            <button onClick={() => navigate("/settings/support")} className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#2A2A2A] transition-colors">
              <div className="w-10 h-10 bg-[#888888]/10 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                  Ayuda y soporte
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#888888]" />
            </button>
            <div className="h-px bg-[#888888]/10 mx-5" />
            <button className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#2A2A2A] transition-colors">
              <div className="w-10 h-10 bg-[#888888]/10 rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                  Acerca de MOTOCHECK
                </p>
                <p className="text-sm text-[#888888]">Versión 1.0.0</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#888888]" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#E74C3C]/10 hover:bg-[#E74C3C]/20 border border-[#E74C3C] py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-5 h-5 text-[#E74C3C]" />
          <span className="font-[Space_Grotesk] text-[#E74C3C]" style={{ fontWeight: 600 }}>
            Cerrar sesión
          </span>
        </button>

        <div className="text-center text-xs text-[#888888] py-4">
          <p>© 2026 MOTOCHECK. Todos los derechos reservados.</p>
          <p className="mt-1">Términos · Privacidad · Licencias</p>
        </div>
      </div>

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

          <button onClick={() => navigate("/history")} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-[#888888]">Historial</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 bg-[#FF6B2B] rounded-2xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs text-[#FF6B2B]">Ajustes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
