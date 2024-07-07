import userModel from "../../models/userModel";
import { UserError, UserSchema, type IUser } from "../interface/User";

export class User implements IUser {
    id?: string;
    displayName?: string;
    uid?: string;
    email?: string;
    emailVerified?: boolean;
    menuList: string[] = [];
    menuLimit: number = 0;
    disabled?: boolean;

    constructor(data: IUser) {
        this.id = data.id;
        this.displayName = data.displayName;
        this.uid = data.uid;
        this.email = data.email;
        this.emailVerified = data.emailVerified;
        this.menuList = data.menuList;
        this.menuLimit = data.menuLimit;
        this.disabled = data.disabled;
    }

    validate(): User | UserError {
        const validate = UserSchema.safeParse(this);
        if (!validate.success) {
            return new UserError(validate.error?.flatten().fieldErrors);
        } else {
            return validate.data as User;
        }
    }

    static fromJSON(data: IUser): User {
        return new User(data);
    }

    static async getAllUsers() {
    }

}