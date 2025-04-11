import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        tour: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Tour', 
            required: true 
        },
        rating: { 
            type: Number, 
            required: true,
            min: 1,
            max: 5
        },
        title: { 
            type: String, 
            required: true,
            trim: true 
        },
        content: { 
            type: String, 
            required: true 
        },
        photos: [{ 
            type: String 
        }],
        status: {
            type: String,
            enum: ["published", "pending", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

// Compound index to prevent duplicate reviews from the same user for the same tour
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

// Static method to calculate average rating for a tour
reviewSchema.statics.calculateAverageRating = async function(tourId) {
    const stats = await this.aggregate([
        { $match: { tour: tourId, status: "published" } },
        { 
            $group: { 
                _id: '$tour', 
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);
    
    return stats.length > 0 ? stats[0] : { avgRating: 0, numReviews: 0 };
};

const Review = mongoose.model("Review", reviewSchema)

export default Review; 