import { defineMiddleware } from "astro/middleware";

export const auth = defineMiddleware((context, next) => {
  console.log("In auth middleware");
  console.log("In auth middleware for /api/users");
  return new Response("Unauthorized", { status: 401 });
});
