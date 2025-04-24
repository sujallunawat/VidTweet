
// import { configDotenv } from 'dotenv';
import dotenv from 'dotenv'
import ConnectionDB from './db/index.js'
import { app } from './app.js'

// require('dotenv').config({
//     path: './.env'
// })
dotenv.config({
    path:'./.env'
})
const PORT = process.env.PORT || 3010
ConnectionDB().then(
    app.listen(PORT , ()=>{
        console.log(`CONNECTED TO THE SERVER AT http://localhost:${PORT}`)
    })
).catch( (err) =>{
    console.log(`DB CONNECTION ERROR  ${err}`)
})
