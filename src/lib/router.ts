export type RouteData = {
  handler: Handler;
  params: Params;
  url: string;
};

export type Handler = (
  request: Request,
  routeData: RouteData
) => HandlerResponse;

export type Matcher = (url: string) => RouteData | null;
export type HandlerResponse = Response | Promise<Response> | null;
export type RouteTable = { [pattern: string]: Handler };
export type Params = { [key: string]: string };

const optionalParam = /\((.*?)\)/g;
const namedParam = /(\(\?)?:\w+/g;
const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
const splatParam = /\*/g;

export const defineRoutes = (routes: RouteTable): Matcher => {
  const routeList = Object.entries(routes).map(([key, handler]) => {
    const namedParams: string[] = [];

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
        }, {} as Params);
        return {
          handler,
          params,
          url,
        };
      }
    }
    return null;
  };
};
