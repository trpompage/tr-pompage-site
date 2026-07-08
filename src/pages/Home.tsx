import { useRef } from "react";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Principe from "../components/Principe";
import Metiers from "../components/Metiers";
import Chiffres from "../components/Chiffres";
import Clients from "../components/Clients";
import CarteChantiers from "../components/CarteChantiers";
import Contact from "../components/Contact";
import { useReveals } from "../hooks/useReveals";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Home() {
  const ref = useRef<HTMLElement>(null);
  useReveals(ref);
  usePageTitle("TR POMPAGE — Chape fluide : pompage, préparation, ponçage, sinistres");

  return (
    <main ref={ref}>
      <Hero />
      <Marquee />
      <Principe />
      <Metiers />
      <Chiffres />
      <Clients />
      <CarteChantiers />
      <Contact />
    </main>
  );
}
