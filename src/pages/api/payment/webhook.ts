import type { APIRoute } from "astro";
import { payment, preference } from "../../../config/mpconfig";

export const POST: APIRoute = async ({ request, url }) => {
    const isWebhook = url.searchParams.get("source_news") === "webhooks";

    if (!isWebhook) {
        console.log("Not a webhook");
        return new Response("", { status: 404 });
    }
    const res = await request.json();
    /* console.log("res", res); */
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
        /* console.log("Payment Result", paymentResult.metadata);
        console.log("Payment Result", paymentResult.additional_info?.items);
        console.log("Payment Status", paymentResult.status);
        console.log("Payment Status Detail", paymentResult.status_detail);
        console.log("payer", paymentResult.payer); */
    }
    return new Response("webhook", { status: 200, headers: { 'content-type': 'application/json' } });
}