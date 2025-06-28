import fs from "node:fs/promises";
import express from "express";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

// Create http server
const app = express();

// Disable default express options
app.disable("x-powered-by");

// Parse JSON bodies for API routes
app.use(express.json());

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Serve HTML
app.use("*all", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    /** @type {string} */
    let template;
    /** @type {any} */
    let entryServer;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      entryServer = await vite.ssrLoadModule("/src/entry-server.tsx");
    } else {
      template = templateHtml;
      entryServer = await import("./dist/server/entry-server.js");
    }

    // Create a proper Request object
    const request = new Request(
      `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      {
        method: req.method,
        headers: req.headers,
        body:
          req.method !== "GET" && req.method !== "HEAD"
            ? JSON.stringify(req.body)
            : undefined,
      },
    );

    const rendered = await entryServer.render(url, request);

    // Handle redirects
    if (rendered.redirect) {
      return res.redirect(rendered.statusCode || 302, rendered.redirect);
    }

    // Set response headers
    if (rendered.headers) {
      Object.entries(rendered.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
    }

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "");

    res
      .status(rendered.statusCode || 200)
      .set({ "Content-Type": "text/html" })
      .send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
