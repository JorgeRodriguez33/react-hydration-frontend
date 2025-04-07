import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configura las rutas de los iconos
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

function Map() {
  const [map, setMap] = useState(null);

  // Lista inicial de lugares en Montevideo
  const initialPlaces = [
    { label: "Plaza Independencia", coordinates: [-34.9055, -56.1860] },
    { label: "Teatro Solís", coordinates: [-34.9078, -56.1994] },
    { label: "Mercado del Puerto", coordinates: [-34.9076, -56.2118] },
  ];

  const [places, setPlaces] = useState(initialPlaces);

  useEffect(() => {
    // Configuración inicial del mapa
    const mapInstance = L.map("map").setView([-34.9055, -56.1860], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapInstance);

    // Agrega los marcadores iniciales al mapa
    places.forEach(place => {
      L.marker(place.coordinates)
        .addTo(mapInstance)
        .bindPopup(place.label)
        .openPopup();
    });

    setMap(mapInstance); // Guarda la instancia del mapa para usarla luego
  }, [places]);

  // Operación para agregar nuevos marcadores
  const addMarker = (label, coordinates) => {
    const newPlace = { label, coordinates };
    setPlaces(prevPlaces => [...prevPlaces, newPlace]);

    if (map) {
      L.marker(coordinates)
        .addTo(map)
        .bindPopup(label);
    }
  };

  // Ejemplo de uso de la función para agregar un nuevo marcador
  useEffect(() => {
    // Puedes probar agregar este marcador al cargar el componente
    addMarker("Estadio Centenario", [-34.8949, -56.1501]);
  }, []);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
}

export default Map;