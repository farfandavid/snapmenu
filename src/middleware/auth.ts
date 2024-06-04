import { defineMiddleware } from "astro/middleware";

export const auth = defineMiddleware(async ({ request, cookies }, next) => {
  return next();
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