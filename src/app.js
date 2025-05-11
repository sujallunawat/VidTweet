import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { LIMIT } from './constant.js'


const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))

app.use(express.json({limit:LIMIT}))
app.use(express.static("public"))
app.use(express.urlencoded({extended:true , limit:LIMIT}))

app.use(cookieParser())


import  userRouter  from './routes/user.router.js'
import videoRouter from './routes/video.router.js'

app.use('/api/v1/users' , userRouter)
app.use('/api/v1/videos' , videoRouter);


export {app}
