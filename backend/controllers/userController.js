import pool from "../database/connection.js"
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

export const register=async(req,res)=>{
  const {name,password,email,phone}=req.body
  if (!name || !email || !phone  || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const existingClient = await pool.query(
    'SELECT * FROM Client WHERE email = $1',
    [email]
);

if (existingClient.rows.length > 0) {
    return res.status(400).json({ message: 'Client is already regsitered' });
}
 
  try {
    const hashedPassword=await bcrypt.hash(password,10)

    const query=`
      insert into Client (name, email, phone, password)
      values ($1, $2, $3, $4)
    returning *
    `;
    const values = [name, email, phone, hashedPassword];
     const result=await pool.query(query,values)
     const token= jwt.sign({id:result.rows[0].id,email:email},
        "prajwal",{
            expiresIn:'7d'
        }
     )
     if(!result) res.status(500).json({message:"server error"})

      res.status(200).json({message:"client registered ",client:result.rows[0],token})  
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"server error"})
  }


}

export const login=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
      res.status(401).json({message:"missing email or password "})
    }
    const result=await pool.query(
        'select * from Client where email=$1',[email]

    )
    if(result.rows.length==0){
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token= jwt.sign({id:result.rows[0].id,email:email},
        "prajwal",{
            expiresIn:'7d'
        }
     )
     res.status(200).json({message:"login successfull ",token,user})
}

export const getProperty=async(req,res)=>{
  
    const {location,bedroom,bathroom}=req.query
   console.log("bedroom "+bedroom)
    if(!location || !bathroom || !bedroom){
       return res.status(401).json({message:"fill all details"})
    }
   const Newbedroom=Number(bedroom)
   const Newbathroom=Number(bathroom)
  
   const result = await pool.query(
    `SELECT DISTINCT 
        property.*, 
        agent.id AS agent_id,
        agent.name AS agent_name,
        agent.email AS agent_email,
        agent.phone AS agent_phone 
     FROM property 
     JOIN agent ON property.agent_id = agent.id 
     WHERE (property.location ILIKE $1 OR property.bedroom = $2 OR property.bathroom = $3)
       AND property.status = 'pending'`,
    [location, Newbedroom, Newbathroom]
  );
  
  console.log("result ",result.rows)
  
    
const sortedProperties = result.rows.sort((a, b) => {
  console.log("bedroom "+a.bedroom+" newbdroom"+Newbedroom)
  const priorityA = (a.location.toLowerCase() === location.toLowerCase() ? 3 : 0) +
                    (Number(a.bedroom) ===Number( Newbedroom) ? 2 : 0) +
                    (Number(a.bathroom) === Number(Newbathroom) ? 1 : 0);
  const priorityB = (b.location.toLowerCase() === location.toLowerCase() ? 3 : 0) +
                    (Number(b.bedroom )===Number( Newbedroom) ? 2 : 0) +
                    (Number(b.bathroom) === Number(Newbathroom) ? 1 : 0);
                    console.log(priorityB)
  return priorityB - priorityA;
});


console.log("sorted properties ",sortedProperties.length)
    res.status(200).json({message:"sorted properties",sortedProperties})
}

export const showInterest=async(req,res)=>{
     const client_id=req.user.id
     const {propertyId}=req.body

     if(!client_id || !propertyId){
        res.status(401).json({message:"fill all the details "})
     }
   const details= await pool.query(
    'select agent_id,price from property  where id=$1',
    [propertyId]
   )
   console.log(details.rows)

   const contract=await pool.query(
    'insert into contract (contract_value,status,property_id,client_id,agent_id) values($1,$2,$3,$4,$5) returning *',
    [details.rows[0].price,"pending",propertyId,client_id,details.rows[0].agent_id]
   )

   res.status(200).json({message:"contract created succesfully",contract:contract.rows})
    
}

export const getAllInterests=async(req,res)=>{
    const client_id=req.user.id

    if(!client_id){
        res.status(201).json({message:"client is not present"})
    }

    const result=await pool.query(
        `select contract.*,property.title,property.price,property.type,agent.name
        ,property.bedroom,property.bathroom,property.amenities,property.location
        from contract join property on contract.property_id=property.id
        join agent on agent.id=contract.agent_id
        
       where contract.client_id=$1 ORDER BY contract.contract_date DESC`,
        [client_id]
    )
res.status(200).json({message:"got all contracts ",allInterests:result.rows})
}

export const getProfile=async(req,res)=>{
  const client_id=req.user.id

  if(!client_id){
      return res.status(401).json({message:"client not found"})
  }

  const result=await pool.query(
      `select * from client where id=$1`,
      [client_id]
  )
res.status(200).json({message:"got the profile ",profile:result.rows[0]})    
}

