import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import { routes } from "./routes";

const { query, dataRoutes } = createStaticHandler(routes);

// Original render function (your existing implementation)
export async function render(_url: string, request: Request) {
  try {
    // Run actions/loaders to get the routing context
    const context = await query(request);

    // If query returns a Response, it's probably a redirect
    if (context instanceof Response) {
      return {
        html: "",
        head: "",
        statusCode: context.status,
        headers: Object.fromEntries(context.headers.entries()),
        redirect: context.headers.get("location"),
      };
    }

    // Create a static router for SSR
    const router = createStaticRouter(dataRoutes, context);

    // Render everything with StaticRouterProvider
    const html = renderToString(
      <StaticRouterProvider router={router} context={context} />,
    );

    // Setup headers from actions and loaders from deepest match
    const leaf = context.matches[context.matches.length - 1];
    const actionHeaders = context.actionHeaders[leaf?.route.id];
    const loaderHeaders = context.loaderHeaders[leaf?.route.id];

    const headers: Record<string, string> = {};

    if (actionHeaders) {
      for (const [key, value] of actionHeaders.entries()) {
        headers[key] = value;
      }
    }

    if (loaderHeaders) {
      for (const [key, value] of loaderHeaders.entries()) {
        headers[key] = value;
      }
    }

    // Embed hydration data
    const hydrationScript = `
      <script>
        window.__staticRouterHydrationData = ${JSON.stringify(context).replace(
          /</g,
          "\\u003c",
        )};
      </script>
    `;

    return {
      html,
      head: hydrationScript,
      statusCode: context.statusCode || 200,
      headers,
    };
  } catch (error) {
    console.error("SSR Error:", error);
    return {
      html: "<div>Internal Server Error</div>",
      head: "",
      statusCode: 500,
      headers: {},
    };
  }
}
