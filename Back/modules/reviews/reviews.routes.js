import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getMyReviews
} from "./review.controller.js";
import {
  authorize,
  isAuthenticated
} from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllReviews);
router.get("/:id", getReviewById);

// Protected routes (authentication required)
router.post("/", isAuthenticated, createReview);
router.get("/user/myReviews", isAuthenticated, getMyReviews);
router.put("/:id", isAuthenticated, updateReview);
router.delete("/:id", isAuthenticated, deleteReview);

// Admin/Moderator routes
router.get(
  "/admin/pending",
  isAuthenticated,
  authorize("admin", "moderator"),
  (req, res, next) => {
    req.query.status = "pending";
    next();
  },
  getAllReviews
);

export default router; 