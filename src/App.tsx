import { Navbar } from "./components/navbar";
import { Outlet, ScrollRestoration } from "react-router";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col p-4">
        <header className="max-w-2xl mx-auto w-full flex items-center justify-between p-4 gap-x-2 md:gap-x-3">
          <Navbar />
        </header>
        <main className="flex-1 w-full max-w-2xl mx-auto p-4">
          <Outlet />
        </main>
        <ScrollRestoration />
      </div>
    </ThemeProvider>
  );
}
