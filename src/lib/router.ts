/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

export type RouteDef = {
  method: string;
  handler: Handler;
  regExp: RegExp;
  namedParams: string[];
};

export type RouteData = {
  handler: Handler;
  params: Params;
};

export type Handler = (request: Request, params: Params) => HandlerResponse;

export type Matcher = (url: string) => RouteData | null;
export type HandlerResponse = Response | Promise<Response> | null;
export type RouteTable = { [pattern: string]: Handler };
export type Params = { [key: string]: string };

const optionalParam = /\((.*?)\)/g;
const namedParam = /(\(\?)?:\w+/g;
const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
const splatParam = /\*/g;

export const routerApp = () => {
  const routeList: RouteDef[] = [];

  const defineRoute =
    (method: string) => (pattern: string, handler: Handler) => {
      const namedParams: string[] = [];

      const pattern1 = pattern
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
      const regExp = new RegExp("^" + pattern1 + "(?:\\?([\\s\\S]*))?$");
      routeList.push({
        method: method,
        handler,
        regExp,
        namedParams,
      });
    };

  const matchRoute = (methodName: string, url: string) => {
    for (const { method, handler, regExp, namedParams } of routeList) {
      if (methodName !== method) continue;
      const result = regExp.exec(url);
      if (!result) continue;
      const params = result.slice(1, -1).reduce(function (acc, val, index) {
        if (val) acc[namedParams[index]] = val;
        return acc;
      }, {} as Params);
      return {
        handler,
        params,
      };
    }
    return null;
  };

  self.addEventListener("fetch", (event: FetchEvent) => {
    const { request } = event;
    if (!request) return;
    let response: HandlerResponse = null;
    if (request.headers.get("Accept")?.includes("text/html")) {
      const { pathname } = new URL(request.url);
      const routeData = matchRoute(request.method, pathname);
      if (routeData) response = routeData.handler(request, routeData.params);
    }
    if (response) {
      event.respondWith(response);
    }
  });

  return {
    delete: defineRoute("DELETE"),
    get: defineRoute("GET"),
    patch: defineRoute("PATCH"),
    post: defineRoute("POST"),
    put: defineRoute("PUT"),
    matchRoute,
  };
};
