import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "POMPAGE" },
  { to: "/preparation", label: "PRÉPARATION" },
  { to: "/poncage", label: "PONÇAGE" },
  { to: "/sinistres", label: "SINISTRES" },
];

export default function Header() {
  return (
    <header>
      <Link className="logo" to="/">
        TR<span>·</span>POMPAGE
      </Link>
      <nav aria-label="Navigation principale">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => (isActive ? "on" : "")}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <a className="tel" href="tel:+33600000000">
        06 00 00 00 00
      </a>
    </header>
  );
}
