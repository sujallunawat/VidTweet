import mongoose , {Schema} from "mongoose";

const LikeSchema = new Schema({
   comment : {
    type : Schema.Types.ObjectId,
    ref : 'Comment'
   } ,
   video : {
    type : Schema.Types.ObjectId,
    ref : 'Video'
   },
   tweet : {
    type : Schema.Types.ObjectId,
    ref : 'Tweet'
   },
   likedBy : {
     type : Schema.Types.ObjectId,
     ref : 'User'
   }


},{timestamps:true})


export default like = mongoose.model('Like' , LikeSchema);