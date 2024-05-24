//import jwt from 'jsonwebtoken'
import type { APIContext, APIRoute } from 'astro';
import { getAllUsers, registerUser } from '../../controller/userController'
import db from '../../db/db';
import type { IUser } from '../../types/User';
import { userValidators } from '../../validators/userValidators';

export const GET: APIRoute = async ({ params, request }) => {
  db.connectDB();
  console.log(new URL(request.url).pathname)
  const users = await getAllUsers();
  db.disconnectDB();
  return new Response(users, { headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request }) => {
  db.connectDB();
  const data = await request.json().catch((err) => {
    return { err };
  }
  );

  if (userValidators(data)) {
    return new Response(JSON.stringify(userValidators(data)), { headers: { 'content-type': 'application/json' } });
  }

  const user: IUser = data;
  const newUser = await registerUser(user).catch((err) => {
    return err;
  }
  );
  db.disconnectDB();
  return newUser;


}