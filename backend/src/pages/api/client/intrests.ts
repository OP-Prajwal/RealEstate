// Handles GET (fetch all interests for the logged-in client)
import { NextApiRequest, NextApiResponse } from "next";
import cors from "@/middleware/corsMIddleware";
import { getAllInterests } from "@/controllers/ClientController";
import { ClientauthMiddleware } from "@/middleware/clientMiddleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  // Authenticate the client
  return ClientauthMiddleware(async (req, res) => {
    if (req.method === "GET") {
      return getAllInterests(req, res);
    }

    return res.status(405).json({ message: "Method not allowed" });
  })(req, res);
}
