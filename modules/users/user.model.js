import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName:{type:String,required:true},
        lastName:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        phoneNumber:{type:String,deafult:null},
        role:{
            type:String,
            enum:["admin","user","moderator"],
            deafult:"user"

        }
        

    },
    {
    timestamps:true

    }

)
const User = mongoose.model("User",userSchema)

export default User;