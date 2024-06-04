
import type { AstroCookies } from "astro";
import { app } from "../firebase/server";
import { getAuth } from "firebase-admin/auth";


export const verifyAuth = async (cookies: AstroCookies) => {
    if (!cookies.has('session')) {
        return null;
    }
    const auth = getAuth(app);
    const sessionCookie = cookies.get('session')?.value;
    try {
        const decodedCookie = await auth.verifySessionCookie(sessionCookie || "", true)
        const user = await auth.getUser(decodedCookie.uid)
        if (user) {
            return user;
        }
    } catch (e) {
        return null;
    }
};