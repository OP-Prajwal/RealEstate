import cookie from "cookie";
import jwt from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import cors from "./corsMIddleware";

export const ClientauthMiddleware = (handler: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const isPreflight = await cors(req, res);
    if (isPreflight) return;

    // Try to get token from Authorization header
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.headers.cookie) {
      // Fallback: Try to get from cookies
      const cookies = cookie.parse(req.headers.cookie || "");
      token = cookies.clientToken;
    }

    if (!token) {
      return res.status(401).json({ message: "Authorization token is missing" });
    }

    try {
      const decoded = jwt.verify(token, "Prajwal");
      (req as any).user = decoded;
      return handler(req, res);
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Invalid or malformed token" });
    }
  };
};
