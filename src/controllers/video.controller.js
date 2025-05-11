import mongoose, {isValidObjectId} from "mongoose"
import {video} from "../models/video.model.js"
import {user} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"



const getAllVideos = AsyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      query = "",
      sortBy = "createdAt",
      sortType = "desc",
      userId,
    } = req.query;
    //TODO: get all videos based on query, sort, pagination

    if (!req.user) {
      throw new ApiError(401, "User needs to be logged in");
    }

    const match = {
      ...(query ? { title: { $regex: query, $options: "i" } } : {}),
      ...(userId ? { owner: mongoose.Types.ObjectId(userId) } : {}),
    };

    const videos = await video.aggregate([
      {
        $match: match,
      },

      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "videosByOwner",
        },
      },

      {
        $project: {
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          isPublished: 1,
          owner: {
            $arrayElemAt: ["$videosByOwner", 0],
          },
        },
      },

      {
        $sort: {
          [sortBy]: sortType === "desc" ? -1 : 1,
        },
      },

      {
        $skip: (page - 1) * parseInt(limit),
      },

      {
        $limit: parseInt(limit),
      },
    ]);

    if (!videos?.length) {
      throw new ApiError(404, "Videos are not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully"));
  });

const publishAVideo = AsyncHandler(async (req, res) => {
    const { title, description, owner, duration } = req.body;

  
    if(!title) {
      throw new ApiError(400, "Title should not be empty")
    }
    if(!description) {
      throw new ApiError(400, "Description should not be empty")
    }
  
    const videoFileLocalPath = req.files?.videoFile[0]?.path
  
    if (!videoFileLocalPath) {
      throw new ApiError(400, "Video file is required")
   }
  
   const thumbnailLocalPath = req.files?.thumbnail[0]?.path
  
   if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail is required")
   }
  
   const videoFile = await uploadOnCloudinary(videoFileLocalPath)
   const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
  
   if (!videoFile) {
      throw new ApiError(400, "Cloudinary Error:  Video file is required")
  }
  
  if (!thumbnail) {
      throw new ApiError(400, "Cloudinary Error: Thumbnail is required")
   }

   console.log(videoFile);
  
   const videoDoc = await video.create({
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      title,
      description,
      owner: req.user?._id,
      duration : videoFile.duration,
   })
  
   console.log(` Title: ${title}, Owner: ${owner}, duration: ${duration}`);
  
  
   if (!videoDoc) {
      throw new ApiError(500, "Something went wrong while publishing a video")
  }
  
  return res
      .status(201)
      .json(new ApiResponse(201, videoDoc, "Video published Successfully"));
  
  
  });

const getVideoById = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}