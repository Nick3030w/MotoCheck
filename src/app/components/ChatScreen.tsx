import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Send, Loader2, Zap, RotateCcw, Camera, Mic, X } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMotorcycles } from "@/hooks/useMotorcycles";
import { useDiagnosis } from "@/hooks/useDiagnosis";
import type { ChatMessage } from "@/types";

const CHAT_STORAGE_KEY = "motocheck_chat_messages";

/**
 * Convierte un File a base64 (sin prefijo data:...)
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

export function ChatScreen() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { selectedMotorcycle } = useMotorcycles(user?.uid);
  const motorcycleInfo = selectedMotorcycle
    ? `${selectedMotorcycle.brand} ${selectedMotorcycle.model} ${selectedMotorcycle.year}`
    : "";

  const { sendChatMessage, diagnoseByChat, loading: diagnosisLoading } = useDiagnosis({
    userId: user?.uid || "",
    motorcycleId: selectedMotorcycle?.id || "",
    motorcycleInfo,
  });

  const getWelcomeMessage = (): ChatMessage => ({
    id: "1",
    role: "assistant",
    content: selectedMotorcycle
      ? `Hola, soy MOTOCHECK 🏍️ Veo que tienes una **${motorcycleInfo}**. Describe el problema que presenta tu moto y te ayudaré a diagnosticarlo. También puedes enviarme fotos o audios para un mejor diagnóstico.`
      : "Hola, soy MOTOCHECK 🏍️ Describe el problema que presenta tu moto y te ayudaré a diagnosticarlo. También puedes enviarme fotos o audios para un mejor diagnóstico.",
    timestamp: new Date(),
  });

  // Cargar mensajes guardados o iniciar con mensaje de bienvenida
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) }));
      }
    } catch {}
    return [getWelcomeMessage()];
  });

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter((msg: any) => msg.role === "user").length;
      }
    } catch {}
    return 0;
  });

  // Adjuntos pendientes
  const [pendingImage, setPendingImage] = useState<{ file: File; preview: string } | null>(null);
  const [pendingAudio, setPendingAudio] = useState<{ file: File; name: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Guardar mensajes en sessionStorage cada vez que cambien
  // (no guardamos base64 en sessionStorage para no saturar)
  useEffect(() => {
    const messagesToSave = messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      chips: msg.chips,
      // Indicadores de que hubo adjunto (sin el base64 pesado)
      hadImage: !!msg.imageBase64,
      hadAudio: !!msg.audioBase64,
    }));
    sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messagesToSave));
  }, [messages]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleNewChat = () => {
    sessionStorage.removeItem(CHAT_STORAGE_KEY);
    setMessages([getWelcomeMessage()]);
    setMessageCount(0);
    setPendingImage(null);
    setPendingAudio(null);
  };

  const handleImageSelect = () => {
    imageInputRef.current?.click();
  };

  const handleAudioSelect = () => {
    audioInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPendingImage({ file, preview });
    }
    // Reset input para permitir seleccionar el mismo archivo
    e.target.value = "";
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingAudio({ file, name: file.name });
    }
    e.target.value = "";
  };

  const removePendingImage = () => {
    if (pendingImage) {
      URL.revokeObjectURL(pendingImage.preview);
      setPendingImage(null);
    }
  };

  const removePendingAudio = () => {
    setPendingAudio(null);
  };

  const handleSend = async () => {
    // Permitir enviar si hay texto O adjuntos
    if ((!inputText.trim() && !pendingImage && !pendingAudio) || isTyping) return;

    // Construir el mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim(),
      timestamp: new Date(),
    };

    // Convertir adjuntos a base64
    if (pendingImage) {
      const base64 = await fileToBase64(pendingImage.file);
      userMessage.imageBase64 = base64;
      userMessage.imageMimeType = pendingImage.file.type;
      if (!userMessage.content) {
        userMessage.content = "📷 Imagen adjunta";
      }
    }

    if (pendingAudio) {
      const base64 = await fileToBase64(pendingAudio.file);
      userMessage.audioBase64 = base64;
      userMessage.audioMimeType = pendingAudio.file.type;
      if (!userMessage.content && !pendingImage) {
        userMessage.content = "🎙️ Audio adjunto";
      } else if (!userMessage.content) {
        userMessage.content += " + 🎙️ Audio";
      }
    }

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setPendingImage(null);
    setPendingAudio(null);
    setIsTyping(true);
    setMessageCount((prev: number) => prev + 1);

    try {
      const response = await sendChatMessage(updatedMessages);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Intenta de nuevo.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateDiagnosis = async () => {
    try {
      setIsTyping(true);
      const id = await diagnoseByChat(messages);
      // Limpiar chat después de generar diagnóstico
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
      navigate(`/result/${id}`);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "No pude generar el diagnóstico. Intenta describir el problema con más detalle.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-[#1A1A1A]">
        <button onClick={() => navigate("/home")} className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-[Space_Grotesk]" style={{ fontWeight: 700 }}>
            Chat con IA
          </h1>
          <p className="text-sm text-[#888888]">
            {selectedMotorcycle ? `${selectedMotorcycle.brand} ${selectedMotorcycle.model}` : "MOTOCHECK en línea"}
          </p>
        </div>
        {/* New chat button */}
        <button
          onClick={handleNewChat}
          className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#2A2A2A] transition-colors"
          title="Nueva conversación"
        >
          <RotateCcw className="w-4 h-4 text-[#888888]" />
        </button>
        <div className="w-3 h-3 bg-[#2ECC71] rounded-full animate-pulse" />
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%]`}>
              <div
                className={`rounded-3xl px-5 py-3 ${
                  message.role === "user"
                    ? "bg-[#FF6B2B] text-white"
                    : "bg-[#1A1A1A] text-white border border-[#888888]/10"
                }`}
              >
                {/* Mostrar imagen adjunta si existe */}
                {message.imageBase64 && (
                  <div className="mb-2 rounded-2xl overflow-hidden">
                    <img
                      src={`data:${message.imageMimeType};base64,${message.imageBase64}`}
                      alt="Adjunto"
                      className="max-w-full max-h-48 rounded-2xl object-cover"
                    />
                  </div>
                )}
                {/* Indicador de audio adjunto */}
                {message.audioBase64 && (
                  <div className="mb-2 flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2">
                    <Mic className="w-4 h-4" />
                    <span className="text-xs">Audio adjunto</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#1A1A1A] rounded-3xl px-5 py-3 border border-[#888888]/10">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#888888] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-[#888888] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-[#888888] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Generate diagnosis button (after 3+ messages from user) */}
      {messageCount >= 3 && !isTyping && (
        <div className="px-6 py-2">
          <button
            onClick={handleGenerateDiagnosis}
            disabled={diagnosisLoading}
            className="w-full bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 border border-[#2ECC71] text-[#2ECC71] py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Zap className="w-4 h-4" />
            <span className="font-[Space_Grotesk]" style={{ fontWeight: 600 }}>
              Generar diagnóstico completo
            </span>
          </button>
        </div>
      )}

      {/* Pending attachments preview */}
      {(pendingImage || pendingAudio) && (
        <div className="px-6 py-2 flex items-center gap-2 flex-wrap">
          {pendingImage && (
            <div className="relative inline-flex items-center bg-[#1A1A1A] rounded-xl px-2 py-1 gap-2">
              <img
                src={pendingImage.preview}
                alt="Preview"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="text-xs text-[#888888]">Imagen</span>
              <button
                onClick={removePendingImage}
                className="w-5 h-5 bg-[#FF6B2B] rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
          {pendingAudio && (
            <div className="relative inline-flex items-center bg-[#1A1A1A] rounded-xl px-3 py-1 gap-2">
              <Mic className="w-4 h-4 text-[#FF6B2B]" />
              <span className="text-xs text-[#888888] max-w-[100px] truncate">{pendingAudio.name}</span>
              <button
                onClick={removePendingAudio}
                className="w-5 h-5 bg-[#FF6B2B] rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Input bar */}
      <div className="px-6 py-4 border-t border-[#1A1A1A]">
        <div className="flex items-center gap-2">
          {/* Botón de imagen */}
          <button
            onClick={handleImageSelect}
            disabled={isTyping}
            className="w-9 h-9 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 flex-shrink-0"
            title="Adjuntar imagen"
          >
            <Camera className="w-4 h-4 text-[#888888]" />
          </button>

          {/* Botón de audio */}
          <button
            onClick={handleAudioSelect}
            disabled={isTyping}
            className="w-9 h-9 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 flex-shrink-0"
            title="Adjuntar audio"
          >
            <Mic className="w-4 h-4 text-[#888888]" />
          </button>

          {/* Input de texto */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe el problema..."
            disabled={isTyping}
            className="flex-1 bg-[#1A1A1A] rounded-full px-5 py-3 outline-none text-white placeholder:text-[#888888] border border-transparent focus:border-[#FF6B2B] transition-colors disabled:opacity-50"
          />

          {/* Botón enviar */}
          <button
            onClick={handleSend}
            className="w-10 h-10 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
            disabled={(!inputText.trim() && !pendingImage && !pendingAudio) || isTyping}
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        className="hidden"
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioChange}
        className="hidden"
      />
    </div>
  );
}
