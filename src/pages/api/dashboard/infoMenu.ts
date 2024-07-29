import type { APIRoute } from "astro";
import { Menu } from "../../../server/class/Menu";
import { MenuError } from "../../../server/interface/Menu";

export const GET: APIRoute = async ({ locals }) => {
    try {
        const menus = await Menu.getMenusByUserId(locals.user.id || "");
        if (!menus) return new Response("No menus found", { status: 404 });
        return new Response(JSON.stringify(
            menus.map(({ _id, name, description, logoUrl, bannerUrl, mapUrl, address, city, country, postalCode, state, openingHours, phone, social }) => ({ _id, name, description, logoUrl, bannerUrl, mapUrl, address, city, country, postalCode, state, openingHours, phone, social }))
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
        const description = body.get("description") as string;
        const address = body.get("address") as string;
        const city = body.get("city") as string;
        const state = body.get("state") as string;
        const postalCode = body.get("postalCode") as string;
        const country = body.get("country") as string;
        const mapUrl = body.get("mapUrl") as string;
        const phone = body.get("phone") as string;
        const facebook = body.get("facebook") as string;
        const instagram = body.get("instagram") as string;
        const twitter = body.get("twitter") as string;

        const menu = await Menu.getMenuByIdAndUserId(menuId, locals.user.id || "");
        if (!menu) return new Response("Menu not found", { status: 404 });
        menu.description = description;
        menu.address = address;
        menu.mapUrl = mapUrl;
        menu.phone = phone;
        menu.social = { facebook, instagram, twitter };
        menu.city = city;
        menu.state = state;
        menu.postalCode = postalCode;
        menu.country = country;
        const validate = await menu.validate();
        if (validate instanceof MenuError) throw validate;
        const update = await menu.updateInfo();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        if (err instanceof MenuError) return new Response(JSON.stringify(err), { status: 400 });
        console.error(err);
        if (err instanceof Error) return new Response(err.message, { status: 500 });
        return new Response("Internal Server Error", { status: 500 });
    }
};