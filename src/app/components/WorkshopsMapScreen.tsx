import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, MapPin, Phone, Star, Navigation, Clock, ExternalLink, Loader2, Search } from "lucide-react";
import { useGeolocation, calculateDistance, openGoogleMapsRoute, openGoogleMapsSearch } from "@/hooks/useGeolocation";

interface Workshop {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  reviews: number;
  specialties: string[];
  lat: number;
  lng: number;
}

// Talleres de motos en Bogotá (datos reales de referencia)
const WORKSHOPS_DB: Workshop[] = [
  {
    id: 1,
    name: "Auteco Mobility - Centro de Servicio",
    address: "Cra. 30 #10-45, Bogotá",
    phone: "+57 601 743 2100",
    hours: "Lun-Vie 8:00-18:00, Sáb 8:00-13:00",
    rating: 4.5,
    reviews: 234,
    specialties: ["Kawasaki", "Bajaj", "KTM", "Todas las marcas"],
    lat: 4.6097,
    lng: -74.0817,
  },
  {
    id: 2,
    name: "Yamaha Premium Center",
    address: "Av. Calle 26 #69-76, Bogotá",
    phone: "+57 601 425 6700",
    hours: "Lun-Vie 8:00-18:00, Sáb 9:00-14:00",
    rating: 4.7,
    reviews: 189,
    specialties: ["Yamaha", "Diagnóstico electrónico", "Mantenimiento preventivo"],
    lat: 4.6253,
    lng: -74.1087,
  },
  {
    id: 3,
    name: "Honda Motos - Servicio Técnico",
    address: "Cra. 7 #127-48, Bogotá",
    phone: "+57 601 612 3400",
    hours: "Lun-Vie 7:30-17:30, Sáb 8:00-12:00",
    rating: 4.6,
    reviews: 312,
    specialties: ["Honda", "Repuestos originales", "Garantía"],
    lat: 4.7066,
    lng: -74.0321,
  },
  {
    id: 4,
    name: "Moto Racing Service",
    address: "Calle 13 #68D-35, Bogotá",
    phone: "+57 601 290 5500",
    hours: "Lun-Sáb 7:00-19:00",
    rating: 4.8,
    reviews: 156,
    specialties: ["BMW", "Ducati", "Motos alta gama", "Reparación rápida"],
    lat: 4.6382,
    lng: -74.1172,
  },
  {
    id: 5,
    name: "Taller El Pistón - Motos",
    address: "Cra. 24 #53-25, Bogotá",
    phone: "+57 315 892 4567",
    hours: "Lun-Sáb 7:00-18:00",
    rating: 4.4,
    reviews: 98,
    specialties: ["Todas las marcas", "Económico", "Motor", "Frenos"],
    lat: 4.6451,
    lng: -74.0723,
  },
  {
    id: 6,
    name: "Suzuki Center Bogotá",
    address: "Av. Boyacá #64H-29, Bogotá",
    phone: "+57 601 437 8900",
    hours: "Lun-Vie 8:00-17:00, Sáb 8:00-13:00",
    rating: 4.3,
    reviews: 145,
    specialties: ["Suzuki", "Diagnóstico", "Repuestos"],
    lat: 4.6589,
    lng: -74.1456,
  },
];

export function WorkshopsMapScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { latitude, longitude, loading: geoLoading, error: geoError } = useGeolocation();
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  // Calcular distancias y ordenar por cercanía
  const workshops = useMemo(() => {
    if (!latitude || !longitude) return WORKSHOPS_DB;

    return WORKSHOPS_DB.map((w) => ({
      ...w,
      distance: calculateDistance(latitude, longitude, w.lat, w.lng),
    }))
      .sort((a, b) => a.distance - b.distance);
  }, [latitude, longitude]);

  const formatDistance = (km: number | undefined) => {
    if (!km) return "";
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  };

  const handleNavigate = (workshop: Workshop) => {
    openGoogleMapsRoute(workshop.lat, workshop.lng, workshop.name);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone.replace(/\s/g, "")}`, "_self");
  };

  const handleSearchMore = () => {
    if (latitude && longitude) {
      openGoogleMapsSearch(latitude, longitude);
    } else {
      openGoogleMapsSearch(4.6097, -74.0817); // Default: Bogotá
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
            Talleres cercanos
          </h1>
          <p className="text-sm text-[#888888]">
            {geoLoading
              ? "Obteniendo ubicación..."
              : geoError
              ? "Ubicación no disponible"
              : `${workshops.length} talleres encontrados`}
          </p>
        </div>
      </div>

      {/* Location status / Search in Maps button */}
      <div className="px-6 py-4">
        {geoLoading ? (
          <div className="flex items-center justify-center gap-3 py-4">
            <Loader2 className="w-5 h-5 text-[#FF6B2B] animate-spin" />
            <span className="text-sm text-[#888888]">Detectando tu ubicación...</span>
          </div>
        ) : geoError ? (
          <div className="bg-[#F39C12]/10 border border-[#F39C12]/30 rounded-2xl p-4 mb-4">
            <p className="text-sm text-[#F39C12] mb-2">{geoError}</p>
            <p className="text-xs text-[#888888]">Mostrando talleres en Bogotá por defecto</p>
          </div>
        ) : null}

        {/* Search in Google Maps button */}
        <button
          onClick={handleSearchMore}
          className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#888888]/10 rounded-2xl p-4 flex items-center gap-3 transition-colors"
        >
          <div className="w-10 h-10 bg-[#FF6B2B]/10 rounded-xl flex items-center justify-center">
            <Search className="w-5 h-5 text-[#FF6B2B]" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-[Space_Grotesk] text-sm" style={{ fontWeight: 600 }}>
              Buscar más talleres en Google Maps
            </p>
            <p className="text-xs text-[#888888]">Abre Maps con talleres de motos cerca de ti</p>
          </div>
          <ExternalLink className="w-4 h-4 text-[#888888]" />
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
              onClick={() => setSelectedWorkshop(workshop)}
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
                    {"distance" in workshop && (
                      <div className="text-sm text-[#FF6B2B] font-[Space_Grotesk] whitespace-nowrap ml-2" style={{ fontWeight: 600 }}>
                        {formatDistance((workshop as any).distance)}
                      </div>
                    )}
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
                    {workshop.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#FF6B2B]/10 text-[#FF6B2B] text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(workshop);
                      }}
                      className="flex-1 bg-gradient-to-br from-[#FF6B2B] to-[#FF8C5A] hover:opacity-90 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-opacity"
                    >
                      <Navigation className="w-4 h-4" />
                      Cómo llegar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCall(workshop.phone);
                      }}
                      className="flex-1 bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 border border-[#2ECC71] text-[#2ECC71] py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                    >
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
