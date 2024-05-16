import mongoose from 'mongoose';
import User from '../models/userModel';
import type { IUser } from '../types/User';

export const getAllUsers = async () => {
  try {
    const users = await User.find();
    return JSON.stringify(users);
  } catch (err: any) {
    return JSON.stringify({ message: err.message });
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await User
      .findById(id);
    return JSON.stringify(user);
  }
  catch (err: any) {
    return JSON.stringify({ message: err.message });
  }
}

export const registerUser = async (user: IUser) => {
  try {
    const newUser = new User({ _id: new mongoose.Types.ObjectId(), ...user });
    console.log(newUser);
    await newUser.save();
    return JSON.stringify(newUser);
  } catch (err: any) {
    return JSON.stringify({ message: err.message });
  }
}