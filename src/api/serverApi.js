
import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";

const { VITE_API_URL } = getEnvVariables();

// Función para el login
export const login = async ({ username, password }) => {
  console.log("URL de consulta:", `${VITE_API_URL}/auth/login`);
  try {
    const response = await axios.post(`${VITE_API_URL}/auth/login`, {
      username,
      password, // El cuerpo se pasa como un objeto en Axios
    });

    return response.data; // Axios ya retorna los datos en JSON
  } catch (error) {
    console.error("Error en la solicitud:", error.response?.data || error.message);
    throw error; // Retorna el error para manejarlo en otro lugar
  }
};


export const getMarkers = async () => {

  console.log("url: ", `${VITE_API_URL}/markers/`);
  try {
    const response = await axios.get(`${VITE_API_URL}/markers/getMarkers`);
    return response.data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};
