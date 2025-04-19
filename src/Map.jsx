import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-rotatedmarker"; // Necesario para habilitar la rotación de marcadores

import { getMarkers } from "./api/serverApi";
import { Navbar } from "./components/Navbar";
import { recorridoDetallado } from "./recorridoDetallado"; // Datos con coordenadas y direcciones (grados entre 0 y 359)
import { Bootombar } from "./components/Bootombar";

// Configuración global de íconos de Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

// Función para generar íconos personalizados del autito según el ángulo de dirección
const carIcon = (angle) =>
  L.icon({
    iconUrl: `/car-icons/car-${normalizeAngle(angle)}.png`, // Usa imágenes de autitos orientadas
    iconSize: [40, 40], // Tamaño del ícono
    iconAnchor: [20, 20], // Centro del ícono
    className: "car-icon", // Clase CSS personalizada
  });

// Normaliza el ángulo a múltiplos de 45 (0, 45, 90, ..., 315)
function normalizeAngle(angle) {
  const directions = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  return directions.reduce((prev, curr) =>
    Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev
  );
}

function Map() {
  // Estado del mapa
  const [map, setMap] = useState(null);
  
  // Estado de la velocidad del vehículo
  const [speedCar, setSpeedCar] = useState(1);
  
  // Estado de los vehículos en movimiento
  const [vehiculos, setVehiculos] = useState([
    { id: "auto1", inicio: 0, direccion: 1, activo: true }, // Vehículo normal
    { id: "auto2", inicio: Math.floor(recorridoDetallado.length / 2), direccion: -1, activo: true }, // Desde mitad
    { id: "auto3", inicio: recorridoDetallado.length - 1, direccion: -1, activo: true }, // Recorrido inverso
    { id: "auto4", inicio: Math.floor(recorridoDetallado.length / 2), direccion: 1, activo: true },
  ]);

  // Estado para guardar los marcadores de cada vehículo
  const [marcadoresVehiculos, setMarcadoresVehiculos] = useState({});

  /*
  ** 1️⃣ PRIMER USEEFFECT: Inicializa el mapa cuando el componente se monta **
  ** - Se ejecuta SOLO UNA VEZ al inicio cuando "map" es null **
  */
  useEffect(() => {
    if (!map) {
      const start = recorridoDetallado[0]; // Obtiene el punto inicial
      const mapInstance = L.map("map").setView([start.lat, start.lng], 17); // Inicializa el mapa
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
      }).addTo(mapInstance); // Agrega la capa base
      setMap(mapInstance); // Guarda el mapa en el estado
    }
  }, [map]);

  /*
  ** 2️⃣ SEGUNDO USEEFFECT: Obtiene los marcadores adicionales desde el servidor **
  ** - Se ejecuta una vez cuando el mapa ya está listo **
  */
  useEffect(() => {
    if (!map) return;

    const fetchMarkers = async () => {
      try {
        const markers = await getMarkers();
        const bounds = L.latLngBounds();

        markers.forEach((marker) => {
          L.marker(marker.coordinates).addTo(map).bindPopup(marker.label);
          bounds.extend(marker.coordinates);
        });

        bounds.extend([recorridoDetallado[0].lat, recorridoDetallado[0].lng]);

        if (markers.length > 0) {
          map.fitBounds(bounds, { maxZoom: 20 }); // Ajusta el zoom para mostrar todos los marcadores
        }
      } catch (error) {
        console.error("Error al obtener los marcadores:", error);
      }
    };

    fetchMarkers();
  }, [map]);
 

  useEffect(() => {
    if (!map) return;
  
    // Creamos los marcadores de cada vehículo activo
    vehiculos.forEach((vehiculo) => {
      if (!vehiculo.activo) return; // Solo actualizamos vehículos activos
  
      let index = vehiculo.inicio;
  
      // Si el marcador no existe, crearlo y guardarlo en el estado
      if (!marcadoresVehiculos[vehiculo.id]) {
        const puntoInicial = recorridoDetallado[index];
        const marker = L.marker([puntoInicial.lat, puntoInicial.lng], {
          icon: carIcon(puntoInicial.direccion),
          rotationAngle: puntoInicial.direccion,
          rotationOrigin: "center center",
        }).addTo(map);
  
        setMarcadoresVehiculos((prev) => ({
          ...prev,
          [vehiculo.id]: marker,
        }));
       /*  setSpeedCar((prev)=>({
          ...prev, [vehiculo.inicio] : index
        })) */
      }
    });
  }, [map, vehiculos]); // Se ejecuta cuando el mapa y los vehículos cambian
  
  // 🔹 Nuevo `useEffect` separado para mover los vehículos después de que los marcadores estén listos
  useEffect(() => {
    if (!map || Object.keys(marcadoresVehiculos).length === 0) return;
  
    const nuevosVehiculos = vehiculos.map((vehiculo) => {
      if (!vehiculo.activo) return vehiculo;
      console.log("vehiculo.inicio: ",vehiculo.inicio)
      let index = vehiculo.inicio;
      const interval = setInterval(() => {
        index += vehiculo.direccion;
  
        if (index < 0 || index >= recorridoDetallado.length) {
          console.log("clearInterval: ",clearInterval)
          clearInterval(interval);
          return;
        }
  
        const nuevoPunto = recorridoDetallado[index];
  
        if (marcadoresVehiculos[vehiculo.id]) {
          marcadoresVehiculos[vehiculo.id].setLatLng([nuevoPunto.lat, nuevoPunto.lng]);
          marcadoresVehiculos[vehiculo.id].setIcon(carIcon(nuevoPunto.direccion));
          marcadoresVehiculos[vehiculo.id].setRotationAngle(nuevoPunto.direccion);
        }
      }, 101 - speedCar);
      console.log("index: ",index)
      return { ...vehiculo, inicio: index, interval };
    });
  
    setVehiculos(nuevosVehiculos);
  
    return () => nuevosVehiculos.forEach((vehiculo) => clearInterval(vehiculo.interval));
  }, [map, speedCar, marcadoresVehiculos]); // Se ejecuta cuando los marcadores están listos
  

  // Renderiza la barra de navegación y el contenedor del mapa
  return (
    <>
      {/* Barra de navegación */}
      <Navbar />
      
      {/* Contenedor del mapa */}
      <div id="map" style={{ height: "550px", width: "100%" }}></div>
      
      {/* Barra de Bottom */}
      <Bootombar setSpeed={setSpeedCar} speed={speedCar} />
    </>
  );
}

