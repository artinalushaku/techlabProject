import express from "express";
import userRoutes from "../modules/users/users.routes.js"
import tourRoutes from "../modules/tours/tour.routes.js"
import bookingsRoutes from "../modules/bookings/booking.routes.js"

const router = express.Router()

router.use("/users", userRoutes)
router.use("/tours",tourRoutes)
router.use("/bookings",bookingsRoutes)

export default router; 
