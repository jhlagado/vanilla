//@ts-check

/** @typedef {(url: string) => RouteData | null} Matcher */
/** @typedef {Response | Promise<Response> | null} HandlerResponse */
/** @typedef {Object} RouteTable */
/** @typedef {Object} Params */

/**
 * @typedef {(
*   request: Request,
*   routeData: RouteData
* ) => HandlerResponse} Handler
*/

/**
* @typedef {Object} RouteData
* @property {Handler} handler
* @property {Params} params
* @property {string} url
*/

const optionalParam = /\((.*?)\)/g;
const namedParam = /(\(\?)?:\w+/g;
const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
const splatParam = /\*/g;

/**
 * @param {string[]} [messages=[]]
 * @param {string} [content="no content"]
 * @returns {string}
 */
const layout = (messages = [], content = "no content") => `<!doctype html>
<html lang="">
<head>
    <title>Contact App</title>
    <link rel="stylesheet" href="https://the.missing.style/v0.2.0/missing.min.css">
    <link rel="stylesheet" href="/static/site.css">
    <script src="/static/js/htmx-1.8.0.js"></script>
    <script src="/static/js/_hyperscript-0.9.7.js"></script>
    <script src="/static/js/rsjs-menu.js" type="module"></script>
    <script defer src="https://unpkg.com/alpinejs@3/dist/cdn.min.js"></script>
</head>
<body hx-boost="true">
<main>
    <header>
        <h1>
            <all-caps>contacts.app</all-caps>
            <sub-title>A Demo Contacts Application</sub-title>
        </h1>
    </header>
    ${messages.map((message) => `<div class="flash">${message}}</div>`).join()}
    ${content}
</main>
</body>
</html>`;

/**
 * @param {RouteTable} routes
 * @returns {Matcher}
 */
const defineRoutes = (routes) => {
  const routeList = Object.entries(routes).map(([key, handler]) => {
    const namedParams = [];

    const pattern = key
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
      handler,
      regExp,
      namedParams,
    };
  });
  return (url) => {
    for (const { handler, regExp, namedParams } of routeList) {
      const result = regExp.exec(url);
      if (result) {
        const params = result.slice(1, -1).reduce(function (acc, val, index) {
          if (val) acc[namedParams[index]] = val;
          return acc;
        }, {});
        return {
          handler: handler,
          params,
          url,
        };
      }
    }
    return null;
  };
};

/** @type {any}  */
const sw = self;
sw.addEventListener("install", function (event) {
  console.log("Installing...");
  event.waitUntil(sw.skipWaiting());
  console.log("Install done");
});
sw.addEventListener("activate", function (event) {
  console.log("Activating...");
  event.waitUntil(sw.clients.claim());
  console.log("Activate done");
});
/**
 * @param {Request} request
 * @returns {boolean}
 */
function isImage(request) {
  return request.method === "GET" && request.destination === "image";
}
let matcher;
sw.addEventListener("fetch", (e) => {
  if (!matcher) {
    matcher = defineRoutes({
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
  }
  const { request } = e;
  if (!request) return;
  let response = null;
  if (request.headers.get("Accept")?.includes("text/html")) {
    const { pathname } = new URL(request.url);
    console.log("Fetching HTML ", request.method, pathname);
    const routeData = matcher(pathname);
    if (routeData) response = routeData.handler(request, routeData);
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
