import type { APIRoute } from "astro";
import { Menu } from "../../../server/class/Menu";
import { MenuError } from "../../../server/interface/Menu";

export const GET: APIRoute = async ({ locals }) => {
    try {
        const menus = await Menu.getMenusByUserId(locals.user.id || "");
        if (!menus) return new Response("No menus found", { status: 404 });
        return new Response(JSON.stringify(
            menus.map(({ _id, name, description, logoUrl, bannerUrl, mapUrl, address, openingHours, phone, social }) => ({ _id, name, description, logoUrl, bannerUrl, mapUrl, address, openingHours, phone, social }))
        ), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (err) {
        console.error(err);
        return new Response("Internal Server Error", { status: 500 });
    }
};
