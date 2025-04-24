import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const UserSchema = new Schema({
    userName : {
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
    fullName : {
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

UserSchema.pre("save" , async function (next) {
    
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password , 10);
    next()
})

UserSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password , this.password)
}

UserSchema.methods.genrateAccessToken = function () {

    jwt.sign({
        _id : this._id ,
        email : this.email,
        userName : this.userName,
        fullName : this.fullName,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
}

UserSchema.methods.refreshAccessToken = function () {

    jwt.sign({
        _id : this._id ,

    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    })
}


export const user = mongoose.model("User", UserSchema);