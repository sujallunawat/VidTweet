import {AsyncHandler } from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { user } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken'


async function genrateAccessAndRefreshToken(id) {

  try {
    const User = await user.findById(id);

  

    const accessToken =  User.genrateAccessToken();
    const refreshToken = User.refreshAccessToken();


  
   
    User.refreshToken = refreshToken;
    await User.save(
     {
       validateBeforeSave: false,
     }
    );

       return {accessToken , refreshToken } 
  } catch (error) {
    throw new ApiError(500 , `Failed to genrate accessToken or refreshToken : ${error}`);
  }

 
}

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

const loginUser = AsyncHandler(async(req , res) =>{

  console.log(req.body);
  const { userName , email , password } = req.body;


 
  if(!userName && (!email) ){
    throw new ApiError(401 , "username and email is not provided");
  }

  if(!password){
    throw new ApiError(401 , "Password is required");
  }

  const User = await user.findOne({
    $or: [
      { userName: userName },
      { email: email }
    ]
  });
  



  if(!User){
    throw new ApiError(404 , "User not found");
  }

   const isPasswordValid = User.isCorrectPassword(password);

   if(!isPasswordValid){
    throw new ApiError(401 , "Password is incorrect");
   }


  const {accessToken , refreshToken} = await genrateAccessAndRefreshToken(User._id);


  console.log(accessToken , " <----")

  const options = {
    httpOnly:true,
    secure:true,
  }

  const loggedInUser = await user.findById(User._id).select(
    "-password -refreshToken"
  )

  console.log("Logged In User" , loggedInUser);

   res.status(200)
    .cookie("refreshToken" , refreshToken , options)
    .cookie("accessToken" ,accessToken ,options )
    .json(
      new ApiResponse(200 , "User LogedIn Successfully" , true , {
        user: loggedInUser , refreshToken , accessToken
      })
    )
  
})

const logoutUser = AsyncHandler(async (req , res) =>{

  const User = await user.findByIdAndUpdate(req.user._id , {
   $set :  {refreshToken: undefined} ,
  },{
    new : true ,
  });

  const options = {
    httpOnly:true,
    secure:true,
  }

   res.status(200).clearCookie("refreshToken" , options)
                  .clearCookie("accessToken" , options)
         .json(new ApiResponse(200 , "User Logout Successfully",true,{}));

})

const refreshAccessToken = AsyncHandler(async(req , res) => {


  const inCommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;


    console.log(inCommingRefreshToken);
  
    if(!inCommingRefreshToken){
      throw new ApiError(401 , "Unauthorized User")
    }
  
    const decodedToken =  jwt.verify(inCommingRefreshToken , process.env.REFRESH_TOKEN_SECRET);
  
    if(!decodedToken){
      throw new ApiError(401 , "  Invalid Refresh Token ");
    }
     const User =  await user.findById(decodedToken?._id);
  
     if(!User){
      throw new ApiError(401 , " RefreshToken is Invalid or Expired");
     }
  
     if(inCommingRefreshToken !== User?.refreshToken){
      throw new ApiError(401 , " RefreshToken is Invalid or Expired");
     }
  
     const options = {
      httpOnly : true ,
      secure : true
     }
  
     const { accessToken  , refreshToken  } = await genrateAccessAndRefreshToken(User._id);
  
     return res.status(200)
                .cookie("accessToken",accessToken,options)
                .cookie("refreshToken",refreshToken,options)
                .json(
                    new ApiResponse(200 , "Token Refreshed Succesfully" , true , {
                      accessToken , 
                      refreshToken
                    })
                )

})

export {registerUser , loginUser , logoutUser , refreshAccessToken}