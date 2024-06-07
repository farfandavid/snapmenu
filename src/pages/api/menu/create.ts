import type { APIRoute } from "astro";
import { createMenu } from "../../../controller/menuController";
import { getUserByEmail } from "../../../controller/userController";

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const user = await getUserByEmail(locals.user.email || "");
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { headers: { 'content-type': 'application/json' }, status: 404 });
        }
        if (user.menuList.length >= user.menuLimit) {
            return new Response(JSON.stringify({ error: "Menu limit exceeded" }), { headers: { 'content-type': 'application/json' }, status: 403 });
        }
        const { name, description } = await request.json();
        if (!name || !description) {
            return new Response(JSON.stringify({ error: "Name and description are required" }), { headers: { 'content-type': 'application/json' }, status: 400 });
        }
        const regexName = /^[a-zA-Z0-9]+$/;
        if (!regexName.test(name)) {
            return new Response(JSON.stringify({ error: "Name should be alphanumeric" }), { headers: { 'content-type': 'application/json' }, status: 400 });
        }
        const trimmedName = name.replace(/\s+/g, '');
        const menu = await createMenu({ name: trimmedName, description, userEmail: user.email || "", active: true })
        user.menuList.push(menu._id);
        await user.save();
        return new Response(JSON.stringify(menu), { status: 200, headers: { 'content-type': 'application/json' } });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { headers: { 'content-type': 'application/json' }, status: 500 });
    }
    //return new Response("Hello, world!", { status: 200 });
}

export const GET: APIRoute = async ({ request, locals }) => {
    console.log(locals);
    return new Response(JSON.stringify("health check"), { status: 200, headers: { 'content-type': 'application/json' } });
}