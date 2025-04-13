import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/Tours.module.css";
import BookingModal from "../../components/BookingModal";
import ReviewsList from "../../components/ReviewsList";
import api from "../../auth/api";

const TourDetails = () => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch tour details
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tours/${id}`);
        setTour(response.data);
      } catch (err) {
        console.error("Error fetching tour:", err);
        setError("Failed to load tour details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Get current user info
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await api.get("/auth/me");
          setCurrentUser(response.data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        // Not setting error here as this is not critical for page rendering
      }
    };

    fetchTour();
    fetchCurrentUser();
  }, [id]);

  const handleBookingSuccess = () => {
    // You can add a toast notification here
    console.log("Booking successful!");
    setShowBookingModal(false);
  };

  if (loading) {
    return (
      <div className={styles.wrapper} style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading tour details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper} style={{ textAlign: "center", padding: "50px" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate("/tours")}
          style={{
            backgroundColor: "#ff4b2b",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Back to Tours
        </button>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className={styles.wrapper} style={{ textAlign: "center", padding: "50px" }}>
        <h2>Tour not found</h2>
        <button 
          onClick={() => navigate("/tours")}
          style={{
            backgroundColor: "#ff4b2b",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Back to Tours
        </button>
      </div>
    );
  }

  const { title, description, country, city, location, averageRating, price, image } = tour;

  const fullImageUrl = image?.startsWith("uploads")
    ? `http://localhost:3000/${image}`
    : image || "https://via.placeholder.com/800x400?text=No+Image";

  return (
    <div className={styles.wrapper}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className={styles.title}>{title}</h1>
        <button 
          onClick={() => navigate("/tours")}
          style={{
            backgroundColor: "#f4f4f4",
            color: "#333",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Back to Tours
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {/* Tour Details Section */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "20px", 
          backgroundColor: "white", 
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{ width: "100%", height: "400px", overflow: "hidden" }}>
            <img 
              src={fullImageUrl} 
              alt={title} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          
          <div style={{ padding: "20px" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px" 
            }}>
              <h2 style={{ margin: 0 }}>{title}</h2>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "10px", fontWeight: "bold" }}>${price}</span>
                <button
                  className={styles.btn}
                  onClick={() => setShowBookingModal(true)}
                  style={{
                    backgroundColor: "#ff4b2b",
                    padding: "10px 20px",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div>
                <strong>Country:</strong> {country}
              </div>
              <div>
                <strong>City:</strong> {city}
              </div>
              <div>
                <strong>Location:</strong> {location}
              </div>
              <div>
                <strong>Rating:</strong> {averageRating || "No ratings yet"} {averageRating ? "⭐" : ""}
              </div>
            </div>
            
            <div>
              <h3 style={{ marginBottom: "10px" }}>Description</h3>
              <p>{description || "No description available."}</p>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <ReviewsList 
          tourId={id} 
          currentUserId={currentUser?._id}
        />
      </div>
      
      {showBookingModal && (
        <BookingModal
          tour={tour}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default TourDetails; 