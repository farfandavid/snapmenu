import type { APIRoute } from "astro";
import { Menu } from "../../../server/class/Menu";
import { MenuError } from "../../../server/interface/Menu";

export const GET: APIRoute = async ({ locals }) => {
    try {
        const menus = await Menu.getMenusByUserEmail(locals.user.email || "");
        if (!menus) return new Response("No menus found", { status: 404 });
        return new Response(JSON.stringify(
            menus.map(({ _id, name, categories }) => ({ _id, name, categories }))
        ), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        console.error(err);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export const PUT: APIRoute = async ({ request, locals }) => {
    const { menuId, categoriesData } = await request.json().catch(() => ({}));
    if (!menuId || !categoriesData) return new Response("Invalid data", { status: 400 });
    const menu = await Menu.getMenuByIdAndUserEmail(menuId, locals.user.email || "");
    if (!menu) return new Response("Menu not found", { status: 404 });
    try {
        const updated = await menu.updateCategories(categoriesData);
        return new Response(JSON.stringify(updated), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        console.error(err);
        if (err instanceof MenuError) {
            return new Response(JSON.stringify(err), { status: 400, headers: { "Content-Type": "application/json" } });
        }
        return new Response("Internal Server Error", { status: 500 });
    }
};