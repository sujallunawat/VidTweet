import mongoose , {Schema} from "mongoose";

const CommentSchema = new Schema({
    content : {
        type : String,
        required : [true , "Empty comment can't be added"]
    },
    video : {
        type : Schema.Types.ObjectId,
        ref : "Video"
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },

},{timestamps:true});

export default comment = mongoose.model("Comment" , CommentSchema );