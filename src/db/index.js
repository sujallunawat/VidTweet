import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'



const ConnectionDB = async()=>{
    try{
        await mongoose.connect( `${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`DB CONNECTED SUCCESSFULLY`);
        
    }catch(error){
        console.error(`Error is Connecting DB ${error}`)
    }
}

export default ConnectionDB