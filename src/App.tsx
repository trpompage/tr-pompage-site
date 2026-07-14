import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BootContext } from "./context/BootContext";
import Preloader from "./components/Preloader";
import GooCursor from "./components/GooCursor";
import Header from "./components/Header";
import Gauge from "./components/Gauge";
import Footer from "./components/Footer";
import ScrollManager from "./components/ScrollManager";
import LiquidTransition from "./components/LiquidTransition";
import Home from "./pages/Home";
import Preparation from "./pages/Preparation";
import Poncage from "./pages/Poncage";
import Sinistres from "./pages/Sinistres";
import NotFound from "./pages/NotFound";

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <BootContext.Provider value={booted}>
      <Preloader onDone={() => setBooted(true)} />
      <GooCursor />
      <Header />
      <Gauge />
      <ScrollManager />
      <LiquidTransition />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preparation" element={<Preparation />} />
        <Route path="/poncage" element={<Poncage />} />
        <Route path="/sinistres" element={<Sinistres />} />
        {/* ancienne clé de la référence */}
        <Route path="/casse" element={<Navigate to="/sinistres" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BootContext.Provider>
  );
}
