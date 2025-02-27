import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/routes.js"

const app=express();

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/v1",routes)

//app.get("/",(req,res)=>{
//res.send("Welcome to the travel booking API")

//})


connectDB()


app.listen(3000, () => {
    console.log(`Server running on port ${PORT}`);
});