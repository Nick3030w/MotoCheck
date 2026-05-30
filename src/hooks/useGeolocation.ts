import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Tu navegador no soporta geolocalización",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        let message = "No se pudo obtener tu ubicación";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Permiso de ubicación denegado. Actívalo en la configuración de tu navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Ubicación no disponible";
            break;
          case error.TIMEOUT:
            message = "Tiempo de espera agotado al obtener ubicación";
            break;
        }
        setState((prev) => ({ ...prev, loading: false, error: message }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache de 5 minutos
      }
    );
  }, []);

  return state;
}

/**
 * Calcula la distancia entre dos puntos geográficos (fórmula de Haversine)
 * @returns distancia en kilómetros
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Abre Google Maps con la ruta desde la ubicación actual hasta el destino
 */
export function openGoogleMapsRoute(destLat: number, destLng: number, destName?: string) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
  window.open(url, "_blank");
}

/**
 * Abre Google Maps buscando talleres de motos cerca de una ubicación
 */
export function openGoogleMapsSearch(lat: number, lng: number) {
  const url = `https://www.google.com/maps/search/taller+motos+motocicletas/@${lat},${lng},14z`;
  window.open(url, "_blank");
}
