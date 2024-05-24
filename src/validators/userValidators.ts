
import type { IErrorUser } from "../types/Error";
import type { IUser } from "../types/User";

export const userValidators = (user: IUser) => {
    //const { request } = context;
    const errors: IErrorUser = {};
    validateUsername(user.displayName) != null ? errors.username = validateUsername(user.displayName) : null;
    validateEmail(user.email) != null ? errors.email = validateEmail(user.email) : null;
    validatePassword(user.password) != null ? errors.password = validatePassword(user.password) : null;

    /* if (typeof user.username !== "string") {
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
    } */

    if (Object.keys(errors).length > 0) {
        return { errors: errors };
    }
    return null;
}

export const validatePassword = (password: string | undefined) => {
    if (typeof password !== "string") {
        return password = "Password Error";
    } else if (password.length < 8 || password.length > 20) {
        return password = "Password must be between 8 and 20 characters";
    } else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
        if (!passwordRegex.test(password)) {
            return password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
    }

    return null;
}

export const validateUsername = (username: string | undefined) => {
    if (typeof username !== "string") {
        return username = "Username Error";
    } else if (username.length < 3 || username.length > 20) {
        return username = "Username must be between 3 and 20 characters";
    }
    return null;
}

export const validateEmail = (email: string | undefined) => {
    if (typeof email !== "string") {
        return email = "Email Error";
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return email = "Invalid email format";
        }
    }

    return null;
}