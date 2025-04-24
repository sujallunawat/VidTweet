import {AsyncHandler } from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { user } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';


const registerUser = AsyncHandler( async (req , res) =>{

  const {userName , email , fullName  , password } = req.body;

  if([userName , email , fullName  , password].some(fields =>
    fields?.trim() === ""
  )){
    throw new ApiError(400 , "Fileds are Empty");
  }

   const UserExist = await user.findOne({
        $or : [{userName}, {email}]
    })

    if(UserExist){
        throw new ApiError(409 , "User already exist");
    }
    console.log(req.files);
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if( req.files && Array.isArray(req.files.coverImage) && coverImage.length>0  ){
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    console.log(avatarLocalPath);

    if(!avatarLocalPath){
        throw new ApiError(409, "Avatar image is required");
    }

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(401 , "Failed to upload avatar");
   }

  const User = await user.create({
    userName,
    fullName,
    email,
    password,
    avatar : avatar.url,
    coverImage: coverImage.url || "",
   })

   if(!User){
    throw new ApiError(500 , "Registering a user failed");
   }


  const createdUser = await user.findById(User._id).select(
    "-password -refreshToken"
  );

 res.status(200).json(
    new ApiResponse(200 , "User created successfully" , true , createdUser)
 )




  
  

  



})

export {registerUser}