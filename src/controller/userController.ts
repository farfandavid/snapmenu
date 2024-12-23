import User from '../models/userModel';
import type { IUser } from '../types/User';
import db from '../db/db';

export const getAllUsers = async () => {
  try {
    const users = await User.find();
    return JSON.stringify(users);
  } catch (err: any) {
    return JSON.stringify({ message: err.message });
  }
};

export const getUserById = async (uid: string) => {
  try {
    db.connectDB();
    const user = await User.findOne({ uid: uid });
    return user;
  }
  catch (err: any) {
    throw new Error(err.message);
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    db.connectDB();
    const user = await User.findOne({ email: email });
    return user;
  }
  catch (err: any) {
    console.log(err);
    return null;
  }
}

export const registerUser = async (user: IUser) => {
  try {
    db.connectDB();
    const newUser = new User(
      {
        displayName: user.displayName,
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        menuList: user.menuList, menuLimit: 0,
        disabled: user.disabled
      }
    );
    await newUser.save();
    console.log("User registered", newUser)
    return true;
  } catch (err: any) {
    console.log("registerUser", { error: err })
    return {
      error: {
        code: err.code,
      }
    };
  }
}

export const addMenuToUser = async (email: string, menuId: string) => {
  try {
    db.connectDB();
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    user.menu.push(menuId);
    await user.save();
    return user;
  }
  catch (err: any) {
    throw new Error(err.message);
  }
}

export const updateUser = async (email: string, user: IUser) => {
  try {
    db.connectDB();
    const updatedUser = await User.findOneAndUpdate({ email: email }, user, { new: true });
    console.log("User updated", updatedUser);
    return updatedUser;
  } catch (err: any) {
    throw new Error(err.message);
  }
}