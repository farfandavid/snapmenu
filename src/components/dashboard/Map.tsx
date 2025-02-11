import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
    initialCoordinates?: { lat: number; lng: number } | null;
    onSelectedCoordinates?: (coordinates: { lat: number; lng: number }) => void;
    viewOnly?: boolean;
}

const Map = ({
    initialCoordinates = null,
    onSelectedCoordinates,
    viewOnly = false
}: MapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const zoomRef = useRef<number>(initialCoordinates ? 13 : 5);

    useEffect(() => {
        if (!mapRef.current) return;

        const initialView = initialCoordinates
            ? [initialCoordinates.lat, initialCoordinates.lng]
            : [-35, -65];

        // Crear instancia del mapa
        const map = L.map(mapRef.current).setView(
            initialView as [number, number],
            zoomRef.current
        );

        mapInstanceRef.current = map;

        // Guardar el nivel de zoom cuando cambie
        map.on('zoomend', () => {
            zoomRef.current = map.getZoom();
        });

        // Agregar capa de mosaico
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Crear marcador inicial si hay coordenadas
        if (initialCoordinates) {
            markerRef.current = L.marker([initialCoordinates.lat, initialCoordinates.lng])
                .addTo(map)
                .bindPopup(`Ubicación: ${initialCoordinates.lat.toFixed(4)}, ${initialCoordinates.lng.toFixed(4)}`)
                .openPopup();
        }

        // Manejar clicks si no es modo vista
        if (!viewOnly && onSelectedCoordinates) {
            map.on('click', (e) => {
                const { lat, lng } = e.latlng;

                // Eliminar marcador anterior si existe
                if (markerRef.current) {
                    markerRef.current.remove();
                }

                // Crear nuevo marcador
                markerRef.current = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(`Ubicación: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
                    .openPopup();

                onSelectedCoordinates({ lat, lng });
            });
        }

        // Cleanup
        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [initialCoordinates, onSelectedCoordinates, viewOnly]);

    return (
        <div
            ref={mapRef}
            className={`h-[500px] w-full ${!viewOnly ? 'cursor-pointer' : ''}`}
        />
    );
};

export default Map;