export default Map; // Exporta el componente para usarlo en otros lugares







/* 

 useEffect(() => {
    if (!map) return;
  
    // Creamos los marcadores de cada vehículo activo
    const nuevosVehiculos = vehiculos.map((vehiculo) => {
      if (!vehiculo.activo) return vehiculo; // Solo actualizamos vehículos activos
  
      let index = vehiculo.inicio; // Punto inicial del vehículo
  
      // Crear marcador para cada vehículo si aún no tiene uno
      if (!vehiculo.marker) {
        const puntoInicial = recorridoDetallado[index];
        vehiculo.marker = L.marker([puntoInicial.lat, puntoInicial.lng], {
          icon: carIcon(puntoInicial.direccion),
          rotationAngle: puntoInicial.direccion,
          rotationOrigin: "center center",
        }).addTo(map);
      }
  
      // Mover el vehículo
      vehiculo.interval = setInterval(() => {
        index += vehiculo.direccion;
  
        // Si el vehículo llegó al final o principio, se detiene
        if (index < 0 || index >= recorridoDetallado.length) {
          clearInterval(vehiculo.interval);
          return;
        }
  
        // Actualiza la posición del marcador
        const nuevoPunto = recorridoDetallado[index];
        vehiculo.marker.setLatLng([nuevoPunto.lat, nuevoPunto.lng]);
        vehiculo.marker.setIcon(carIcon(nuevoPunto.direccion));
        vehiculo.marker.setRotationAngle(nuevoPunto.direccion);
      }, 101 - speedCar);
  
      return vehiculo;
    });
  
    setVehiculos(nuevosVehiculos); // Actualizamos el estado con los vehículos en movimiento
  
    return () => {
      nuevosVehiculos.forEach((vehiculo) => clearInterval(vehiculo.interval)); // Limpiamos los intervalos
    };
  }, [map, speedCar, vehiculos]); // Se actualiza cuando `speedCar` cambia o los vehículos se modifican.



*/
