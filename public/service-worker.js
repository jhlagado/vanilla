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
    for (const { regExp, value, pattern } of routeList) {
      const result = regExp.exec(url);
      if (result) {
        const params = result.slice(1, -1).reduce(function (acc, val, index) {
          if (val) acc[route.namedParams[index]] = val;
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

self.addEventListener("fetch", (e) => {
  const matcher = createMatcher({
    "/": homePage,
    "/courses": courseListingPage,
    "/courses/:id": courseDetailPage,
    "/*": notFoundPage,
  });

  const request = e.request;
  console.log("Fetching...", request.url);
  let res = null;
  if (isImage(request)) {
    res = fetch("/broken.png");
  } else if (request.url === "http://localhost:5173/x.html") {
    res = new Response("xxx12345");
  } else {
    res = fetch(request);
  }
  e.respondWith(res);
});
