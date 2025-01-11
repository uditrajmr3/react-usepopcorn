import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import StarRating from "./Components/StarRating/StarRating";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

const messages = ["Terrible", "Bad", "Okay", "Good", "Amazing"];

function MyRating() {
  const [rating, setRating] = useState(3);

  return (
    <div>
      <StarRating
        ratingOf={10}
        color="#1b4acf"
        defaultRating={rating}
        onSetRating={setRating}
      />
      <p>This movie was rated {rating} stars</p>
    </div>
  );
}

root.render(
  <React.StrictMode>
    <StarRating size={24} />
    <StarRating size={24} ratingOf={5} messages={messages} />
    <StarRating color="#fcc419" size={24} />
    <StarRating ratingOf={20} color="#11a1ff" defaultRating={5} />
    <MyRating />
  </React.StrictMode>
);
