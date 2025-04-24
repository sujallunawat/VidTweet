import { v2 as cloudinary } from 'cloudinary';
import { Console } from 'console';
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
    
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME ,
        api_key: process.env.CLOUDINARY_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET
    });

    // console.table(cloud_name  , api_key , api_secret  );

    const uploadOnCloudinary = async function (localpathfile){


        try {
            if(!localpathfile) {
                console.log(` FILE PATH IS NOT VALID :- ${localpathfile}`);
                return ""
            }
          const response =  await cloudinary.uploader.upload(localpathfile , {
                resource_type:"auto" ,
         })
         console.log(`FILE UPLOADED SUCCESSFULLY`)
         return response
        } catch (error) {
            fs.unlinkSync(localpathfile)
            console.error(`Cloudinary ERROR ${error}`)
            return null
        }

    }
    

export {uploadOnCloudinary}