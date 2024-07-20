import type { APIRoute } from "astro";
import { Menu } from "../../../server/class/Menu";
import { MenuError } from "../../../server/interface/Menu";

export const GET: APIRoute = async ({ locals }) => {
    try {
        const menus = await Menu.getMenusByUserId(locals.user.id || "");
        if (!menus) return new Response("No menus found", { status: 404 });
        return new Response(JSON.stringify(
            menus.map(({ _id, name, openingHours }) => ({ _id, name, openingHours }))
        ), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        console.error(err);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export const PUT: APIRoute = async ({ request, locals }) => {
    try {
        const body = await request.formData().catch(() => { throw new Error("Invalid form data") });
        const menuId = body.get("menu") as string;
        const openingHours = JSON.parse(body.get("openingHours") as string);
        console.log(openingHours);
        const menu = await Menu.getMenuByIdAndUserId(menuId, locals.user.id || "");
        if (!menu) return new Response("Menu not found", { status: 404 });
        const validate = await menu.validate();
        if (validate instanceof MenuError) throw validate;
        const update = await menu.updateOpeningHours(openingHours);
        if (!update) return new Response("Error updating menu", { status: 500 });

        /* 
        
        menu.openingHours = openingHours;
        const update = await menu.updateInfo(); */

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response("Internal Server Error", { status: 500 });
    }
}