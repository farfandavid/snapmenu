import type { APIRoute } from "astro";
import menuModel from "../../../models/menuModel";
import { getAuth } from "firebase-admin/auth";
import db from "../../../db/db";
import mongoose from "mongoose";

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
        console.log(decodedCookie);
        const { name } = await request.json();
        db.connectDB();
        const menu = new menuModel({ _id: new mongoose.Types.ObjectId(), name, user: user.uid, description: "Menu description", active: true });
        menu.save();
        /* const auth = getAuth();
        if (cookies.has('session') === false) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { headers: { 'content-type': 'application/json' }, status: 401 });
        }
        const sessionCookie = cookies.get("session")?.value;
        const decodedCookie = await auth.verifySessionCookie(sessionCookie || "");
        const user = await auth.getUser(decodedCookie.uid);
        const { name, description } = await request.json();
        const menu = new menuModel({ name, description, active: true, user: user.uid });
        await menu.save();
        return new Response(JSON.stringify(menu), { headers: { 'content-type': 'application/json' }, status: 200 }); */
        return new Response(JSON.stringify(menu), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { headers: { 'content-type': 'application/json' }, status: 500 });
    }
    //return new Response("Hello, world!", { status: 200 });
}

export const GET: APIRoute = async ({ request }) => {
    return new Response("Hello, world!", { status: 200 });
}