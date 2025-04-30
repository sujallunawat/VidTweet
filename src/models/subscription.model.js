import mongoose , {Schema} from 'mongoose'

const SubscriptionSchema = new Schema(
    {
        channel :{
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        subscriber : {
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    },{
        timestamps:true,
    }
)

export const subscription = mongoose.model( "Subscription" , SubscriptionSchema)

