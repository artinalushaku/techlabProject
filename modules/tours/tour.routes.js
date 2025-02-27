import express from "express"
import {createTour, deleteTour, getTourById, getTours} from "./tour.controller.js"


const router = express.Router()
//create tour
router.post("/",createTour);
//get all tours
router.get("/", getTours);
//get single tour
router.get("/:tourId",getTourById);
//update a tour
router.patch("/");
//delete tour
router.delete("/:tourId",deleteTour);

export default router;