import type { APIRoute } from "astro";

export const GET: APIRoute = async (req) => {
    return new Response(JSON.stringify("test"));
};