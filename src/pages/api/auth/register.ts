import type { APIRoute } from "astro";
import { getAuth, type AuthProviderConfig } from "firebase-admin/auth";
import { app } from "../../../firebase/server";
import { registerUser } from "../../../controller/userController";
import db from "../../../db/db";
import type { IUser } from "../../../types/User";

export const POST: APIRoute = async ({ request, redirect }) => {
    const auth = getAuth(app);

    /* Recaptcha */
    const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
    const requestHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    /* Obtener los datos del formulario */
    const formData = await request.json();

    const requestBody = new URLSearchParams({
        secret: import.meta.env.RECAPTCHA_SECRET_KEY,   // This can be an environment variable
        response: formData.token          // The token passed in from the client
    });

    const response = await fetch(recaptchaURL, {
        method: "POST",
        headers: requestHeaders,
        body: requestBody.toString()
    });

    const responseData = await response.json();
    if (!responseData.success) {
        return new Response(
            "Recaptcha error",
            { status: 400 }
        );
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
    return redirect("/login");
};