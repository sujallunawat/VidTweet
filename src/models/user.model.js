import mongoose ,{Schema} from "mongoose";


const UserSchema = new Schema({
    username : {
        type: String ,
        required: [true , 'Username is Required'],
        unique:[true , 'Username should be Unique'],
        trim:true,
        index:true,
        lowercase:true,     
    },
    email : {
        type: String ,
        required: [true , 'Email is Required'],
        unique:[true , 'This Email is already in use'],
        lowercase:true,     
    },
    fullname : {
        type: String ,
        required: [true , 'Name is Required'],
        trim:true,
        index:true,   
    },
    avatar : {
        type: String ,
        required: [true , 'Avatar is Required'],
    },
    coverImage : {
        type: String ,
    },
    watchHistory :[
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    password : {
        type: String ,
        required : [true , 'Password is required']
    },
    refreshToken : {
        type:String ,
    },
},{
    timestamps:true,
})

export const user = mongoose.model("User", UserSchema);