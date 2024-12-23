
import { defineMiddleware } from "astro/middleware";
import { PRIVATE_ROUTES } from "../server/utils/constants";
import { verifyAuth } from "../utils/verifyAuth";
import { User } from "../server/class/User";
import { verifyMPWebhook } from "../utils/mercadopagoValidator";

export const onRequest = defineMiddleware(async (context, next,) => {
    if (import.meta.env.SSR) {
        console.log(context.clientAddress + ";" + context.url.pathname);
    }
    if (context.url.pathname === "/api/payment/webhook" && context.request.method === "POST" && context.request.headers.get("Referer") === "https://mercadopago.com.ar") {
        const dataID = context.url.searchParams.get("data.id");
        if (verifyMPWebhook(context.request.headers, dataID || "")) {
            return next();
        } else {
            console.log("Webhook not verified");
            return new Response("Unauthorized", { status: 401 });
        }
    }
    const isPrivateRoute = PRIVATE_ROUTES.some(route => context.url.pathname.startsWith(route));
    if (isPrivateRoute) {

        const user = await verifyAuth(context.cookies);
        if (!user) {
            return new Response("Unauthorized", { status: 401 });
        }
        if (user.emailVerified === false) {
            return context.redirect("/verify-email");
        }
        try {
            const userDB = await User.getUserByEmail(user.email as string);
            if (!userDB) {
                const newUser = new User({
                    displayName: user.displayName,
                    uid: user.uid,
                    email: user.email || "",
                    emailVerified: user.emailVerified,
                    disabled: user.disabled
                });
                await newUser.save();
                context.locals = {
                    user: {
                        id: newUser._id?.toString(),
                        displayName: newUser.displayName,
                        uid: newUser.uid,
                        email: newUser.email,
                        emailVerified: newUser.emailVerified,
                        disabled: newUser.disabled
                    }
                };
                return next();
            }
            if (userDB?.uid !== user.uid || userDB?.emailVerified !== user.emailVerified) {
                const newUser = new User({
                    _id: userDB._id,
                    displayName: user.displayName,
                    uid: user.uid,
                    email: user.email || "",
                    emailVerified: user.emailVerified,
                    disabled: user.disabled,
                });
                const updated = await newUser.update();
                if (!(updated instanceof User)) {
                    return new Response("Internal Server Error", { status: 500 });
                }

                context.locals = {
                    user: {
                        id: updated._id?.toString(),
                        displayName: updated.displayName,
                        uid: updated.uid,
                        email: updated.email,
                        emailVerified: updated.emailVerified,
                        disabled: updated.disabled
                    }
                };
                return next();
            }
            context.locals = {
                user: {
                    id: userDB._id?.toString(),
                    displayName: userDB.displayName,
                    uid: userDB.uid,
                    email: userDB.email,
                    emailVerified: userDB.emailVerified,
                    disabled: userDB.disabled
                }
            };
            return next();
        } catch (err) {
            console.error(err);
            return new Response("Internal Server Error", { status: 500 });
        }
    }
    return next();
});

