import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, params, url }) => {
    console.log("key, values:")
    url.searchParams.forEach((value, key) => {
        console.log(key, value);
    });
    const res = await request.json();
    console.log("body", res);
    return new Response("webhook", { status: 200, headers: { 'content-type': 'application/json' } });
}