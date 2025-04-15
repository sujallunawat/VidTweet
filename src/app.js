import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'


const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))

app.use(express.json({limit:LIMIT}))
app.use(express.static("public"))
app.use(express.urlencoded({extended:true , limit:LIMIT}))

app.use(cookieParser())

export {app}
