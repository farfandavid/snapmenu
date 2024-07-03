import type { APIRoute } from "astro";
import { payment } from "../../../config/mpconfig";

export const POST: APIRoute = async ({ request, url }) => {
    const id = url.searchParams.get("id");
    const res = await request.json();
    console.log("body", res);
    const paymentData = await payment.get({
        id: id || "",
    });
    console.log("paymentData", paymentData);
    return new Response("webhook", { status: 200, headers: { 'content-type': 'application/json' } });
}