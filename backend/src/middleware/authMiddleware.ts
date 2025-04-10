import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import cors from "./corsMIddleware";
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
export const AgentauthMiddleware = (handler: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const isPreflight = await cors(req, res);
    if (isPreflight) return;

    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.headers.cookie) {
      // Fallback: Try to get from cookies
      const cookies = cookie.parse(req.headers.cookie || "");
      token = cookies.agentToken;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No agent token" });
    }

    try {
      console.log("Received Token:", token); // Debugging: Log the token
      const decoded = jwt.verify(token, "Prajwal") as any;

      // ✅ Role check
     
      (req as any).user = decoded;
      return handler(req, res);
    } catch (err) {
      console.error("JWT verification failed for agent:", err);

      if (err instanceof Error && err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }

      return res.status(401).json({ message: "Invalid or expired agent token" });
    }
  };
};