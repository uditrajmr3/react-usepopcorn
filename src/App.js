import React, { useState } from "react";

import NavBar from "./Components/NavBar/NavBar";
import SearchStats from "./Components/NavBar/SearchStats";
import Main from "./Components/Main/Main";
import ListBox from "./Components/Main/ListBox";
import MovieList from "./Components/Main/MovieList";
import MovieItem from "./Components/Main/MovieItem";
import RatingSummary from "./Components/Main/RatingSummary";
import MovieItemWithRating from "./Components/Main/MovieItemWithRating";
import Loader from "./Components/Common/Loader";
import ErrorMessage from "./Components/Common/ErrorMessage";
import MovieDetails from "./Components/Main/MovieDetails";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

export default function App() {
  const tempQuery = "thor";
  const [query, setQuery] = useState(tempQuery);
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query /*resetSelectedMovie*/);

  const [watched, setWatched] = useLocalStorageState([], "watched");

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

  return (
    <React.Fragment>
      {/* NavBar component has default Logo & Search components */}
      <NavBar query={query} updatedQuery={setQuery}>
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
