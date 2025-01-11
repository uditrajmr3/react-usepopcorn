import { useState } from "react";
import "./StarRating.css";
import Star from "./Star";

export default function StarRating({
  ratingOf = 10,
  color = "#ffbc12",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating = () => {},
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  function updateRating(newRating) {
    setRating(newRating);
    onSetRating(newRating);
  }
  function updateTempRating(newRating) {
    setTempRating(newRating);
  }

  function updateRatingValue() {
    if (messages.length === ratingOf) {
      const index = tempRating ? tempRating - 1 : rating - 1;
      return messages[index];
    }
    return tempRating || rating || "";
  }

  const stars = Array.from({ length: ratingOf }, (_, index) => (
    <Star
      key={index}
      color={color}
      size={size}
      onClickHandler={() => updateRating(index + 1)}
      isFilled={tempRating ? tempRating >= index + 1 : rating >= index + 1}
      onHoverIn={() => updateTempRating(index + 1)}
      onHoverOut={() => updateTempRating(0)}
    />
  ));

  const ratingValueStyle = {
    color,
    fontSize: `${size / 1.5}px`,
  };

  return (
    <div className={`rating ${className}`}>
      <div className="stars">{stars}</div>
      <p style={ratingValueStyle} className="rating-value">
        {updateRatingValue()}
      </p>
    </div>
  );
}
