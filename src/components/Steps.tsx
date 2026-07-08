import type { ReactNode } from "react";

export interface Step {
  title: string;
  body: ReactNode;
}

/** Étapes numérotées (protocole ponçage, process casse…). */
export default function Steps({ items }: { items: Step[] }) {
  return (
    <ul className="steps rv d1">
      {items.map((s) => (
        <li key={s.title}>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ul>
  );
}
