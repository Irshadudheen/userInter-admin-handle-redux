import express from 'express'
import dotenv from 'dotenv/config'
import cors from 'cors'
import cookieParser from "cookie-parser"
import userRouter from './Router/userRouter.js'
import adimRouter from './Router/adminRouter.js'
import Dburl from './Connections/mongo.js'
import { errorhandler,notfound } from './Middleware/errorhandler.js'
const app=express()

Dburl()

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/api/user',userRouter)
app.use('/api/admin',adimRouter)
app.get('/hello',(req,res)=>res.send({message:"hai to irshad"}))
app.get ('/',(req,res)=>res.send('the server is ready'))

app.use(errorhandler)
app.use(notfound)

app.listen(process.env.PORT,()=>console.log(`server is running at ${process.env.PORT}`))