import React, { useState, useEffect } from "react";
import styles from "../styles/Tours.module.css";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";
import api from "../auth/api";

const ReviewsList = ({ tourId, currentUserId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // Fetch reviews for this tour
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews?tourId=${tourId}`);
      setReviews(response.data);
      
      // Check if current user has already reviewed this tour
      if (currentUserId) {
        const hasReviewed = response.data.some(review => review.user?._id === currentUserId);
        setUserHasReviewed(hasReviewed);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [tourId, currentUserId]);

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      // Refresh the reviews list
      fetchReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review. Please try again.");
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Generate stars based on average rating
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<span key={i} style={{ color: '#FFD700' }}>★</span>);
      } else if (i - 0.5 === roundedRating) {
        stars.push(<span key={i} style={{ color: '#FFD700' }}>★</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#ccc' }}>★</span>);
      }
    }
    
    return stars;
  };

  return (
    <div className={styles.wrapper} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>Customer Reviews</h2>
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '10px' }}>{renderStars(calculateAverageRating())}</div>
              <span style={{ fontWeight: 'bold' }}>
                {calculateAverageRating()} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        
        {currentUserId && !userHasReviewed && (
          <button 
            className={styles.btn}
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#ff4b2b',
              padding: '8px 16px',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Write a Review
          </button>
        )}
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading reviews...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          No reviews yet. Be the first to review this tour!
        </div>
      ) : (
        <div>
          {reviews.map((review) => (
            <ReviewCard 
              key={review._id}
              review={review}
              onUpdate={fetchReviews}
              onDelete={handleDeleteReview}
              canEdit={currentUserId && (review.user?._id === currentUserId)}
            />
          ))}
        </div>
      )}
      
      {showAddModal && (
        <ReviewModal
          tourId={tourId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchReviews();
            setShowAddModal(false);
          }}
          isEditing={false}
        />
      )}
    </div>
  );
};

export default ReviewsList; 