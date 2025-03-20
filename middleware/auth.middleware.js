import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRET_KEY;

export const isAuthenticated =(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message: "Authorization header is required"});//401 is unauthorized
    }
console.log(authHeader, "authHeader");
    const token = authHeader.split(" ")[1];
    try {
       const decode = jwt.verify(token, secretKey);
       req.user = decode;
       next();
    } catch (error) {
        res.status(401).json({message: "Invalid Token"});//401 i bjen qe tokeni eshte invalid
        
    }
}
