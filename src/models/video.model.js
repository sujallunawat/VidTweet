import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new Schema({

    videoFile : {
        type : String ,
        required : [true , "Video is Required"],
    },
    thumbnail: {
        type : String , 
        required : [true ,"Thumbnail is Required"],
    },
    title:{
        type: String ,
        required : [true , "Title is Required"],
    },
    description : {
        type: String,
    },
    duration : {
        type : Number ,
        required : true
    },
    views : {
        type: Number,
        default : 0
    },
    isPublished : {
        type : Boolean ,
        default : true
    },
    owner : {
        type:Schema.Types.ObjectId,
        ref : "User"
    }



},{
    timestamps:true,

})

VideoSchema.plugin(mongooseAggregatePaginate)

export const video = mongoose.Model("Video" , VideoSchema);