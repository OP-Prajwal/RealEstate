import jwt from 'jsonwebtoken'

const JWT_SECRET = "prajwal" 

export const authMiddleware = async(req, res, next) => {
    try {
        const token=req.headers.authorization.split(' ')[1]
       

        

        
        console.log('Token to verify:', token) 

        const decoded = jwt.verify(token, JWT_SECRET)
        console.log('Decoded token:', decoded) 
     
     
        req.user = decoded
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            console.error('JWT Error:', error.message)
            return res.status(401).json({
                message: 'Invalid token',
                details: error.message
            })
        }
        
        console.error('Authentication Error:', error)
        return res.status(401).json({ 
            message: 'Authentication failed',
            error: error.message 
        })
    }
}