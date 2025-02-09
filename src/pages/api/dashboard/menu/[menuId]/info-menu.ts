import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ }) => {
    return new Response("Not implemented", { status: 501 });
}