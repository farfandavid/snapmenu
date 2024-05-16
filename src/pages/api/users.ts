//import jwt from 'jsonwebtoken'
import type { APIContext, APIRoute } from 'astro';
import { getAllUsers, registerUser } from '../../controller/userController'
import db from '../../db/db';
import type { IUser } from '../../types/User';
import { userValidators } from '../../validators/userValidators';
import { date } from 'astro/zod';

export const GET: APIRoute = async ({ params, request }) => {
  db.connectDB();
  console.log(new URL(request.url).pathname)
  const users = await getAllUsers();
  db.disconnectDB();
  return new Response(users, { headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request }) => {
  db.connectDB();
  if (request.headers.get("Content-Type") === "application/json") {
    const user: IUser = await request.json().catch((err) => {
      return { err };
    }
    )
    const data = userValidators(user);
    return data;
  }
  db.disconnectDB();
  return new Response(JSON.stringify('data'), { headers: { 'content-type': 'application/json' } });
}