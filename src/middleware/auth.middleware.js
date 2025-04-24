import { user } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken'


export const verifyJWT = AsyncHandler((req , res , next)=>{

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer" , "");

    if(!token){
        throw new ApiError(409 , "Unauthorized user");
    }

   const decodedToken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

   if(!decodedToken){
    throw new ApiError(409 , "Unauthorized user");
   }

   const User = user.findById(decodedToken._id);

   if(!User){
    throw new ApiError(409 , "Invalid Access Token");
   }
   req.user = User
   next()
})