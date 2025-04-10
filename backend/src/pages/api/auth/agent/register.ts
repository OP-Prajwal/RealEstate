
import prisma from "../../../../../lib/prisma";
import bcrypt from 'bcrypt'
import { NextApiRequest,NextApiResponse } from "next";
import cors from "@/middleware/corsMIddleware";
import  Jwt  from "jsonwebtoken";
import cookie from 'cookie';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    await cors(req, res);
    if(req.method!="POST")res.status(401).json({message:"only post call can be made"})

    const {name,password,phone,email,experience}=req.body

    const existingUser=await prisma.agent.findUnique({where:{email}})

    if(existingUser) res.status(401).json({message:"user already exists "})
    
    const hashPassword=await bcrypt.hash(password,10)

    const AgentUser=await prisma.agent.create({
        data:{name,email,password:hashPassword,phone,experience}
    })
      const token= Jwt.sign({id:AgentUser.id,role:"agent"},"Prajwal"!,{expiresIn:"7d"})
 
         res.setHeader('set-cookie',cookie.serialize('agentToken',
             token,{
                 httpOnly: true,
             secure: process.env.NODE_ENV === 'production',
             sameSite: 'strict',
             path: '/',
             }
         ))
    res.status(201).json({ message: 'User registered successfully', AgentUser });

    }


