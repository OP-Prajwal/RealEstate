import express from 'express'
import pool from './database/connection.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import Userrouter from './routes/UserRoutes.js'
import AgentRouter from './routes/AgentRoutes.js'
const app = express()


app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/api/auth/client', Userrouter)
app.use('/api/auth/agent',AgentRouter)

pool.connect()


app.listen(3000, () => {
    console.log("app running on port 3000")
})