import type { APIRoute } from "astro";
import { Menu } from "../../../server/class/Menu";
import { MENU_NAMES_PROHIBITED } from "../../../server/utils/constants";

export const GET: APIRoute = async ({ params, redirect }) => {
    if (!params.name) {
        return redirect("/404")
    }
    const menu = await Menu.getMenuByName(params.name);
    if (MENU_NAMES_PROHIBITED.includes(params.name.toLowerCase())) {
        return new Response(JSON.stringify("not found"), { status: 404, headers: { 'content-type': 'application/json' } });
    }
    if (menu !== null) {
        return new Response(JSON.stringify("not found"), { status: 404, headers: { 'content-type': 'application/json' } });
    }
    return new Response(JSON.stringify("not found"), { status: 200, headers: { 'content-type': 'application/json' } });
}