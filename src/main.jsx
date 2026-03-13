import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ServiceProviderWrapper from "./context/serviceProviderWrapper.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ServiceProviderWrapper>
      <App />
    </ServiceProviderWrapper>
  </StrictMode>
);
