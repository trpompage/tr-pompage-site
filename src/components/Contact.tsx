import { Cta, Ghost } from "./Buttons";

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <span className="kicker rv">06 — ON COULE QUAND ?</span>
      <h2 className="rv d1">
        Envoyez vos <em>m²</em>.
        <br />
        On envoie le tuyau.
      </h2>
      <div className="row rv d2">
        <Cta href="tel:+33600000000">📞 06 00 00 00 00</Cta>
        <Ghost href="mailto:contact@trpompage.fr">contact@trpompage.fr</Ghost>
        <Ghost>DEVIS SOUS 48H — SUR PLAN</Ghost>
      </div>
    </section>
  );
}
