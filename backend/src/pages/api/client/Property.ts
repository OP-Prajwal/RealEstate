import { NextApiRequest, NextApiResponse } from "next";
import cors from "@/middleware/corsMIddleware";
import { getProperty, showInterest } from "@/controllers/ClientController";
import { ClientauthMiddleware } from "@/middleware/clientMiddleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  // Properly invoke the ClientauthMiddleware
  return ClientauthMiddleware(async (req, res) => {
    if (req.method === "POST") {
      await showInterest(req, res); // Ensure the function resolves the request
      return;
    }

    if (req.method === "GET") {
      await getProperty(req, res); // Ensure the function resolves the request
      return;
    }

    res.status(405).json({ message: "Method not allowed" });
  })(req, res); // Pass `req` and `res` to the middleware
}