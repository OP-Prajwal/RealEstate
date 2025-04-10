
import { acceptOrReject, Contracts } from "@/controllers/Agentcontroller";
import { AgentauthMiddleware } from "@/middleware/authMiddleware";
import cors from "@/middleware/corsMIddleware";
import { NextApiRequest, NextApiResponse } from "next";

export default AgentauthMiddleware(async(req:NextApiRequest,res:NextApiResponse)=>{
   await cors(req,res)
   if(req.method=="GET"){
    await Contracts(req,res)
   }
   if(req.method=='POST'){
      await acceptOrReject(req,res)
   }
})



