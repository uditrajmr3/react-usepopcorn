import React, { useState, useEffect } from "react";
import { tempMovieData } from "./lib/data/temp_movie_data";
import NavBar from "./Components/NavBar/NavBar";
import SearchStats from "./Components/NavBar/SearchStats";
import Main from "./Components/Main/Main";
import ListBox from "./Components/Main/ListBox";
import MovieList from "./Components/Main/MovieList";
import MovieItem from "./Components/Main/MovieItem";
import RatingSummary from "./Components/Main/RatingSummary";
import MovieItemWithRating from "./Components/Main/MovieItemWithRating";
import { KEY } from "./lib/private/Key";
import Loader from "./Components/Common/Loader";
import ErrorMessage from "./Components/Common/ErrorMessage";
import MovieDetails from "./Components/Main/MovieDetails";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const tempQuery = "thor";
  const [query, setQuery] = useState(tempQuery);
  const [selectedId, setSelectedId] = useState(null);

  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

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
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
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
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
            console.log(err);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies(tempMovieData);
        setError("");
        return;
      }
      resetSelectedMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
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
