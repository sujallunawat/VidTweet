import mongoose ,{Schema} from "mongoose";

const PlaylistSchema = new Schema({
    name : {
        type : String,
        required : [true , "Playlist Name is Required"]
    },
    description : {
        type : String,
    },
    videos : [
        {
            type : Schema.Types.ObjectId,
            ref:"Video",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId , 
        ref : "User"

    }
},{
    timestamps:true,
})


export default playlist = mongoose.model('Playlist' , PlaylistSchema);