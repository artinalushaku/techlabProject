import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Tours.module.css";
import BookingModal from "./BookingModal";

const TourCard = ({ tour }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { _id, title, country, city, location, averageRating, price, image } = tour;
  const navigate = useNavigate();

  const fullImageUrl = image?.startsWith("uploads")
    ? `http://localhost:3000/${image}`
    : image || "https://via.placeholder.com/300x200?text=No+Image";

  const handleBookingSuccess = () => {
    // You can add a toast notification here
    console.log("Booking successful!");
  };

  const handleViewDetails = () => {
    navigate(`/tours/${_id}`);
  };

  return (
    <>
      <li className={styles.cards_item}>
        <div className={styles.card}>
          <div className={styles.card_image}>
            <img src={fullImageUrl} alt={title} />
          </div>
          <div className={styles.card_content}>
            <h2 className={styles.card_title}>{title}</h2>
            <p className={styles.card_text}>
              <strong>Country:</strong> {country}
              <br />
              <strong>City:</strong> {city}
              <br />
              <strong>Location:</strong> {location}
              <br />
              <strong>Rating:</strong> {averageRating || "N/A"} {averageRating ? "⭐" : ""}
              <br />
              <strong>Price:</strong> ${price}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className={styles.btn}
                onClick={handleViewDetails}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
              >
                View Details
              </button>
              <button
                className={styles.btn}
                onClick={() => setShowBookingModal(true)}
              >
                Book
              </button>
            </div>
          </div>
        </div>
      </li>
      {showBookingModal && (
        <BookingModal
          tour={tour}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
};

export default TourCard;
