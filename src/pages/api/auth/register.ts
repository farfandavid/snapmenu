import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";
import { registerUser } from "../../../controller/userController";
import { PUBLIC_ROUTES } from "../../../utils/constant";
import { verifyRecaptcha } from "../../../utils/recaptcha";

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
        await auth.createUser({
            email,
            password,
            displayName: name,
            disabled: true,
            emailVerified: false,
        }).then((user) => {
            registerUser({
                displayName: user.displayName, email: user.email, uid: user.uid,
                menuList: [],
                menuLimit: 0
            })
        });

    } catch (error: any) {
        console.error("Error al crear el usuario: ", error);
        return new Response(
            "Algo salió mal",
            { status: 400 }
        );
    }
    return redirect(PUBLIC_ROUTES.SIGN_IN);
};