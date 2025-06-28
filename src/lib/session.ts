import { createCookieSessionStorage } from "react-router";

type Theme = "dark" | "light" | "system";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: false, // Allow client-side access for theme switching
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "s3cr3t"],
    secure: process.env.NODE_ENV === "production",
  },
});

export { sessionStorage };

export async function getThemeSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  return session;
}

export async function getTheme(request: Request): Promise<Theme> {
  const session = await getThemeSession(request);
  const theme = session.get("theme") as Theme;
  return theme || "system";
}

export async function setTheme(request: Request, theme: Theme) {
  const session = await getThemeSession(request);
  session.set("theme", theme);

  return {
    "Set-Cookie": await sessionStorage.commitSession(session),
  };
}
