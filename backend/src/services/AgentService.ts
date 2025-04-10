import prisma from "../../lib/prisma";

export const addProperty=async(data:{
    title:string,
    location:string,
    price:number,
    bedroom:number,
    bathroom:number,
    amenities:string,
    type:string,
    agentId:number
    
})=>{

    return prisma.property.create({
        data,
    })
}