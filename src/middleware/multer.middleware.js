import multer from "multer";

const Storage = multer.diskStorage({
    destination: function(req , file , cb){
        cb(null , './public/temp')
    },
    filename: function(req , file ,cb){
        const suffix = Date.now() + Math.round(Math.random()* 1E9);
        cb(null , file.originalname + suffix)
    }
})

export const upload = multer({storage:Storage})