import React from "react";

export const Bootombar = ({ speed, setSpeed }) => {
  return (
    <div className="fixed-bottom bg-dark text-white p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <span className="p2">Car speed {speed}</span>
        <input
          type="range"
          min="1"
          max="100"
          value={speed} // Usa la velocidad del padre
          className="form-range"
          onChange={(event) => setSpeed(Number(event.target.value))}  // Modifica directamente la velocidad del padre/>
        />
      </div>
    </div>
  );
};
