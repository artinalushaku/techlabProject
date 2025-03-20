import User from "../users/user.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.SECRET_KEY;


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
       const user = await User.findOne({email});
       if(!user) {
           return res.status(401).json({message: "Invalid Credentials"});
       }

const isMatch = await bcrypt.compare(password,user.password);
if(!isMatch) {
    return res.status(401).json({message: "Invalid Credentials"});
}

const payLoad = {
    id: user._id,
    email: user.email,
    role: user.role,
}
const token = jwt.sign(payLoad, secretKey, {expiresIn: "8h"});
res.status(200).json({token});
    } catch (error) {
        res.status(500).json({message: "Server Error", error: error});
        
    }
}
