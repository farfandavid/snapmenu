
import { defineMiddleware } from "astro/middleware";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "../utils/constant";
import { verifyAuth } from "../utils/verifyAuth";
import { getUserByEmail, registerUser, updateUser } from "../controller/userController";


export const onRequest = defineMiddleware(async (context, next) => {
    console.log("onRequest middleware");
    console.log(context.url.pathname);
    if (context.url.pathname === "/api/payment/webhook") {
        console.log("Webhook route: ", context.url.pathname);
        console.log("Host: ", context.url.hostname);
        console.log("Method: ", context.request.method);
        console.log("Referer: ", context.request.headers.get("Referer"));
        console.log("Referrer: ", context.request.referrer);
        console.log("Origin: ", context.url.origin);
        console.log(context.request.headers.forEach((value, key) => {
            console.log(key + ":" + value);
        }));
        /* if (context.request.method !== "POST") {
            return new Response("Method not allowed", { status: 405 });
        }
        if (context.request.headers.get("Content-Type") !== "application/json") {
            return new Response("Invalid content type", { status: 400 });
        }
        if (context.url.hostname !== "snapmenu.onrender.com") {
            return new Response("Invalid hostname", { status: 400 });
        } */
        return next();
    }
    if (PRIVATE_ROUTES.includes(context.url.pathname) || context.url.pathname.startsWith(PRIVATE_ROUTES[1])) {
        console.log("Private route: ", context.url.pathname);
        const user = await verifyAuth(context.cookies);
        if (!user) {
            return new Response("Unauthorized", { status: 401 });
        }
        if (user.emailVerified === false) {
            return context.redirect(PUBLIC_ROUTES.VERIFY_EMAIL);
        }
        const userDB = await getUserByEmail(user.email as string);
        if (!userDB) {
            await registerUser({
                displayName: user.displayName,
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                menuList: [],
                menuLimit: 0,
                disabled: user.disabled,
            });
        } else if (userDB && userDB.uid !== user.uid && userDB.emailVerified !== user.emailVerified) {
            await updateUser(user.email || "", {
                displayName: user.displayName,
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                menuList: [],
                menuLimit: 0,
                disabled: user.disabled,
            });
        }
        context.locals = { user: userDB };
        if (!context.locals.user) {
            console.log("User found", context.locals.user);
            return new Response("User found", { status: 200 });
        }
    }
    return next();
});

