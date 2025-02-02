import type { APIRoute } from "astro";
import { Menu } from "../../../../../server/class/Menu";

export const GET: APIRoute = async ({ params, redirect, locals }) => {
    const { menuId } = params;
    if (!menuId) return new Response("Not found", { status: 404 });
    const menu = await Menu.getMenuByIdAndUserId(menuId, locals.user.id || "", { categories: 1 });
    if (!menu) return new Response("Not menu found", { status: 404 });
    const { categories } = menu;
    return new Response(JSON.stringify(categories), { status: 200, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ params, request, redirect, locals }) => {
    const { menuId } = params;

    if (!menuId) return new Response("No found", { status: 404 });
    const menu = await Menu.getMenuByIdAndUserId(menuId, locals.user.id || "");
    if (!menu) return new Response("No menu found", { status: 404 });

    return new Response("Not implemented", { status: 501 });
}