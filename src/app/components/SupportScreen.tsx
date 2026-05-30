import { useNavigate } from "react-router";
import { ChevronLeft, MessageCircle, Mail, Phone, FileText, ExternalLink } from "lucide-react";

export function SupportScreen() {
  const navigate = useNavigate();

  const supportOptions = [
    {
      id: "chat",
      icon: MessageCircle,
      title: "Chat en vivo",
      description: "Habla con nuestro equipo de soporte",
      action: "Iniciar chat",
      color: "#FF6B2B",
    },
    {
      id: "email",
      icon: Mail,
      title: "Correo electrónico",
      description: "soporte@motocheck.com",
      action: "Enviar correo",
      color: "#2ECC71",
    },
    {
      id: "phone",
      icon: Phone,
      title: "Teléfono",
      description: "+52 55 1234 5678",
      action: "Llamar ahora",
      color: "#F39C12",
    },
  ];

  const resources = [
    {
      title: "Preguntas frecuentes",
      description: "Encuentra respuestas rápidas",
      icon: "❓",
    },
    {
      title: "Guía de usuario",
      description: "Aprende a usar MOTOCHECK",
      icon: "📖",
    },
    {
      title: "Tutoriales en video",
      description: "Videos paso a paso",
      icon: "🎥",
    },
    {
      title: "Comunidad",
      description: "Únete a otros usuarios",
      icon: "👥",
    },
  ];

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
          Ayuda y soporte
        </h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Support channels */}
        <div>
          <h2 className="text-lg font-[Space_Grotesk] mb-4" style={{ fontWeight: 600 }}>
            Contacta con nosotros
          </h2>
          <div className="space-y-3">
            {supportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-2xl p-5 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${option.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: option.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-[Space_Grotesk] mb-1" style={{ fontWeight: 600 }}>
                        {option.title}
                      </h3>
                      <p className="text-sm text-[#888888] mb-2">
                        {option.description}
                      </p>
                      <span
                        className="text-sm inline-flex items-center gap-1"
                        style={{ color: option.color }}
                      >
                        {option.action}
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-lg font-[Space_Grotesk] mb-4" style={{ fontWeight: 600 }}>
            Recursos útiles
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {resources.map((resource, index) => (
              <button
                key={index}
                className="bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-2xl p-4 transition-colors text-left"
              >
                <div className="text-3xl mb-3">{resource.icon}</div>
                <h3 className="font-[Space_Grotesk] text-sm mb-1" style={{ fontWeight: 600 }}>
                  {resource.title}
                </h3>
                <p className="text-xs text-[#888888]">{resource.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Working hours */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-2xl p-5 border border-[#888888]/10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-[#FF6B2B]/10 rounded-xl flex items-center justify-center">
              <span className="text-xl">🕐</span>
            </div>
            <div>
              <h3 className="font-[Space_Grotesk] mb-1" style={{ fontWeight: 600 }}>
                Horario de atención
              </h3>
              <p className="text-sm text-[#888888]">Estamos aquí para ayudarte</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#888888]">Lunes - Viernes</span>
              <span className="text-white">9:00 AM - 8:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888888]">Sábados</span>
              <span className="text-white">10:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888888]">Domingos</span>
              <span className="text-white">Cerrado</span>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#888888]/10">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-[#2ECC71]/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#2ECC71]" />
            </div>
            <div className="flex-1">
              <h3 className="font-[Space_Grotesk] mb-1" style={{ fontWeight: 600 }}>
                Envía tu comentario
              </h3>
              <p className="text-sm text-[#888888] mb-4">
                Ayúdanos a mejorar MOTOCHECK con tus sugerencias
              </p>
              <button className="w-full bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 border border-[#2ECC71] text-[#2ECC71] py-3 rounded-xl transition-colors font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
                Enviar feedback
              </button>
            </div>
          </div>
        </div>

        {/* Version info */}
        <div className="text-center text-sm text-[#888888] py-4">
          <p>MOTOCHECK versión 1.0.0</p>
          <p className="mt-1">Build 2026.05.06</p>
        </div>
      </div>
    </div>
  );
}
