import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapComponent() {
  useEffect(() => {
    const map = L.map('map').setView([-34.9011, -56.1645], 12); // Coordenadas de Montevideo

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markers = [
      { position: [-34.9011, -56.1645], title: 'Punto 1' },
      { position: [-34.9033, -56.1881], title: 'Punto 2' },
    ];

    markers.forEach(({ position, title }) => {
      const marker = L.marker(position).addTo(map);
      marker.bindPopup(`<b>${title}</b>`).openPopup();
    });
  }, []);

  return <div id="map" style={{ width: '100%', height: '500px' }}>Cargando mapa...</div>;
}

ReactDOM.hydrate(
  <MapComponent />,
  document.getElementById('root')
);