import type { APIRoute } from "astro";
import { refund } from "../../server/config/mp";

export const POST: APIRoute = async ({ request }) => {
    const res = await request.json();
    const result = await refund.create({
        payment_id: res.payment_id,
        body: {
            amount: parseInt(res.amount),
        }
    }).then((res) => {
        return res;
    }).catch((err) => {
        console.error(err)
        return
    });

    return new Response(JSON.stringify("test"));
};