import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HomePage } from "./screens/HomePage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
);
