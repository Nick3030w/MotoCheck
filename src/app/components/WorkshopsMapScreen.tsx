import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, MapPin, Phone, Star, Navigation, Clock, ExternalLink } from "lucide-react";

interface Workshop {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  phone: string;
  hours: string;
  specialties: string[];
  lat: number;
  lng: number;
}

export function WorkshopsMapScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  const workshops: Workshop[] = [
    {
      id: 1,
      name: "Taller Mecánico El Piloto",
      address: "Av. Insurgentes Sur 1234, Col. Del Valle",
      distance: "0.8 km",
      rating: 4.8,
      reviews: 156,
      phone: "+52 55 1234 5678",
      hours: "Lun-Sáb 8:00-19:00",
      specialties: ["Motor", "Bujías", "Sistema eléctrico"],
      lat: 19.3697,
      lng: -99.1625,
    },
    {
      id: 2,
      name: "Motos Racing Pro",
      address: "Calle Revolución 456, Col. San Ángel",
      distance: "1.2 km",
      rating: 4.6,
      reviews: 203,
      phone: "+52 55 2345 6789",
      hours: "Lun-Vie 9:00-18:00",
      specialties: ["Kawasaki", "Diagnóstico", "Mantenimiento"],
      lat: 19.3580,
      lng: -99.1870,
    },
    {
      id: 3,
      name: "Servicio Técnico MotoExpress",
      address: "Av. Reforma 789, Col. Polanco",
      distance: "2.1 km",
      rating: 4.9,
      reviews: 312,
      phone: "+52 55 3456 7890",
      hours: "Lun-Sáb 7:00-20:00",
      specialties: ["Todas las marcas", "Reparación rápida"],
      lat: 19.4326,
      lng: -99.1332,
    },
    {
      id: 4,
      name: "Kawasaki Service Center",
      address: "Blvd. Miguel de Cervantes 321, Col. Granada",
      distance: "3.5 km",
      rating: 4.7,
      reviews: 89,
      phone: "+52 55 4567 8901",
      hours: "Lun-Vie 8:00-17:00",
      specialties: ["Kawasaki oficial", "Refacciones originales"],
      lat: 19.4010,
      lng: -99.1670,
    },
  ];

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
            Talleres cercanos
          </h1>
          <p className="text-sm text-[#888888]">4 talleres encontrados</p>
        </div>
      </div>

      {/* Map area */}
      <div className="relative h-64 bg-[#1A1A1A] mx-6 my-4 rounded-3xl overflow-hidden border border-[#888888]/10">
        {/* Simulated map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A]">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-[#888888]" style={{ top: `${i * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-[#888888]" style={{ left: `${i * 10}%` }} />
            ))}
          </div>

          {/* Current location marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative">
              <div className="w-4 h-4 bg-[#2ECC71] rounded-full border-2 border-white shadow-lg" />
              <div className="absolute inset-0 bg-[#2ECC71] rounded-full animate-ping opacity-75" />
            </div>
          </div>

          {/* Workshop markers */}
          {workshops.map((workshop, index) => (
            <button
              key={workshop.id}
              onClick={() => setSelectedWorkshop(workshop)}
              className="absolute z-10 transition-transform hover:scale-110"
              style={{
                top: `${30 + index * 15}%`,
                left: `${20 + index * 20}%`,
              }}
            >
              <div className="relative">
                <MapPin
                  className={`w-8 h-8 ${
                    selectedWorkshop?.id === workshop.id ? "text-[#FF6B2B]" : "text-[#F39C12]"
                  } drop-shadow-lg`}
                  fill="currentColor"
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0F0F0F] px-2 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {workshop.name}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Map controls */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-[#FF6B2B] hover:bg-[#FF8C5A] rounded-full flex items-center justify-center shadow-lg transition-colors">
          <Navigation className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Workshops list */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-3">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className={`bg-[#1A1A1A] rounded-2xl p-5 border transition-all ${
                selectedWorkshop?.id === workshop.id
                  ? "border-[#FF6B2B] bg-[#FF6B2B]/5"
                  : "border-[#888888]/10 hover:border-[#888888]/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FF6B2B]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#FF6B2B]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-[Space_Grotesk] mb-1" style={{ fontWeight: 600 }}>
                        {workshop.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#F39C12] fill-[#F39C12]" />
                          <span className="text-sm">{workshop.rating}</span>
                        </div>
                        <span className="text-sm text-[#888888]">
                          ({workshop.reviews} reseñas)
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-[#FF6B2B] font-[Space_Grotesk] whitespace-nowrap ml-2" style={{ fontWeight: 600 }}>
                      {workshop.distance}
                    </div>
                  </div>

                  <p className="text-sm text-[#888888] mb-3 flex items-start gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {workshop.address}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-[#888888] mb-3">
                    <Clock className="w-4 h-4" />
                    {workshop.hours}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {workshop.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#FF6B2B]/10 text-[#FF6B2B] text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] hover:opacity-90 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-opacity">
                      <Navigation className="w-4 h-4" />
                      Cómo llegar
                    </button>
                    <button className="flex-1 bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 border border-[#2ECC71] text-[#2ECC71] py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
                      <Phone className="w-4 h-4" />
                      Llamar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
