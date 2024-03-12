/// <reference lib="webworker" />

import { routerApp } from "./src/lib/router";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("install", () => {
  self.skipWaiting();

  console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  console.log("Service worker activated");
});

const app = routerApp();

const users = {
  1: "Jakub T. Jankiewicz",
  2: "John Doe",
  3: "Jane Doe",
};

// app.get("/", () => {
//   return Response.redirect("/contacts", 301);
// });

app.get("/contacts", (req) => {
  const { searchParams } = new URL(req.url);
  return new Response(
    "contacts 123 q:" + searchParams.get("q")
  );
});

app.post("/contacts", async (req) => {
  return new Response(
    JSON.stringify(Object.fromEntries((await req.formData()).entries()))
  );
});

app.get("/contacts/:id", (_req, params) => {
  const user = users[params.id];
  return new Response(
    JSON.stringify(user ? { result: user } : { error: "User Not Found" })
  );
});
