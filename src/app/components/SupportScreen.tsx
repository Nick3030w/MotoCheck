import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, MessageCircle, Mail, Phone, FileText, ExternalLink, Send, X } from "lucide-react";

export function SupportScreen() {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ id: number; from: "user" | "support"; text: string }[]>([
    { id: 1, from: "support", text: "¡Hola! Bienvenido al soporte de MotoCheck. ¿En qué podemos ayudarte?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleCall = () => {
    window.open("tel:+573158577256", "_self");
  };

  const handleEmail = () => {
    window.open("mailto:soporte@motocheck.com?subject=Soporte MotoCheck&body=Hola, necesito ayuda con...", "_blank");
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;

    setChatMessages((prev) => [...prev, { id: Date.now(), from: "user", text: chatInput }]);
    setChatInput("");

    // Respuesta automática simulada
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "support",
          text: "Gracias por tu mensaje. Nuestro equipo lo revisará pronto. Si es urgente, puedes llamarnos al +57 315 857 7256.",
        },
      ]);
    }, 1500);
  };

  const supportOptions = [
    {
      id: "chat",
      icon: MessageCircle,
      title: "Chat en vivo",
      description: "Habla con nuestro equipo de soporte",
      action: "Iniciar chat",
      color: "#FF6B2B",
      onClick: () => setShowChat(true),
    },
    {
      id: "email",
      icon: Mail,
      title: "Correo electrónico",
      description: "soporte@motocheck.com",
      action: "Enviar correo",
      color: "#2ECC71",
      onClick: handleEmail,
    },
    {
      id: "phone",
      icon: Phone,
      title: "Teléfono",
      description: "+57 315 857 7256",
      action: "Llamar ahora",
      color: "#F39C12",
      onClick: handleCall,
    },
  ];

  // Chat en vivo view
  if (showChat) {
    return (
      <div className="h-full bg-[#0F0F0F] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-4 border-b border-[#1A1A1A]">
          <button
            onClick={() => setShowChat(false)}
            className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-[Space_Grotesk]" style={{ fontWeight: 700 }}>
              Chat en vivo
            </h1>
            <p className="text-sm text-[#888888]">Soporte MotoCheck</p>
          </div>
          <div className="w-3 h-3 bg-[#2ECC71] rounded-full animate-pulse" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-3xl px-5 py-3 ${
                msg.from === "user"
                  ? "bg-[#FF6B2B] text-white"
                  : "bg-[#1A1A1A] text-white border border-[#888888]/10"
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-[#1A1A1A] rounded-full px-5 py-3 outline-none text-white placeholder:text-[#888888] border border-transparent focus:border-[#FF6B2B] transition-colors"
            />
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
              className="w-10 h-10 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] rounded-full flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                  onClick={option.onClick}
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
              <button
                onClick={() => window.open("mailto:soporte@motocheck.com?subject=Feedback MotoCheck", "_blank")}
                className="w-full bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 border border-[#2ECC71] text-[#2ECC71] py-3 rounded-xl transition-colors font-[Space_Grotesk]"
                style={{ fontWeight: 600 }}
              >
                Enviar feedback
              </button>
            </div>
          </div>
        </div>

        {/* Version info */}
        <div className="text-center text-sm text-[#888888] py-4">
          <p>MOTOCHECK versión 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
