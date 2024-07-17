import type { APIRoute } from "astro";
import { payment } from "../../../server/config/mp";
import type { IPayment } from "../../../server/interface/Payment";
import { Menu } from "../../../server/class/Menu";

export const POST: APIRoute = async ({ request, url }) => {
    const isWebhook = url.searchParams.get("source_news") === "webhooks";

    if (!isWebhook) {
        return new Response("not found", { status: 404 });
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
        console.log(paymentResult);
        if (paymentResult.status === "approved") {
            if (paymentResult.status_detail === "partially_refunded" || paymentResult.status_detail === "refunded") {
                console.log("Payment Refunded");
                if (paymentResult.metadata?.account_id) {
                    const menu = await Menu.getMenuByName(paymentResult.metadata.menu);
                    if (menu instanceof Menu) {
                        const expDate = menu.expDate;
                        const month = parseInt(paymentResult.additional_info?.items?.[0]?.id ?? "0");
                        expDate.setMonth(expDate.getMonth() - month);
                        menu.setExpDate(expDate);
                    }
                }
            }
            if (paymentResult.status_detail === "accredited") {
                console.log("Payment Approved");
                if (paymentResult.metadata?.account_id) {
                    const menu = await Menu.getMenuByName(paymentResult.metadata.menu);
                    if (menu instanceof Menu) {
                        const expDate = menu.expDate;
                        const month = parseInt(paymentResult.additional_info?.items?.[0]?.id ?? "0");
                        expDate.setMonth(expDate.getMonth() + month);
                        menu.setExpDate(expDate);
                    }
                }
            }
        }
        //console.log(paymentResult.date_created)
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
            }),
        }
    }
    return new Response("not found", { status: 404 });
}