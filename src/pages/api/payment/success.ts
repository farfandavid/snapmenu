import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
    console.log("payment success");
    return new Response("payment success", { status: 200, headers: { 'content-type': 'application/json' } });
};