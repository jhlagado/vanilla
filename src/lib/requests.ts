export function isImage(request: Request): boolean {
  return request.method === "GET" && request.destination === "image";
}
