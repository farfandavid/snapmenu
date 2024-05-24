import { defineMiddleware } from "astro/middleware";
import jwt from "jsonwebtoken";

export const auth = defineMiddleware(async (context, next) => {
  console.log("In auth middleware");
  const token = context.cookies.get("token")?.value;
  const user_id = context.cookies.get("user_id")?.value;
  const verify = jwt.verify(token, import.meta.env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      console.log("Failed to authenticate token");
      return context.redirect("/login");
    }
    let userId = decoded.id;
    if (userId !== user_id) {
      console.log("Failed to authenticate token, Redirecting to login page");
      return Response.redirect(new URL("/login", context.url));
    } else {
      console.log("Authenticated token");
      return next();
    }
  }
  );
  return verify;
});

/* const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    // If the token is valid, `decoded` will be the payload you passed to `jwt.sign()`.
    req.userId = decoded.id;
    next();
  });
}; */