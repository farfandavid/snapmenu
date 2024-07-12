import type { APIRoute } from "astro";
import { Menu } from "../../../server/class/Menu";

export const GET: APIRoute = async ({ request, locals }) => {
    try {
        const menus = await Menu.getMenusByUserEmail(locals.user.email || "");
        if (!menus) return new Response("No menus found", { status: 404 });
        console.log("menus:", menus);
        return new Response(JSON.stringify(
            menus.map(({ _id, name, categories }) => ({ _id, name, categories }))
        ), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        console.log(err);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export const PUT: APIRoute = async ({ request, locals }) => {
    return new Response("PUT", { status: 200 });
};