import type { APIRoute } from "astro";
import { payment } from "../../../config/mpconfig";
import type { IPayment } from "../../../types/Payment";

export const POST: APIRoute = async ({ request, url }) => {
    const isWebhook = url.searchParams.get("source_news") === "webhooks";

    if (!isWebhook) {
        console.log("Not a webhook");
        return new Response("", { status: 404 });
    }
    const res = await request.json();

    if (res.type === "payment") {
        const paymentResult = await payment.get({
            id: res.data.id,
            requestOptions: {
                corporationId: "SnapMenu",
                plataformId: "www.snapmenu.online",
            }

        });
        const paymentData: IPayment = {
            id_transaction: paymentResult.id,
            date_created: new Date(paymentResult.date_created || ""),
            date_approved: new Date(paymentResult.date_approved || ""),
            date_last_updated: new Date(paymentResult.date_last_updated || ""),
            status: paymentResult.status,
            status_detail: paymentResult.status_detail,
            payment_method: paymentResult.payment_method_id,
            currency_id: paymentResult.currency_id,
            transaction_amount: paymentResult.transaction_amount,
            transaction_amount_refunded: paymentResult.transaction_amount_refunded,
            payer: {
                _id: paymentResult.payer?.id || "",
                email: paymentResult.payer?.email || undefined,
                first_name: paymentResult.payer?.first_name,
                last_name: paymentResult.payer?.last_name,
                account_id: paymentResult.metadata?.account_id || undefined,
                menu_id: paymentResult.metadata?.menu_id || undefined,
            },
            items: paymentResult.additional_info?.items?.map((item: any) => {
                return {
                    _id: item.id,
                    title: item.title,
                    description: item.description,
                    category_id: item.category_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    currency_id: item.currency_id,

                }
            })
        }
        console.log(paymentData);
        /* console.log("Payment Result", paymentResult.metadata);
        console.log("Payment Result", paymentResult.additional_info?.items);
        console.log("Payment Status", paymentResult.status);
        console.log("Payment Status Detail", paymentResult.status_detail);
        console.log("payer", paymentResult.payer); */
    }
    return new Response("webhook", { status: 200, headers: { 'content-type': 'application/json' } });
}