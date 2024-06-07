import type { APIRoute } from "astro";
import { PUBLIC_ROUTES } from "../../../utils/constant";

export const GET: APIRoute = async ({ redirect, cookies }) => {
    cookies.delete("session", {
        path: "/",
    });
    return redirect(PUBLIC_ROUTES.SIGN_IN);
};