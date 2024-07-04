import type { APIRoute } from "astro";
import { payment, preference } from "../../../config/mpconfig";

export const POST: APIRoute = async ({ request, url }) => {
    const isWebhook = url.searchParams.get("source_news") === "webhooks";
    console.log(url.host, url.hostname, url.protocol)
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

    if (res.type === "payment") {
        const paymentResult = await payment.get({
            id: res.data.id,
            requestOptions: {
                corporationId: "SnapMenu",
                plataformId: "www.snapmenu.online",
            }

        });
        console.log("Payment Result", paymentResult.additional_info?.items);
        console.log("Payment Status", paymentResult.status);
        console.log("Payment Status Detail", paymentResult.status_detail);
        console.log("payer", paymentResult.additional_info?.items);
    }
    return new Response("webhook", { status: 200, headers: { 'content-type': 'application/json' } });
}