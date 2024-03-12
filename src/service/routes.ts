import { defineRoutes } from "../lib/router";
import { layout } from "./layout";

export const routeMatcher = defineRoutes({
    "/x": () => {
      return new Response(layout(["message 1"], "body content x"));
    },
    "/contacts": async (request, { params, url }) => {
      const body =
        request.method === "POST"
          ? Object.fromEntries((await request.formData()).entries())
          : "<none>";
      return new Response(
        `list ${request.method} ${JSON.stringify(
          params
        )}, ${url} ${JSON.stringify(body)}`
      );
    },
    "/contacts/:id": (request, { params, url }) =>
      new Response(
        `item ${request.method} ${JSON.stringify(params)}, ${url}`
      ),
    "/*": () => null,
  });
