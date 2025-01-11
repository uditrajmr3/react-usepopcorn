import "./StarRating.css";

export default function StarRating({ ratingOf = 10 }) {
  const stars = Array.from({ length: ratingOf }, (_, index) => (
    <span key={index} className="star">
      ⭐ {index + 1}
    </span>
  ));

  return (
    <div className="rating">
      <div className="stars">{stars}</div>
      <p className="rating-value">{ratingOf}</p>
    </div>
  );
}
