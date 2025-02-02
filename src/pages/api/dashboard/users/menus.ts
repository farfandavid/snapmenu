import type { APIRoute } from "astro";
import { Menu } from "../../../../server/class/Menu";

export const GET: APIRoute = async ({ params, redirect, locals }) => {
    const menus = await Menu.getMenusByUserId(locals.user.id || "")
    if (!menus) return new Response("No menus found", { status: 404 });
    return new Response(JSON.stringify(
        menus.map(({ _id, name }) => ({ _id, name }))
    ), { status: 200, headers: { "Content-Type": "application/json" } });


}