import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AppRouters } from "./router/AppRouters";
import { store } from "./store/store";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Contenedor raíz (>> root <<) no encontrado");
}

ReactDOM.hydrateRoot(
  rootElement,
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRouters />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
