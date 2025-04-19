import multer from "multer";

const Storage = multer.diskStorage({
    destination: function(res , file , cb){
        cb(null , './public/temp')
    },
    filename: function(res , file ,cb){
        const suffix = Date.now + Math.round(Math.random()* 1E9);
        cb(null , file.originalname + suffix)
    }
})

export const multer = multer({Storage:Storage})