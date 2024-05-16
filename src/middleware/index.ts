import { defineMiddleware, sequence } from "astro/middleware";

import { auth } from "./auth";
import { validate } from "./validate";

export const onRequest = defineMiddleware(async (context, next) => {

    if (context.url.pathname === '/api/users' && context.request.method === 'POST') {
        console.log("In onRequest middleware for POST /api/users");
        return next();
    }
    //return sequence(auth, validate)(context, next);

    return next();
});
