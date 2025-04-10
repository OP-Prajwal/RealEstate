import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import cors from "@/middleware/corsMIddleware";

// GET /api/client/Property
export const getProperty = async (req: NextApiRequest, res: NextApiResponse) => {
  const isPreflight = await cors(req, res);
  if (isPreflight) return;
  

  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { location, bedroom, bathroom } = req.query;

  if (!location && !bedroom && !bathroom) {
    return res.status(401).json({ message: "Please fill all the details" });
  }

  const properties = await prisma.property.findMany({
    where: {
      OR: [
        { location: location as string, bathroom: Number(bathroom), bedroom: Number(bedroom) },
        { location: location as string },
        { bedroom: Number(bedroom) },
        { bathroom: Number(bathroom) }
      ]
    },
    include: {
      agent: {
        select: { name: true }
      }
    }
  });

  const sortedProperties = properties.sort((a, b) => {
    const priorityA = (a.location === location ? 3 : 0) +
                      (a.bedroom === Number(bedroom) ? 2 : 0) +
                      (a.bathroom === Number(bathroom) ? 1 : 0);
    const priorityB = (b.location === location ? 3 : 0) +
                      (b.bedroom === Number(bedroom) ? 2 : 0) +
                      (b.bathroom === Number(bathroom) ? 1 : 0);
    return priorityB - priorityA;
  });

  res.status(200).json({ message: "Fetched properties", properties: sortedProperties });
};

// POST /api/client/Property (show interest)
export const showInterest = async (req: NextApiRequest, res: NextApiResponse) => {
  const isPreflight = await cors(req, res);
  if (isPreflight) return;
  

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const client = (req as any).user;
  const { propertyId } = req.body;

  if (!propertyId || !client?.id) {
    return res.status(400).json({ message: "Incomplete body" });
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  try {
    const contract = await prisma.contract.create({
      data: {
        contract_date: new Date(),
        contract_value: property.price,
        status: "pending",
        propertyId: propertyId,
        clientId: client.id,
        agentId: property.agentId,
      },
    });

    return res.status(201).json({ message: "Interest shown", contract });
  } catch (error) {
    if ((error as any).code === 'P2003') {
      return res.status(400).json({ message: "Invalid foreign key reference: clientId or propertyId" });
    }
    console.error("Error showing interest:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/client/Interests (view all interests)
export const getAllInterests = async (req: NextApiRequest, res: NextApiResponse) => {
  const isPreflight = await cors(req, res);
if (isPreflight) return;


  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const client = (req as any).user;

  if (!client?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const allInterests = await prisma.contract.findMany({
    where: {
      clientId: client.id
    },
    include: {
      property: true,
      agent: true,
      client: true
    },
    orderBy: {
      contract_date: 'desc' // or 'asc' depending on what you want
    }
  });
  

  res.status(200).json({ message: "Extracted interests", allInterests });
};
