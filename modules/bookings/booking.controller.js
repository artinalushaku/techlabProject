import Booking from "./booking.model.js";
import Tour from "../tours/tour.model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const tourId = req.params.tourId;
    const { guests, date, user } = req.body;

    console.log(guests, "guests");
    console.log(date, "date");
    console.log(user, "user");

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    const booking = new Booking({
      user,
      tour: tourId,
      guests,
      date,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get bookings for a specific user
export const getMyBooking = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ user: userId }).populate("tour", "title location price");
    if (!bookings) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = "canceled";
    await booking.save();
    res.status(200).json({ message: "Booking cancelled successfully",booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};