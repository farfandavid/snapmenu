import type { APIRoute } from "astro";
import { payment } from "../../../config/mpconfig";

export const POST: APIRoute = async ({ request, url }) => {
    const id = url.searchParams.get("id");
    console.log("id:", id);
    const res = await request.json();
    console.log("json:", res);
    console.log("searchParams:", id);
    url.searchParams.forEach((value, key) => {
        console.log(key + ":" + value);
    });
    if (!res) {
        console.log("webhook error !res");
        return new Response("webhook", { status: 200, headers: { 'content-type': 'application/json' } });
    }
    if (res.topic === "payment") {

        const paymentData = await payment.get({
            id: id || "",
        });
        console.log("paymentData", paymentData);
    }


    return new Response("webhook", { status: 200, headers: { 'content-type': 'application/json' } });
}