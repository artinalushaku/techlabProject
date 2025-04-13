import React, { useState } from "react";
import styles from "../styles/Tours.module.css";
import api from "../auth/api";

const ReviewModal = ({ onClose, onSuccess, tourId, review, isEditing }) => {
  const [formData, setFormData] = useState({
    title: review?.title || "",
    content: review?.content || "",
    rating: review?.rating || 5,
    photos: review?.photos || [],
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPhotos, setNewPhotos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" ? parseInt(value, 10) : value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setNewPhotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let response;
      
      // First upload photos if there are any
      const photosUrls = [...formData.photos]; // Start with existing photos
      
      if (newPhotos.length > 0) {
        const formDataForUpload = new FormData();
        newPhotos.forEach((file) => {
          formDataForUpload.append("images", file);
        });
        
        const uploadResponse = await api.post("/tours/upload", formDataForUpload);
        
        if (uploadResponse.data && uploadResponse.data.imagesPaths) {
          photosUrls.push(...uploadResponse.data.imagesPaths);
        }
      }
      
      // Update the form data with the photo URLs
      const updatedData = {
        ...formData,
        photos: photosUrls,
        tourId: tourId
      };
      
      if (isEditing) {
        // Update existing review
        response = await api.put(`/reviews/${review._id}`, updatedData);
      } else {
        // Create new review
        response = await api.post("/reviews", updatedData);
      }
      
      if (response.status === 201 || response.status === 200) {
        if (onSuccess) onSuccess(response.data);
        onClose();
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(
        err.response?.data?.message ||
        "An error occurred while submitting your review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate ratings options
  const ratingOptions = [];
  for (let i = 5; i >= 1; i--) {
    ratingOptions.push(
      <option key={i} value={i}>
        {i} star{i !== 1 ? 's' : ''}
      </option>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{isEditing ? "Edit Review" : "Add Review"}</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter a title for your review"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                fontSize: '1rem' 
              }}
            >
              {ratingOptions}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="content">Review</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Share your experience..."
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                fontSize: '1rem',
                minHeight: '120px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="photos">Add Photos (Optional)</label>
            <input
              type="file"
              id="photos"
              name="photos"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                fontSize: '1rem' 
              }}
            />
          </div>
          
          {/* Display existing photos if editing */}
          {isEditing && formData.photos.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Current Photos</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {formData.photos.map((photo, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img 
                      src={photo.startsWith('uploads') ? `http://localhost:3000/${photo}` : photo} 
                      alt={`Review ${index}`} 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        photos: formData.photos.filter((_, i) => i !== index)
                      })}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isEditing ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal; 