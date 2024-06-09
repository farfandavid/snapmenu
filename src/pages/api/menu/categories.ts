import type { APIRoute } from "astro";
import { getMenuById, getMenuByUserEmail, updateCategories } from "../../../controller/menuController";
import mongoose from 'mongoose';
import { getUserByEmail } from "../../../controller/userController";
import type { IUser } from "../../../types/User";

// UPDATE: Actualiza las categorías de un menú
export const PUT: APIRoute = async ({ request, locals }) => {
    const { menuId, categoriesData } = await request.json()
        .catch((err) => {
            console.error(err);
            return { menuId: null, categoriesData: null }
        });
    if (!menuId || !categoriesData) {
        return new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const menuUpdated = await updateCategories(locals.user.email || "", menuId, categoriesData);
    if (!menuUpdated) {
        return new Response(JSON.stringify({ error: "No se pudo actualizar el menú" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ categories: menuUpdated.categories, _id: menuUpdated._id }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export const POST: APIRoute = async ({ request, locals }) => {
    const user = await getUserByEmail(locals.user.email || "") as IUser;
    const { menuId } = await request.json()
        .catch((err) => {
            console.error(err);
            return { menuId: null }
        }
        );
    const menu = await getMenuById(menuId);
    console.log(menu);
    if (!menu) {
        return new Response(JSON.stringify({ error: "El menú no existe" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    /* const menuRes = menu.map(({ _id, name, categories }: { _id: any, name: string, categories: [] }) => ({ _id, name, categories })); */
    return new Response(JSON.stringify({ _id: menu._id, name: menu.name, categories: menu.categories }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export const GET: APIRoute = async ({ request, locals }) => {
    const user = await getUserByEmail(locals.user.email || "") as IUser;
    const menu = await getMenuByUserEmail(user.email || "");
    if (!menu) {
        return new Response(JSON.stringify
            ({ error: "No se encontraron menús" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    const menuRes = menu.map(({ _id, name, categories }: { _id: any, name: string, categories: [] }) => ({ _id, name, categories }));
    return new Response(JSON.stringify(menuRes), { status: 200, headers: { "Content-Type": "application/json" } });
}