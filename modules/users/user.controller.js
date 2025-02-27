import bcrypt from "bcrypt"
import User from "./user.model.js"

export const createUsers= async(req,res) =>{
try {
    // const firstName = req.body.firstName
    // const lastName = req.body.lastName
    // const email = req.body.email
    // const password = req.body.password
    // const phoneNumber = req.body.phoneNumber
    // const role = req.body.role
    const{firstName,lastName,email,password,phoneNumber,role}=req.body;
    const existingUser = await User . findOne ({email});
    if(existingUser){
        return res.status(400).json({
            message : "User with email already exist",
        });
    }

const hashedPassword = await bcrypt.hash(password,10);
  

const user= new User({
 
    firstName, //Shkon njejt si ato ma posht 
    lastName,
    email,
    password:hashedPassword,
    phoneNumber,
    role

})
await user.save()
res.status(201).json(user)

} catch (error) {
    console.log("error")
    res.status(400).json({message:"Invalid user data"})
}

}
export const getUsers = async(req, res) => {
    try {
        const allUsers = await User.find().sort({createdAt: -1});
        res.status(200).json({user : allUsers, total:allUsers.length});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        
    }
};

export const oneUser = async(req, res) => {
    try {
        const userId = req.params.id
      const oneUser =await User.findById(userId);
      res.status(200).json(oneUser);
    } catch (error) {
        res.status(500).json({message: "Server Error"});
        
    }
};

export const updateUser = async (req,res)=>{
    try {
        const userId = req.params.id

        const{firstName,lastName,email,password,phoneNumber,role}=req.body;
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
         if(firstName){
            user.firstName=firstName
         }
        if(lastName){
            user.lastName=lastName
        }
        if(email){
            user.email=email
        }
        if(phoneNumber){
            user.phoneNumber=phoneNumber
        }
        if(role){
            user.role=role
        }
        if(password){
            const hashedPassword = await bcrypt.hash(password,10);
  
            user.password=hashedPassword
        }
await user.save();
res.status(200).json({message:"User updated succesfully",user})
    } catch (error) {
        res.status(500).json({message:"Server Error",error:error})
        
    }
}

export const deleteUser = async (req,res)=>{

    
    try {
        const userId= req.params.id
       await User.findByIdAndDelete(userId)
    res.status(200).json({message:"User deleted succsesfully"})
        
    } catch (error) {
        res.status(500).json({message:"Server error",error:error})
    }

}