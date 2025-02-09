import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ICoordinates {
    lat: number;
    lng: number;
}

interface IProps {
    onSelectedCoordinates: (coordinates: { lat: number; lng: number }) => void;
}
const Map = ({ onSelectedCoordinates }: IProps) => {
    const [coordenadas, setCoordenadas] = useState<ICoordinates | null>(null); // Estado para almacenar las coordenadas
    // Creamos una referencia para el contenedor del mapa
    const mapRef = useRef(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            // Inicializar el mapa
            const map = L.map(mapRef.current).setView([-34, -65], 5);
            // Agregar una capa de mosaico
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);


            // Manejar clics en el mapa
            map.on('click', (e) => {
                const { lat, lng } = e.latlng; // Obtener las coordenadas del clic
                setCoordenadas({ lat, lng }); // Actualizar el estado con las coordenadas
                onSelectedCoordinates({ lat, lng });
                // Eliminar el marcador anterior si existe
                if (markerRef.current) {
                    map.removeLayer(markerRef.current); // Eliminar el marcador del mapa
                }

                // Crear un nuevo marcador y guardarlo en la referencia
                markerRef.current = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(`Ubicación: ${lat}, ${lng}`)
                    .openPopup();
            });

            // Limpiar el mapa cuando el componente se desmonte
            return () => {
                map.remove();
            };
        }
    }, [onSelectedCoordinates]);

    return (
        <div className='relative'>
            <div
                ref={mapRef}
                style={{ height: '500px', width: '100%' }}
                className='cursor-pointer z-10'
            ></div>
            {coordenadas && (
                <div className='absolute bg-white p-2 rounded-lg shadow-md top-1 right-1 z-20'>
                    <h3>Coordenadas:</h3>
                    <p>Lat: {coordenadas.lat}</p>
                    <p>Long: {coordenadas.lng}</p>
                </div>
            )}
        </div>
    )
};

export default Map;