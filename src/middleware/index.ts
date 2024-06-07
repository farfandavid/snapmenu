
import { defineMiddleware } from "astro/middleware";
import { PRIVATE_ROUTES } from "../utils/constant";
import { verifyAuth } from "../utils/verifyAuth";
import { getUserByEmail, registerUser, updateUser } from "../controller/userController";


export const onRequest = defineMiddleware(async (context, next) => {
    console.log("onRequest middleware");
    if (PRIVATE_ROUTES.includes(context.url.pathname) || context.url.pathname.startsWith(PRIVATE_ROUTES[1])) {
        console.log("Private route");
        const user = await verifyAuth(context.cookies);
        if (!user) {
            return new Response("Unauthorized", { status: 401 });
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
        } else if (userDB && userDB.uid !== user.uid) {
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
    }
    return next();
});


