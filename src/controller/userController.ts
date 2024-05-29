import mongoose from 'mongoose';
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
    throw new Error(err.message);
  }
}

export const registerUser = async (user: IUser) => {
  console.log("User register Mongodb")
  try {
    db.connectDB();
    const newUser = new User({ _id: new mongoose.Types.ObjectId(), ...user });
    await newUser.save();
    console.log("User registered", newUser)
    return true;
  } catch (err: any) {
    console.log({
      error: {
        code: err.code,
      }
    })
    return {
      error: {
        code: err.code,
      }
    };
  }
}

export const updateUser = async (email: string, user: IUser) => {
  try {
    db.connectDB();
    const updatedUser = await User.findOneAndUpdate({ email: email }, user, { new: true });
    return updatedUser;
  } catch (err: any) {
    throw new Error(err.message);
  }
}