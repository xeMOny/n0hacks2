import "./index.css";
import "./i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { initAnalytics } from "./lib/analytics";

initAnalytics();

// La directiva frame-ancestors de la CSP (en index.html) no funciona: va por
// <meta> porque GitHub Pages no permite cabeceras HTTP propias, y los
// navegadores ignoran frame-ancestors fuera de una cabecera real. Este
// chequeo en JS es la protección anti-clickjacking que de verdad aplica.
if (window.top !== window.self) {
  window.top!.location.href = window.location.href;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
