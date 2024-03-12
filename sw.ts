/// <reference lib="webworker" />

import { isImage } from "./src/lib/requests";
import { HandlerResponse } from "./src/lib/router";
import { routeMatcher } from "./src/service/routes";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("install", () => {
  self.skipWaiting();
  console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
  console.log("Service worker activated");
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (!request) return;
  let response: HandlerResponse = null;
  if (request.headers.get("Accept")?.includes("text/html")) {
    const { pathname } = new URL(request.url);
    console.log("Fetching HTML ", request.method, pathname);
    const routeData = routeMatcher(pathname);
    if (routeData) response = routeData.handler(request, routeData);
  }
  if (isImage(request)) {
    response = fetch("/broken.png");
  }
  if (response) {
    event.respondWith(response);
  }
});
