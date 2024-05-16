import type { IErrorUser } from "../types/Error";
import type { IUser } from "../types/User";

export const userValidators = (user: IUser) => {
    const errors: IErrorUser = {};

    if (typeof user.username !== "string") {
        errors.username = "Username Error";
    } else if (user.username.length < 3 || user.username.length > 20) {
        errors.username = "Username must be between 3 and 20 characters";
    }

    if (typeof user.email !== "string") {
        errors.email = "Email Error";
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            errors.email = "Invalid email format";
        }
    }

    if (typeof user.password !== "string") {
        errors.password = "Password Error";
    } else if (user.password.length < 8 || user.password.length > 20) {
        errors.password = "Password must be between 8 and 20 characters";
    } else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
        if (!passwordRegex.test(user.password)) {
            errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
    }

    if (Object.keys(errors).length > 0) {
        return new Response(JSON.stringify({ errors }), { status: 400 });
    }

    return new Response("User Created", { status: 201 });
}