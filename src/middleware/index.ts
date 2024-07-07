
import { defineMiddleware } from "astro/middleware";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "../utils/constant";
import { verifyAuth } from "../utils/verifyAuth";
import { getUserByEmail, registerUser, updateUser } from "../controller/userController";
import { verifyMPWebhook } from "../utils/mercadopagoValidator.ts"

export const onRequest = defineMiddleware(async (context, next,) => {
    /* console.log(context.url.pathname);
    // Verify MercadoPago Webhook
    if (context.url.pathname === "/api/payment/webhook" && context.request.method === "POST" && context.request.headers.get("Referer") === "https://mercadopago.com.ar") {
        const dataID = context.url.searchParams.get("data.id");
        if (verifyMPWebhook(context.request.headers, dataID || "")) {
            console.log("Webhook verified");
            return next();
        } else {
            console.log("Webhook not verified");
            return new Response("Unauthorized", { status: 401 });
        }
    }
    // Verify private routes
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
    return next(); */
});

