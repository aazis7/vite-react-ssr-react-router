import "./globals.css";
import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "./routes";

// Create browser router with hydration data
const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

// hydrate the root with startTransition callback
hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <RouterProvider router={router} />,
);

// some type stuff
declare global {
  interface Window {
    __staticRouterHydrationData: any;
  }
}
