import mongoose , {Schema} from "mongoose";

const TweetSchema = new Schema({
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
   content: {
        type: String,
        required : [true , "Content is Required in Tweet" ]
    },

},{timestamps:true});



export const tweet = mongoose.model("Tweet" , TweetSchema);