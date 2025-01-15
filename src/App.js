import React, { useState, useEffect } from "react";
import { tempMovieData } from "./lib/data/temp_movie_data";
import { tempWatchedData } from "./lib/data/temp_watched_data";
import NavBar from "./Components/NavBar/NavBar";
import SearchStats from "./Components/NavBar/SearchStats";
import Main from "./Components/Main/Main";
import ListBox from "./Components/Main/ListBox";
import MovieList from "./Components/Main/MovieList";
import MovieItem from "./Components/Main/MovieItem";
import RatingSummary from "./Components/Main/RatingSummary";
import MovieItemWithRating from "./Components/Main/MovieItemWithRating";
import StarRating from "./Components/StarRating/StarRating";

// http://www.omdbapi.com/?i=tt3896198&apikey=a380ef45
const KEY = "a380ef45";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const tempQuery = "thor";
  const [query, setQuery] = useState(tempQuery);
  const [selectedId, setSelectedId] = useState(null);

  function updatedQuery(e) {
    setQuery(e.target.value);
  }
  function updateSelectedMovie(id) {
    setSelectedId(id === selectedId ? null : id);
  }
  function resetSelectedMovie() {
    setSelectedId(null);
  }
  function addMovieToWatchedList(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function removeMovieFromWathcedList(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      async function fetchMoviesOnMount() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          // handle error here
          if (!res.ok) {
            throw new Error("Something went wrong!!");
          }

          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("No Such Movie(s) Found!!");
          }

          setMovies(data.Search);
        } catch (err) {
          setError(err.message);
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies(tempMovieData);
        setError("");
        return;
      }
      fetchMoviesOnMount();
    },
    [query]
  );

  return (
    <React.Fragment>
      {/* NavBar component has default Logo & Search components */}
      <NavBar query={query} updatedQuery={updatedQuery}>
        <SearchStats movies={movies} />
      </NavBar>

      {/* Main component has no default components */}
      <Main>
        {/* Left List Block : Shows All Movies List */}
        {/* ListBox component works as a container for MovieList component */}
        <ListBox>
          {/* MovieList component takes a function which returns the children */}
          {isLoading && <Loader />}
          {!isLoading && error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              renderMovie={(movie) => (
                <MovieItem
                  key={movie.imdbID}
                  onClick={() => updateSelectedMovie(movie.imdbID)}
                  movie={movie}
                />
              )}
            />
          )}
        </ListBox>

        {/* Right List Block : Shows Watch List with ratings */}
        <ListBox>
          {selectedId != null ? (
            <MovieDetails
              selectedId={selectedId}
              onMovieClose={resetSelectedMovie}
              onAddWatched={addMovieToWatchedList}
              watched={watched}
            />
          ) : (
            <>
              <RatingSummary movies={watched} />
              <MovieList
                movies={watched}
                renderMovie={(movie) => (
                  <MovieItemWithRating
                    key={movie.imdbID}
                    movie={movie}
                    onRemoveWatched={removeMovieFromWathcedList}
                  />
                )}
              />
            </>
          )}
        </ListBox>
      </Main>
    </React.Fragment>
  );
}

function MovieDetails({ selectedId, onMovieClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  function updateUserRating(value) {
    setUserRating(value);
  }

  const isMovieAlreadyWatched = watched.some(
    (movie) => movie.imdbID === selectedId
  );

  function handleAddToWatchedList() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ")[0]),
      userRating: userRating,
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

  if (movie === null) {
    return null;
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

function ErrorMessage({ message }) {
  return <p className="error">💣💣{message}</p>;
}
function Loader() {
  return <p className="loader">Loading...</p>;
}
