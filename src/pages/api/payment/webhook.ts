import type { APIRoute } from "astro";
import { payment } from "../../../config/mpconfig";

export const POST: APIRoute = async ({ request, url }) => {
    const isWebhook = url.searchParams.get("source_news") === "webhooks";
    if (!isWebhook) {
        console.log("Not a webhook");
        return new Response("webhook", { status: 200, headers: { 'content-type': 'application/json' } });
    }
    const res = await request.json();
    console.log("res", res);
    console.log("Search Params:");
    url.searchParams.forEach((value, key) => {
        console.log(key + ":" + value);
    });
    return new Response("webhook", { status: 200, headers: { 'content-type': 'application/json' } });
}