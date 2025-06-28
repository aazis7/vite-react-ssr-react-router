import type { RouteObject } from "react-router";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/error-boundary.tsx";
import Home, { loader as homeLoader } from "./routes/home.tsx";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: App,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        index: true,
        loader: homeLoader,
        Component: Home,
      },
    ],
  },
]
