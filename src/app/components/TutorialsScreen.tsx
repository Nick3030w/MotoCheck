import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, Play, Clock, Eye, ThumbsUp } from "lucide-react";

interface Tutorial {
  id: number;
  title: string;
  youtubeId: string;
  duration: string;
  views: string;
  likes: number;
  difficulty: "Fácil" | "Intermedio" | "Avanzado";
  description: string;
  author: string;
}

export function TutorialsScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedVideo, setSelectedVideo] = useState<Tutorial | null>(null);

  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Cómo cambiar bujías de encendido en motos",
      youtubeId: "NdBT26FVkCk",
      duration: "10:23",
      views: "125K",
      likes: 3400,
      difficulty: "Fácil",
      description: "Tutorial paso a paso para reemplazar las bujías de encendido. Aprende la técnica correcta y las herramientas necesarias.",
      author: "MecánicoExpress",
    },
    {
      id: 2,
      title: "Diagnóstico de fallas en sistema de encendido",
      youtubeId: "_aXy5OTYOq4",
      duration: "12:30",
      views: "89K",
      likes: 2100,
      difficulty: "Intermedio",
      description: "Identifica problemas comunes en el sistema de encendido de motos y cómo solucionarlos.",
      author: "Kawasaki Pro",
    },
    {
      id: 3,
      title: "Mantenimiento preventivo: Sistema de encendido",
      youtubeId: "vSVfkAGD8UY",
      duration: "15:20",
      views: "203K",
      likes: 5600,
      difficulty: "Fácil",
      description: "Aprende a realizar mantenimiento preventivo para evitar fallas en el sistema de encendido de tu moto.",
      author: "MotosTotal",
    },
    {
      id: 4,
      title: "Problemas de arranque: Soluciones rápidas",
      youtubeId: "Wd9RLqqnLQs",
      duration: "10:15",
      views: "156K",
      likes: 4200,
      difficulty: "Fácil",
      description: "Resuelve problemas de arranque difícil causados por bujías defectuosas o sistema eléctrico.",
      author: "TallerVirtual",
    },
    {
      id: 5,
      title: "Ajuste de torque en bujías - Técnica profesional",
      youtubeId: "EjuJ35YbAho",
      duration: "6:50",
      views: "67K",
      likes: 1800,
      difficulty: "Intermedio",
      description: "Aprende la técnica correcta de torque para instalar bujías sin dañar la rosca del motor.",
      author: "ProMecánico",
    },
    {
      id: 6,
      title: "Lectura de bujías: Diagnóstico del motor",
      youtubeId: "NpzbzSz2A3I",
      duration: "9:40",
      views: "112K",
      likes: 3100,
      difficulty: "Avanzado",
      description: "Aprende a leer el estado de las bujías para diagnosticar problemas internos del motor.",
      author: "DiagnósticoMotos",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return { bg: "bg-[#2ECC71]/10", text: "text-[#2ECC71]", border: "border-[#2ECC71]" };
      case "Intermedio":
        return { bg: "bg-[#F39C12]/10", text: "text-[#F39C12]", border: "border-[#F39C12]" };
      case "Avanzado":
        return { bg: "bg-[#E74C3C]/10", text: "text-[#E74C3C]", border: "border-[#E74C3C]" };
      default:
        return { bg: "bg-[#888888]/10", text: "text-[#888888]", border: "border-[#888888]" };
    }
  };

  return (
    <div className="h-full bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-[#1A1A1A] bg-[#0F0F0F] z-10">
        <button
          onClick={() => navigate(`/result/${id}`)}
          className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-[Space_Grotesk]" style={{ fontWeight: 700 }}>
            Tutoriales de reparación
          </h1>
          <p className="text-sm text-[#888888]">Aprende a reparar tu moto</p>
        </div>
      </div>

      {/* Video player (if video selected) */}
      {selectedVideo && (
        <div className="bg-[#0F0F0F] px-6 pt-4">
          {/* YouTube Embed */}
          <div className="relative w-full rounded-3xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-4 mb-4">
            <h2 className="text-lg font-[Space_Grotesk] mb-2" style={{ fontWeight: 600 }}>
              {selectedVideo.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-[#888888] mb-3">
              <span>{selectedVideo.author}</span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {selectedVideo.views}
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {selectedVideo.likes}
              </div>
            </div>
            <p className="text-sm text-[#888888] leading-relaxed">
              {selectedVideo.description}
            </p>
          </div>
        </div>
      )}

      {/* Tutorials list */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <h3 className="text-sm text-[#888888] mb-3 uppercase tracking-wider">
          {selectedVideo ? "Más videos relacionados" : "Videos recomendados"}
        </h3>
        <div className="space-y-3 pb-6">
          {tutorials.map((tutorial) => {
            const difficultyStyle = getDifficultyColor(tutorial.difficulty);
            return (
              <button
                key={tutorial.id}
                onClick={() => setSelectedVideo(tutorial)}
                className={`w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-2xl p-4 transition-all text-left ${
                  selectedVideo?.id === tutorial.id ? "border-2 border-[#FF6B2B]" : "border border-[#888888]/10"
                }`}
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-32 h-20 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-[#888888]/10">
                    <img
                      src={`https://img.youtube.com/vi/${tutorial.youtubeId}/mqdefault.jpg`}
                      alt={tutorial.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-[#0F0F0F]/90 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tutorial.duration}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-[Space_Grotesk] text-sm mb-2 line-clamp-2" style={{ fontWeight: 600 }}>
                      {tutorial.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-2 text-xs text-[#888888]">
                      <span>{tutorial.author}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-[#888888]">
                        <Eye className="w-3 h-3" />
                        {tutorial.views}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full border ${difficultyStyle.bg} ${difficultyStyle.text} ${difficultyStyle.border}`}>
                        {tutorial.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
