import { Link, NavLink } from "react-router";

export function Navbar() {
  const navLinks = [
    {
      to: "/",
      title: "Source",
    },
    {
      to: "/todos",
      title: "License",
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-3">
        <Link to="/" className="text-lg tracking-tight scroll-m-20 font-bold">
          <img
            src="/vite.svg"
            alt="vite-logo"
            loading="lazy"
            className="drop-shadow-xl drop-shadow-indigo-500/50"
          />
        </Link>
      </div>
      <nav className="flex gap-3 items-center">
        <ul className="flex gap-3 items-center">
          {navLinks.map(({ title, to }) => (
            <li key={title}>
              <NavLink to={to} className="text-foreground/95">
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
