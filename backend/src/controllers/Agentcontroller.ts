import { NextApiRequest,NextApiResponse } from "next";
import cors from "@/middleware/corsMIddleware";
import { addProperty } from "@/services/AgentService";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
export const addPropertyContoller = async (req: NextApiRequest, res: NextApiResponse) => {
  const isPreflight = await cors(req, res);
if (isPreflight) return;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  try {
    const { title, location, price, type, bedroom, bathroom, amenities } = req.body;

    console.log("Request Body:", req.body); // Log the request body

    const token = req.headers.authorization?.split(' ')[1] ?? null;
    if (!token) {
      return res.status(401).json({ message: "Authorization token is missing" });
    }
    console.log("Token:", token); // Log the token

    const decoded = jwt.verify(token, "Prajwal");
    console.log("Decoded Token:", decoded); // Log the decoded token

    if (!decoded || typeof decoded === "string") {
      return res.status(400).json({ message: "Agent not found" });
    }

    if (!title || !location || !price || !type || bedroom == null || bathroom == null || !decoded.id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const property = await addProperty({
      title,
      location,
      price,
      type,
      bedroom,
      bathroom,
      amenities,
      agentId: Number(decoded.id),
    });

    console.log("Property Created:", property); // Log the created property
    return res.status(201).json({ message: "Property created", property });
  } catch (error) {
    console.error("Error creating property:", error); // Log the error
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

export const getAllProperties=async(req:NextApiRequest,res:NextApiResponse)=>{
  const isPreflight = await cors(req, res);
if (isPreflight) return;

  if(req.method!="GET") res.status(401).json({message:"only get methord"})
 console.log(req.headers)
    const token = req.headers.authorization?.split(' ')[1] ?? null;
          console.log(token)
          if (!token) {
            return res.status(401).json({ message: "Authorization token is missing" });
          }
          console.log(token)
          if (!token) {
            return res.status(401).json({ message: "Authorization token is missing" });
          }
          const decoded = jwt.verify(token, "Prajwal");
          if (!decoded || typeof decoded === "string") {
            return res.status(400).json({ message: "Agent not found" });
          }
          const allProperties = await prisma.property.findMany({
            where: {
              agentId: decoded.id
            },
          });
          
          res.status(200).json({message:"got properties ",allProperties})


}

export const Contracts=async(req:NextApiRequest,res:NextApiResponse)=>{
  const isPreflight = await cors(req, res);
if (isPreflight) return;
  const agent=(req as any).user
  const agentId=agent.id
  const sortedContracts=await prisma.contract.findMany({
    where:{
       agentId:agentId
    },
    include:{
      agent:true,
      client:true,
      property:true
    
    },
   
  })
   
  const contracts = sortedContracts.sort((a, b) => {
    if (a.status === 'accepted' && b.status !== 'accepted') return 1;
    if (a.status !== 'accepted' && b.status === 'accepted') return -1;
    return 0; // keep original order otherwise
  });

  if(!contracts) res.status(400).json({message:"check ur controller"})

  res.status(200).json({message:"contracts got ",contracts})  
}

export const acceptOrReject=async(req:NextApiRequest,res:NextApiResponse)=>{
  const isPreflight = await cors(req, res);
if (isPreflight) return;
  const {contractId,status}=req.body
 
  if(status==="accept"){
    const contract=await prisma.contract.update({
      where: {
        id: contractId
      },
      data: {
        status: "accepted", // Replace with the appropriate field and value to update
      }
    })
    console.log(contract)

    res.status(200).json({message:"done",contract})
  }
  else{
    const contract=await prisma.contract.update({
      where:{
        id:contractId
      },
      data:{
        status:"rejected"
      }
    })
    console.log(contract)
    res.status(200).json({message:"done",contract})
  }

}