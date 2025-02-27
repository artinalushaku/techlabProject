import express from "express"
import {createUsers, getUsers,oneUser,updateUser,deleteUser} from "./user.controller.js"
import User from "./user.model.js"

const router = express.Router()

router.get("/getAllUsers", getUsers)
router.get("/getOneUser/:id", oneUser)
router.post("/createUsers",createUsers)
router.put("/updateUser/:id",updateUser)
router.delete("/deleteUser/:id",deleteUser)

export default router