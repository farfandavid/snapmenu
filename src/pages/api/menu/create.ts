import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import mongoose from "mongoose";
import { createMenu } from "../../../controller/menuController";

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const auth = getAuth();
        if (cookies.has('session') === false) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers: { 'content-type': 'application/json' }, status: 401 });
        }
        const sessionCookie = cookies.get("session")?.value;
        const decodedCookie = await auth.verifySessionCookie(sessionCookie || "")
        const user = await auth.getUser(decodedCookie.uid);
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers: { 'content-type': 'application/json' }, status: 401 });
        }
        const { name, description } = await request.json();
        const menu = await createMenu({ name, description, user: user.uid, active: true });
        if (menu.errorCode === 11000) {
            return new Response(JSON.stringify({ error: 'Menu already exists' }), { headers: { 'content-type': 'application/json' }, status: 409 });
        }
        return new Response(JSON.stringify(menu), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { headers: { 'content-type': 'application/json' }, status: 500 });
    }
    //return new Response("Hello, world!", { status: 200 });
}

export const GET: APIRoute = async ({ request }) => {
    return new Response("Hello, world!", { status: 200 });
}