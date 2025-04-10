import { NextApiRequest, NextApiResponse } from "next";
import cors from "@/middleware/corsMIddleware";


import { AgentauthMiddleware } from "@/middleware/authMiddleware";
import { addPropertyContoller, getAllProperties } from "@/controllers/Agentcontroller";

export default AgentauthMiddleware(async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  
   if (req.method === "POST") {
     await addPropertyContoller(req, res); // Handle POST request
     return;
   }
 
   if (req.method === "GET") {
     await getAllProperties(req, res); // Handle GET request
     return;
   }
 
   res.status(405).json({ message: "Method not allowed" });
 
});