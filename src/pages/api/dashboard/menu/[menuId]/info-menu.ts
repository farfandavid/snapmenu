import type { APIRoute } from "astro";
import { Menu } from "../../../../../server/class/Menu";
import { MenuError } from "../../../../../server/interface/Menu";
import { ERROR_MESSAGES } from "../../../../../server/utils/constants";

export const GET: APIRoute = async ({ params }) => {
    try {
        const { menuId } = params;
        if (!menuId) return new Response("Not found", { status: 404 });
        const menu = await Menu.getMenuById(menuId, {
            _id: 1,
            active: 1,
            address: 1,
            bannerUrl: 1,
            logoUrl: 1,
            city: 1,
            country: 1,
            name: 1,
            phone: 1,
            description: 1,
            map: 1,
            postalCode: 1,
            social: 1,
            state: 1,

        });
        return new Response(JSON.stringify(menu), { status: 200, headers: { 'content-type': 'application/json' } });
    } catch (error) {
        if (error instanceof MenuError) return new Response(JSON.stringify(error), { status: 400 });
        return new Response(ERROR_MESSAGES[500], { status: 500 });
    }
}