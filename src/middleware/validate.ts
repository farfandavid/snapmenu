import { defineMiddleware } from "astro/middleware";

export const validate = defineMiddleware((context, next) => {
  console.log("In userValidators middleware");
  console.log(context.request.json());
  return next();
  //return userValidators(context, next);
});

