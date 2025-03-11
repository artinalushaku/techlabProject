import Booking from "./booking.model.js";
import Tour from "../tours/tour.model.js";

export const createBooking = async (req, res) => {
    try {
        const tourId = req.params.tourId;
        const { guests, date, user } = req.body; // Correct destructuring syntax
        

        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: "Tour not found" });
        }

        const booking = new Booking({
            user: user,
            tour: tourId,
            guests: guests,
            date: date,
        });
        await booking.save();

        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};