const optionalParam = /\((.*?)\)/g;
const namedParam = /(\(\?)?:\w+/g;
const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
const splatParam = /\*/g;

const defineRoutes = (routes) => {
  const routeList = Object.entries(routes).map(([key, value]) => {
    const namedParams = [];
    pattern = key
      .replace(escapeRegExp, "\\$&")
      .replace(optionalParam, "(?:$1)?")
      .replace(namedParam, (match, optional) => {
        namedParams.push(match.slice(1));
        return optional ? match : "([^/?]+)";
      })
      .replace(splatParam, function () {
        namedParams.push("path");
        return "([^?]*?)";
      });
    const regExp = new RegExp("^" + pattern + "(?:\\?([\\s\\S]*))?$");
    return {
      value,
      regExp,
      namedParams,
      pattern: pattern,
    };
  });
  return (url) => {
    for (const { value, regExp, namedParams, pattern } of routeList) {
      const result = regExp.exec(url);
      if (result) {
        const params = result.slice(1, -1).reduce(function (acc, val, index) {
          if (val) acc[namedParams[index]] = val;
          return acc;
        }, {});
        return {
          value,
          params,
          url,
          pattern,
        };
      }
    }
    return null;
  };
};

self.addEventListener("install", function (event) {
  // Skip the 'waiting' lifecycle phase, to go directly from 'installed' to 'activated', even if
  // there are still previous incarnations of this service worker registration active.
  console.log("Installing...");
  event.waitUntil(self.skipWaiting());
  console.log("Install done");
});

self.addEventListener("activate", function (event) {
  // Claim any clients immediately, so that the page will be under SW control without reloading.
  console.log("Activating...");
  event.waitUntil(self.clients.claim());
  console.log("Activate done");
});

function isImage(fetchRequest) {
  return fetchRequest.method === "GET" && fetchRequest.destination === "image";
}

let matcher;
self.addEventListener("fetch", (e) => {
  if (!matcher) {
    matcher = defineRoutes({
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
  }
  const { request } = e;
  let response = null;
  if (request.headers.get("Accept").includes("text/html")) {
    const { pathname } = new URL(request.url);
    console.log("Fetching HTML ", request.method, pathname);
    const match = matcher(pathname);
    if (match) response = match.value(request, match);
  }

  if (isImage(request)) {
    response = fetch("/broken.png");
  }

  if (!response) {
    response = fetch(request);
  }

  e.respondWith(response);
});

// if (request.headers.get('Accept').includes('text/html')) {
// if (request.headers.get('Accept').includes('text/css') || request.headers.get('Accept').includes('text/javascript')) {
// if (request.headers.get('Accept').includes('image') || request.url.includes('your-web-font')) {
