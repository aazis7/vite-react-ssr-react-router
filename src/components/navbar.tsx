import { Link } from "react-router";

export function Navbar() {
  const navLinks = [
    {
      href: "https://github.com/aazis7/vite-react-ssr-react-router/",
      title: "Source",
    },
    {
      href: "https://github.com/aazis7/vite-react-ssr-react-router/blob/main/LICENSE",
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
          {navLinks.map(({ title, href }) => (
            <li key={title}>
              <a
                href={href}
                rel="noreferrer"
                target="_blank"
                className="text-foreground/95"
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
