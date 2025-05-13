import mongoose, { isValidObjectId } from "mongoose";
import  {tweet}  from "../models/tweet.model.js";
import { user } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";



const createTweet = AsyncHandler(async (req, res) => {
 
  const { content } = req.body;
  const ownerId = req.user._id;

  if (!content) {
    throw new ApiError(400, "Tweet content should not be empty");
  }

  const newTweet = await tweet.create({ content, owner: ownerId });

  if (!newTweet) {
    throw new ApiError(500, "Something went wrong while creating a tweet");
  }

  return res
    .status(201)
    .json(new ApiResponse(201,  "Tweet created successfully" , true , newTweet));
});

const getUserTweets = AsyncHandler(async (req, res) => {


  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const tweets = await tweet.find({ owner: userId }).sort({ createdAt: -1 });

  if (!tweets) {
    throw new ApiError(404, "Tweets are not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200,  "User tweets fetched successfully" , true ,tweets));
});

const updateTweet = AsyncHandler(async (req, res) => {

  const { tweetId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const Tweet = await tweet.findById(tweetId);
    if (!Tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (Tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only update your own tweets");
    }

  const updatedTweet = await tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );


  if (!updatedTweet) {
    throw new ApiError(500, "Something went wrong while updating a tweet");
  }

  res
    .status(200)
    .json(new ApiResponse(200,  "Tweet updated successfully" , true ,updateTweet));
});

const deleteTweet = AsyncHandler(async (req, res) => {

  const { tweetId } = req.params;

  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const Tweet = await tweet.findById(tweetId);
  if (!Tweet) {
      throw new ApiError(404, "Tweet not found");
  }

  if (Tweet.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only delete your own tweets");
  }

  const deletedTweet = await tweet.findByIdAndDelete(tweetId);


  if (!deletedTweet) {
    throw new ApiError(500, "Something went wrong while deleting a tweet");
  }

  res.status(200).json(new ApiResponse(200,  "Tweet deleted successfully" , true , deletedTweet));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };