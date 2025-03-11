import mongoose  from "mongoose";

const bookingSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    tour:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tour",
        required:true,
        guests:{
            type:Number,
            required:true,
        },
        date:{
            type:Date,
            required:true
        },
        status:{
            type:String,
            enum:["pending","confirmed","canceled" ],
            default:"pending"
        }
    },
},
{timeseries:true}
)

const Booking =mongoose.model("Booking",bookingSchema)
export default Booking;