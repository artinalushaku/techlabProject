import React, { useState } from "react";
import styles from "../styles/Tours.module.css";
import ReviewModal from "./ReviewModal";

const ReviewCard = ({ review, onUpdate, onDelete, canEdit }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { title, content, rating, user, createdAt, status, photos } = review;

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Generate stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#FFD700' : '#ccc', marginRight: '2px' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Handler for successful edit
  const handleEditSuccess = () => {
    setShowEditModal(false);
    if (onUpdate) onUpdate();
  };

  // Handler for delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      onDelete(review._id);
    }
  };

  return (
    <>
      <div className={styles.card} style={{ marginBottom: '20px' }}>
        <div className={styles.card_content} style={{ position: 'relative' }}>
          {status && status !== 'published' && (
            <div style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              padding: '2px 8px',
              backgroundColor: status === 'pending' ? '#f59e0b' : '#ef4444',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.8em'
            }}>
              {status}
            </div>
          )}
          
          <h2 className={styles.card_title}>{title}</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div>{renderStars(rating)}</div>
            <span style={{ marginLeft: '10px', fontSize: '0.9em', color: 'white' }}>
              {rating}/5
            </span>
          </div>
          
          <p className={styles.card_text} style={{ marginBottom: '15px' }}>
            {content}
          </p>
          
          {photos && photos.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
              {photos.map((photo, index) => (
                <img 
                  key={index} 
                  src={photo.startsWith('uploads') ? `http://localhost:3000/${photo}` : photo} 
                  alt={`Review ${index}`} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                />
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.8em', color: 'white' }}>
              <strong>By:</strong> {user?.firstName} {user?.lastName}<br />
              <strong>Date:</strong> {formattedDate}
            </p>
            
            {canEdit && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setShowEditModal(true)}
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: '0.9em'
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showEditModal && (
        <ReviewModal
          review={review}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
          isEditing={true}
        />
      )}
    </>
  );
};

export default ReviewCard; 