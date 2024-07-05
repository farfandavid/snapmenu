
import { defineMiddleware } from "astro/middleware";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "../utils/constant";
import { verifyAuth } from "../utils/verifyAuth";
import { getUserByEmail, registerUser, updateUser } from "../controller/userController";
import cryp from "crypto";


export const onRequest = defineMiddleware(async (context, next,) => {
    console.log(context.url.pathname);
    if (context.url.pathname === "/api/payment/webhook" && context.request.method === "POST" && context.request.headers.get("Referer") === "https://mercadopago.com.ar") {
        const parts = context.request.headers.get("x-signature")?.split(",");
        const xRequestId = context.request.headers.get("x-request-id") || "";
        const dataID = context.url.searchParams.get("data.id");
        let ts = "";
        let hash = "";
        parts?.forEach(part => {
            // Split each part into key and value
            const [key, value] = part.split('=');
            if (key && value) {
                const trimmedKey = key.trim();
                const trimmedValue = value.trim();
                if (trimmedKey === 'ts') {
                    ts = trimmedValue;
                } else if (trimmedKey === 'v1') {
                    hash = trimmedValue;
                }
            }
        });
        const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
        console.log("Manifest: ", manifest);
        const hmac = cryp.createHmac('sha256', import.meta.env.MP_TEST_WEBHOOK);
        hmac.update(manifest);
        const sha = hmac.digest('hex');
        if (sha === hash) {
            // HMAC verification passed
            console.log("HMAC verification passed");
        } else {
            // HMAC verification failed
            console.log("HMAC verification failed");
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

