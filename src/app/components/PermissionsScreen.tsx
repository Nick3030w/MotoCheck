import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Camera, Mic, Image, Bell, AlertCircle } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
}

export function PermissionsScreen() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "camera",
      name: "Cámara",
      description: "Permite tomar fotos para diagnóstico visual",
      icon: Camera,
      enabled: true,
    },
    {
      id: "microphone",
      name: "Micrófono",
      description: "Permite grabar audio para diagnóstico de sonido",
      icon: Mic,
      enabled: true,
    },
    {
      id: "gallery",
      name: "Galería",
      description: "Acceso a fotos y videos guardados",
      icon: Image,
      enabled: true,
    },
    {
      id: "notifications",
      name: "Notificaciones",
      description: "Alertas de mantenimiento y recordatorios",
      icon: Bell,
      enabled: false,
    },
  ]);

  const togglePermission = (id: string) => {
    setPermissions(
      permissions.map((perm) =>
        perm.id === id ? { ...perm, enabled: !perm.enabled } : perm
      )
    );
  };

  return (
    <div className="h-full bg-[#0F0F0F] overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-[#1A1A1A]">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-[Space_Grotesk]" style={{ fontWeight: 700 }}>
          Permisos
        </h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Info banner */}
        <div className="bg-[#FF6B2B]/10 border border-[#FF6B2B]/30 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#FF6B2B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white mb-1">
                Gestiona los permisos de la aplicación
              </p>
              <p className="text-xs text-[#888888]">
                Algunos permisos son necesarios para que las funciones de diagnóstico funcionen correctamente.
              </p>
            </div>
          </div>
        </div>

        {/* Permissions list */}
        <div className="space-y-3">
          {permissions.map((permission) => {
            const Icon = permission.icon;
            return (
              <div
                key={permission.id}
                className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#888888]/10"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      permission.enabled
                        ? "bg-[#FF6B2B]/10"
                        : "bg-[#888888]/10"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        permission.enabled ? "text-[#FF6B2B]" : "text-[#888888]"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="font-[Space_Grotesk]"
                        style={{ fontWeight: 600 }}
                      >
                        {permission.name}
                      </h3>
                      <button
                        onClick={() => togglePermission(permission.id)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          permission.enabled
                            ? "bg-[#FF6B2B]"
                            : "bg-[#888888]/30"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            permission.enabled
                              ? "translate-x-7"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-[#888888]">
                      {permission.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#888888]/10">
          <h3
            className="font-[Space_Grotesk] mb-3"
            style={{ fontWeight: 600 }}
          >
            Notas importantes
          </h3>
          <ul className="space-y-2 text-sm text-[#888888]">
            <li className="flex gap-2">
              <span className="text-[#FF6B2B] flex-shrink-0">•</span>
              <span>
                Los permisos de cámara y micrófono son esenciales para los
                diagnósticos visuales y de audio.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#FF6B2B] flex-shrink-0">•</span>
              <span>
                Puedes gestionar estos permisos también desde la configuración
                de tu dispositivo.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#FF6B2B] flex-shrink-0">•</span>
              <span>
                Las notificaciones te ayudarán a mantener tu moto en óptimas
                condiciones.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
