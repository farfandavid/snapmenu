import type { APIRoute } from "astro";
import { refund } from "../../server/config/mp";

export const POST: APIRoute = async ({ request }) => {
    const res = await request.json();
    console.log(res)
    const result = await refund.create({
        payment_id: res.payment_id,
        body: {
            amount: parseInt(res.amount),
        }
    }).then((res) => {
        console.log(res)
        return res;
    }).catch((err) => {
        console.error(err)
        return
    });

    console.log(result)
    return new Response(JSON.stringify("test"));
};