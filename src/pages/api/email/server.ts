import type { APIRoute } from "astro";
import { Resend } from "resend";
import { verifyRecaptcha } from "../../../utils/recaptcha";

export const POST: APIRoute = async ({ request }) => {
    // Get the form data
    const body = await request.formData().catch((err) => {
        console.error("Error parsing request body:", err);
        return null;
    });

    if (!body) return new Response("Invalid request!", { status: 400, headers: { "Content-Type": "application/json" } });

    // Verify the reCAPTCHA token
    if (!await verifyRecaptcha(body.get("g-recaptcha-response")?.toString() || "")) {
        console.error("Invalid reCAPTCHA token!");
        return new Response("Invalid reCAPTCHA token!", { status: 403 });
    }
    // Send the email
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
        from: "SnapMenu <onboarding@resend.dev>",
        to: ["farfetchdev@hotmail.com"],
        subject: "Contact Form Submission",
        text: `Name: ${body.get("name")?.toString() || ""}\nEmail: ${body.get("email")?.toString() || ""}\nMessage: ${body.get("message")?.toString() || ""}`,
    });
    if (error) {
        console.error("Error sending email:", error);
        return new Response("Failed to send email!", { status: 403, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
};