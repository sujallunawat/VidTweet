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
         fs.unlinkSync(localpathfile)
         return response
        } catch (error) {
            fs.unlinkSync(localpathfile)
            console.error(`Cloudinary ERROR ${error}`)
            return null
        }

    }

    
    const deleteFromCloudinary = async function (imageUrl){

        if(!imageUrl){
            console.log(` NO IMAGE IS PRESENT  `);
                return ""
        }
        const imageArray = imageUrl.split('/');

        console.log(imageArray);

        const imageName = imageArray[imageArray.length - 1];

        const image = imageName.split('.')[0];

        console.log(image);

        try {
            if(!image) {
                console.log(` NO IMAGE IS PRESENT  `);
                return ""
            }
          const response =  await cloudinary.uploader.destroy(image);
         console.log(`IMAGE DELETED SUCCESSFULLY`)
         return response
        } catch (error) {
            console.error(`Cloudinary ERROR ${error}`)
            return ""
        }

    }
    

export {uploadOnCloudinary , deleteFromCloudinary}