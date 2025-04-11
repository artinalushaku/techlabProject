import Review from "./review.model.js";
import Tour from "../tours/tour.model.js";

// Create new review
export const createReview = async (req, res) => {
  try {
    const { tourId, rating, title, content, photos } = req.body;
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    // Check if user has already reviewed this tour
    const existingReview = await Review.findOne({ user: userId, tour: tourId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this tour" });
    }

    // Create new review
    const review = new Review({
      user: userId,
      tour: tourId,
      rating,
      title,
      content,
      photos: photos || []
    });

    await review.save();

    // Calculate and update tour rating
    const stats = await Review.calculateAverageRating(tourId);
    await Tour.findByIdAndUpdate(tourId, {
      averageRating: stats.avgRating,
      reviewsCount: stats.numReviews
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const { tourId, status } = req.query;
    const filter = {};
    
    if (tourId) filter.tour = tourId;
    if (status) filter.status = status;

    const reviews = await Review.find(filter)
      .populate("user", "firstName lastName")
      .populate("tour", "name")
      .sort({ createdAt: -1 });
      
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get review by ID
export const getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId)
      .populate("user", "firstName lastName")
      .populate("tour", "name");
      
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, title, content, photos, status } = req.body;
    const userId = req.user.id;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    // Check if user owns this review or is admin/moderator
    if (review.user.toString() !== userId && 
        !["admin", "moderator"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }
    
    // Update fields
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (content) review.content = content;
    if (photos) review.photos = photos;
    
    // Only admin/moderator can update status
    if (status && ["admin", "moderator"].includes(req.user.role)) {
      review.status = status;
    }
    
    await review.save();
    
    // If rating changed, recalculate tour rating
    if (rating) {
      const stats = await Review.calculateAverageRating(review.tour);
      await Tour.findByIdAndUpdate(review.tour, {
        averageRating: stats.avgRating,
        reviewsCount: stats.numReviews
      });
    }
    
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    // Check if user owns this review or is admin/moderator
    if (review.user.toString() !== userId && 
        !["admin", "moderator"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }
    
    const tourId = review.tour;
    
    await Review.findByIdAndDelete(reviewId);
    
    // Recalculate tour rating
    const stats = await Review.calculateAverageRating(tourId);
    await Tour.findByIdAndUpdate(tourId, {
      averageRating: stats.avgRating,
      reviewsCount: stats.numReviews
    });
    
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get my reviews
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const reviews = await Review.find({ user: userId })
      .populate("tour", "name")
      .sort({ createdAt: -1 });
      
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}; 