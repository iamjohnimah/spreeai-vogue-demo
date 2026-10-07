import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./always-on/App.tsx";
import AssociateApp from "./always-on/associate/AssociateApp.tsx";
import './always-on/focus-polish.css';
import './always-on/ux-refinement.css';
const associate=/\/associate\/(in-store|vic)\/?$/.test(location.pathname);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={associate?"/spreeai-always-on-demo":import.meta.env.BASE_URL}>
        {associate?<AssociateApp/>:<App />}
    </BrowserRouter>
  </StrictMode>,
);

import '../../footer-layout.css';
import './always-on/mobile-standardization.css';
