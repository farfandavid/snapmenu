
import { defineMiddleware } from "astro/middleware";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "../utils/constant";
import { verifyAuth } from "../utils/verifyAuth";
import { getUserByEmail, registerUser, updateUser } from "../controller/userController";


export const onRequest = defineMiddleware(async (context, next,) => {
    console.log(context.url.pathname);
    if (context.url.pathname === "/api/payment/webhook" && context.request.method === "POST") {
        if (context.request.headers.get("Referer") === "https://mercadopago.com.ar") {
            console.log("Headers:");
            context.request.headers.forEach((value, key) => {
                console.log(key + ":" + value);
            });
            return next();
        } else {
            return new Response("not found", { status: 404 });
        }
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

