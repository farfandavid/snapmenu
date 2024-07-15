import type { APIRoute } from "astro";
import { refund } from "../../server/config/mp";

export const GET: APIRoute = async ({ request }) => {
    const { paymentId, amount } = await request.json();
    const result = await refund.create({
        payment_id: paymentId,
        body: {
            amount: parseInt(amount),
        }
    })

    console.log(result)
    return new Response(JSON.stringify("test"));
};