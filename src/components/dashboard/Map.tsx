import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
    initialCoordinates?: { lat: number; lng: number } | null;
    onSelectedCoordinates?: (coordinates: { lat: number; lng: number }) => void;
    viewOnly?: boolean;
    onChange?: () => void;
}

const Map = ({
    initialCoordinates = null,
    onSelectedCoordinates,
    viewOnly = false,
    onChange,
}: MapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    // Efecto para inicializar el mapa (solo se ejecuta una vez)
    useEffect(() => {
        if (!mapRef.current) return;

        // Inicializar el mapa
        const map = L.map(mapRef.current).setView(
            initialCoordinates
                ? [initialCoordinates.lat, initialCoordinates.lng]
                : [-35, -65],
            initialCoordinates ? 18 : 5
        );

        mapInstanceRef.current = map;

        // Agregar capa de mosaico
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Manejar clicks si no es modo vista
        if (!viewOnly && onSelectedCoordinates) {
            map.on('click', (e) => {
                const { lat, lng } = e.latlng;
                onSelectedCoordinates({ lat, lng });
            });
        }

        // Cleanup
        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []); // Solo se ejecuta al montar el componente

    // Efecto para manejar las actualizaciones de coordenadas
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Eliminar marcador existente
        if (markerRef.current) {
            markerRef.current.remove();
            onChange?.();
        }

        // Si hay coordenadas, añadir nuevo marcador
        if (initialCoordinates) {

            markerRef.current = L.marker([initialCoordinates.lat, initialCoordinates.lng])
                .addTo(map)
                .bindPopup(
                    `Ubicación: ${initialCoordinates.lat.toFixed(4)}, ${initialCoordinates.lng.toFixed(4)}`
                )
                .openPopup();
        }
    }, [initialCoordinates]); // Se ejecuta cuando cambian las coordenadas

    return (
        <div
            ref={mapRef}
            className={`h-[500px] w-full ${!viewOnly ? 'cursor-pointer' : ''} z-10`}
        />
    );
};

export default Map;