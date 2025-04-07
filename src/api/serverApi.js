import { getEnvVariables } from "../helpers/getEnvVariables";

const { VITE_API_URL } = getEnvVariables();

export const login = async (username, password) => {
    console.log("email",username);
    console.log("password",password);
  try {
    const response = await fetch(`${VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }), 
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const data = await response.json(); 
    return data; 
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};