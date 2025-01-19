import { useState, useEffect, useRef } from "react";

import StarRating from "../StarRating/StarRating";
import Loader from "../Common/Loader";
import { KEY } from "../../lib/private/Key";

function MovieDetails({ selectedId, onMovieClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const isMovieAlreadyWatched = watched.some(
    (movie) => movie.imdbID === selectedId
  );

  const countRef = useRef(0);

  function updateUserRating(value) {
    setUserRating(value);
  }
  function handleAddToWatchedList() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ")[0]),
      userRating: userRating,
      countRatingDecisions: countRef.current,
    };

    if (!isMovieAlreadyWatched) {
      onAddWatched(newWatchedMovie);
    } else {
      alert("Movie has already been watched earlier!!");
    }
    onMovieClose();
  }

  useEffect(
    function () {
      if (userRating) countRef.current += 1;
    },
    [userRating]
  );

  /* Unmounts the component on `Esc` press */
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onMovieClose();
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onMovieClose]
  );

  /* Gets the movie details on selection */
  useEffect(
    function () {
      async function getMovieDetails(movieID) {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${movieID}`
          );
          const data = await res.json();
          setMovie(data);
        } catch (err) {
          throw new Error("Cannot get movie details");
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails(selectedId);
    },
    [selectedId]
  );

  /* Sets the title for the page */
  useEffect(
    function () {
      if (!movie) return;
      document.title = `Movie | ${movie?.Title || movie?.title || "Unknown"}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [movie]
  );

  if (movie === null) {
    return <Loader />;
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onMovieClose}>
              &larr;
            </button>

            <img src={movie.Poster} alt={`Poster of ${movie.Title} movie`} />

            <div className="details-overview">
              <h2>{movie.Title}</h2>

              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>

              <p className="genre">{movie.Genre}</p>

              <p>
                <span>⭐</span>
                {movie.imdbRating} IMDb Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isMovieAlreadyWatched ? (
                <>
                  <StarRating size={24} onSetRating={updateUserRating} />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={handleAddToWatchedList}
                    >
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You have already rated it{" "}
                  {watched.find((movie) => selectedId === movie.imdbID)
                    ?.userRating || "unknown"}{" "}
                  stars
                </p>
              )}
            </div>
            <p>{movie.Plot}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

export default MovieDetails;
