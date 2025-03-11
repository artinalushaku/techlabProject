import express from "express";
import{createBooking} from "./booking.controller.js";

const router = express.Router();

router.post("/:tourId/book",createBooking);
router.get("/myBookings");
router.delete("/:bookingId/cancel");

export default router;