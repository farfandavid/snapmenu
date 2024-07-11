
import { defineMiddleware } from "astro/middleware";
import { PRIVATE_ROUTES } from "../server/utils/constants";
import { verifyAuth } from "../utils/verifyAuth";
import { User } from "../server/class/User";

export const onRequest = defineMiddleware(async (context, next,) => {
    if (import.meta.env.SSR) {
        console.log(context.clientAddress + ";" + context.url.pathname);
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
                console.log("Registering new user")
                const newUser = new User({
                    displayName: user.displayName,
                    uid: user.uid,
                    email: user.email || "",
                    emailVerified: user.emailVerified,
                    menuList: [],
                    menuLimit: 0,
                });
                await newUser.save();
                context.locals = {
                    user: {
                        id: newUser._id?.toString(),
                        displayName: newUser.displayName,
                        uid: newUser.uid,
                        email: newUser.email,
                        emailVerified: newUser.emailVerified,
                        menuLimit: newUser.menuLimit,
                        disabled: newUser.disabled
                    }
                };
                return next();
            }
            if (userDB?.uid !== user.uid || userDB?.emailVerified !== user.emailVerified) {
                console.log("Updating user")
                const newUser = new User({
                    _id: userDB._id,
                    displayName: user.displayName,
                    uid: user.uid,
                    email: user.email || "",
                    emailVerified: user.emailVerified,
                    menuList: userDB?.menuList || [],
                    menuLimit: userDB?.menuLimit || 0,
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
                        menuLimit: updated.menuLimit,
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
                    menuLimit: userDB.menuLimit,
                    disabled: userDB.disabled
                }
            };
            console.log(context.locals.user);
            return next();
        } catch (err) {
            console.error(err);
            return new Response("Internal Server Error", { status: 500 });
        }
    }
    return next();
});

