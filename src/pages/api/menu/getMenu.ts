import type { APIRoute } from "astro";
import { getMenuByName } from "../../../controller/menuController";

export const GET: APIRoute = async ({ url }) => {
    const menuName = url.searchParams.get('menuName') || null as any;
    if (!menuName) {
        return new Response(JSON.stringify({ error: "No se ha proporcionado un nombre de menú" }), { status: 400 });
    }
    const menu = await getMenuByName(menuName);
    if (!menu) {
        return new Response(JSON.stringify({ error: "No se ha entontrado el menu" }), { status: 404, });
    }
    return new Response(JSON.stringify(menu), { status: 200, headers: { "Content-Type": "application/json" } });
}