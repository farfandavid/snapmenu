import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../server/config/firebaseServer";
import { PUBLIC_ROUTES } from "../../../utils/constant";
import { verifyRecaptcha } from "../../../utils/recaptcha";
import { Resend } from "resend";
import { User } from "../../../server/class/User";

export const POST: APIRoute = async ({ request, redirect }) => {
    const auth = getAuth(app);
    /* Obtener los datos del formulario */
    const formData = await request.json().catch((err) => {
        console.error("Error al analizar el cuerpo de la solicitud:", err);
        return null;
    });
    if (!formData) return new Response("Solicitud inválida", { status: 400 });

    // Verificar el token reCAPTCHA
    if (!await verifyRecaptcha(formData.token || "")) {
        console.error("Token reCAPTCHA inválido!");
        return new Response("Token reCAPTCHA inválido!", { status: 403 });
    }

    const email = formData.email;
    const password = formData.password;
    const name = formData.name;

    if (!email || !password || !name) {
        return new Response(
            "Faltan datos del formulario",
            { status: 400 }
        );
    }

    /* Crear un usuario */
    try {
        const user = await auth.createUser({
            email,
            password,
            displayName: name,
            disabled: false,
            emailVerified: false,
        })/* .then((user) => {
            registerUser({
                displayName: user.displayName, email: user.email, uid: user.uid,
                menuList: [],
                menuLimit: 0,
                emailVerified: user.emailVerified,
                disabled: user.disabled
            })
        }) */
        const registerUser = await new User({
            displayName: user.displayName,
            email: user.email || "",
            uid: user.uid,
            menuList: [],
            menuLimit: 0,
            emailVerified: user.emailVerified,
            disabled: user.disabled
        }).save();

        const link = await auth.generateEmailVerificationLink(registerUser.email).then((link) => {
            return link
        });

        const resend = new Resend(import.meta.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
            from: "SnapMenu <verify@snapmenu.online>",
            to: [email],
            subject: "Verifica tu correo electrónico",
            text: `Si no has solicitado la verificación de tu correo electrónico, ignora este mensaje. Para verificar tu correo electrónico, haz clic en el siguiente enlace: ${link}`,
        })
        if (error) {
            console.error("Error al enviar el correo electrónico:", error);
            return new Response("Error al enviar el correo de verificacion", { status: 403 });
        }
    } catch (error: any) {
        console.error("Error al crear el usuario: ", error);
        return new Response(
            "Algo salió mal",
            { status: 400 }
        );
    }
    return redirect(PUBLIC_ROUTES.SIGN_IN);
};