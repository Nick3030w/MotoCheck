import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Send, Camera, Mic } from "lucide-react";

interface Message {
  id: number;
  type: "user" | "ai";
  text: string;
  chips?: string[];
}

export function ChatScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      text: "Hola, soy MOTOCHECK. Describe el problema de tu moto o responde mis preguntas.",
    },
    {
      id: 2,
      type: "ai",
      text: "¿Dónde sientes la falla?",
      chips: ["Motor", "Frenos", "Suspensión", "Eléctrico", "Otro"],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: inputText,
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "ai",
          text: "¿Cuándo ocurre el problema?",
          chips: ["Al arrancar", "En marcha", "Al frenar", "Siempre"],
        },
      ]);
    }, 1500);
  };

  const handleChipClick = (chip: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: chip,
    };

    setMessages([...messages, newMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (chip === "Motor") {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "ai",
            text: "Entiendo. Analizando los síntomas del motor. Parece ser un problema con las bujías. ¿Quieres ver el diagnóstico completo?",
          },
        ]);
        setTimeout(() => navigate("/result/3"), 2000);
      }
    }, 1500);
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
          <p className="text-sm text-[#888888]">MOTOCHECK está en línea</p>
        </div>
        <div className="w-3 h-3 bg-[#2ECC71] rounded-full animate-pulse" />
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
              <div
                className={`rounded-3xl px-5 py-3 ${
                  message.type === "user"
                    ? "bg-[#FF6B2B] text-white"
                    : "bg-[#1A1A1A] text-white border border-[#888888]/10"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>

              {/* Quick reply chips */}
              {message.chips && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.chips.map((chip, index) => (
                    <button
                      key={index}
                      onClick={() => handleChipClick(chip)}
                      className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#FF6B2B]/20 border border-[#888888]/20 hover:border-[#FF6B2B] rounded-full text-sm transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
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
      </div>

      {/* Input bar */}
      <div className="px-6 py-4 border-t border-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#2A2A2A] transition-colors">
            <Camera className="w-5 h-5 text-[#888888]" />
          </button>
          <button className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#2A2A2A] transition-colors">
            <Mic className="w-5 h-5 text-[#888888]" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe el problema..."
            className="flex-1 bg-[#1A1A1A] rounded-full px-5 py-3 outline-none text-white placeholder:text-[#888888] border border-transparent focus:border-[#FF6B2B] transition-colors"
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={!inputText.trim()}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
