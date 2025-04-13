import pool from "../database/connection.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async(req, res) => {
    const {name, password, email, phone} = req.body
    
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
 
    try {
        // Check if agent already exists
        const existingAgent = await pool.query(
            'SELECT * FROM Agent WHERE email = $1',
            [email]
        );

        if (existingAgent.rows.length > 0) {
            return res.status(400).json({ message: 'Agent already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const query = `
            INSERT INTO Agent (name, email, phone, password)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [name, email, phone, hashedPassword];
        const result = await pool.query(query, values)

        const token = jwt.sign(
            { id: result.rows[0].id, email: email },
            "prajwal",
            { expiresIn: '7d' }
        );

        // Remove password from response
        const { password: _, ...agentData } = result.rows[0];

        res.status(201).json({
            message: "Agent registered successfully",
            agent: agentData,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const login = async(req, res) => {
    const {email, password} = req.body
    
    if(!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM Agent WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const agent = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, agent.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: agent.id, email: agent.email },
            "prajwal",
            { expiresIn: '7d' }
        );

        // Remove password from response
        const { password: _, ...agentData } = agent;

        res.status(200).json({
            message: "Login successful",
            agent: agentData,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const createNewProperty = async(req, res) => {
    const {title, location, price, type, bedroom, bathroom, amenities} = req.body;
    const agent_id = req.user.id;
    
    if (!title || !location || !price || !type || !bedroom || !bathroom || !amenities) {
        return res.status(400).json({ 
            message: 'All fields are required for creating a property listing' 
        });
    }

    try {
        const query = `
            INSERT INTO Property (title, location, price, type, bedroom, bathroom, amenities, agent_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const values = [title, location, price, type, bedroom, bathroom, amenities, agent_id];
        
        const result = await pool.query(query, values);
        
        res.status(201).json({
            message: "Property created successfully",
            property: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const fetchAllProperties = async (req, res) => {
    try {
        const agent_id = req.user?.id;
        if (!agent_id) {
            return res.status(401).json({ message: "agent_id not found" });
        }

        const result = await pool.query(
            'SELECT * FROM Property WHERE agent_id = $1',
            [agent_id]
        );

        res.status(200).json({
            message: "Properties fetched successfully",
            properties: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const Fetchcontracts = async (req, res) => {
    try {
        const agent_id = req.user?.id;
        if (!agent_id) {
            return res.status(401).json({ message: "agent_id not found" });
        }

        const result = await pool.query(
            `SELECT 
                contract.*,
                property.*,
                client.name AS client_name,
                client.email AS client_email,
                client.phone AS client_phone
             FROM contract
             JOIN property ON contract.property_id = property.id
             JOIN client ON contract.client_id = client.id
             WHERE contract.agent_id = $1 
               AND contract.status NOT IN ('accepted', 'rejected')
               ORDER BY contract.contract_date DESC`,
            [agent_id]
        );
        

        const contracts = result.rows;

        // const contracts = properties.sort((a, b) => {
        //     if (a.status === 'accepted' && b.status !== 'accepted') return 1;
        //     if (a.status !== 'accepted' && b.status === 'accepted') return -1;
        //     return 0;
        // });

        res.status(200).json({
            message: "Properties fetched successfully",
            contracts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const acceptOrReject = async (req, res) => {
    const agent_id = req.user?.id;
    const { contractId, status } = req.body;
   console.log(contractId)
    try {
       
       

        if (status === "accept" || status === "reject") {
            const updatedStatus = status === "accept" ? "accepted" : "rejected";

            const result = await pool.query(
                'UPDATE contract SET status = $1 WHERE contractid = $2 RETURNING *',
                [updatedStatus, contractId]
            );
          

            const result2 = await pool.query(
                'UPDATE property SET status = $1 WHERE id=$2 RETURNING *',
                [updatedStatus, result.rows[0].property_id]
            );
            return res.status(200).json({
                message: `Contract ${updatedStatus}`,
                contract: result.rows[0]
            });
        } else {
            return res.status(400).json({ message: "Invalid status value" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getProfile=async(req,res)=>{
    const agent_id=req.user.id

    if(!agent_id){
        return res.status(401).json({message:"agent not found"})
    }

    const result=await pool.query(
        `select * from agent where id=$1`,
        [agent_id]
    )
    const Agenttotal_sales=await pool.query(
        `select count(agent_id) as total_sales from contract where 
        
        agent_id=$1 and status='accepted'`,[agent_id]
    )
   
    const addTotalSales=await pool.query(
        `update agent set total_sales=$2 where id=$1`,
        [agent_id,Agenttotal_sales.rows[0].total_sales]
    )
  

res.status(200).json({message:"got the profile ",profile:result.rows[0]})    
}