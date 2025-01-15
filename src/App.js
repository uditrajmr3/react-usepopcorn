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

// http://www.omdbapi.com/?i=tt3896198&apikey=a380ef45
const KEY = "a380ef45";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const query = "parantha";

  useEffect(function () {
    async function fetchMoviesOnMount() {
      try {
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
    fetchMoviesOnMount();
  }, []);

  return (
    <React.Fragment>
      {/* NavBar component has default Logo & Search components */}
      <NavBar>
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
                <MovieItem key={movie.imdbID} movie={movie} />
              )}
            />
          )}
        </ListBox>

        {/* Right List Block : Shows Watch List with ratings */}
        <ListBox>
          <RatingSummary movies={watched} />
          <MovieList
            movies={watched}
            renderMovie={(movie) => (
              <MovieItemWithRating key={movie.imdbID} movie={movie} />
            )}
          />
        </ListBox>
      </Main>
    </React.Fragment>
  );
}

function ErrorMessage({ message }) {
  return <p className="error">💣💣{message}</p>;
}
function Loader() {
  return <p className="loader">Loading...</p>;
}
