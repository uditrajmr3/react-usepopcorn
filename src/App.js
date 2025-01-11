import React, { useState } from "react";
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

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);

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
          <MovieList
            movies={movies}
            renderMovie={(movie) => (
              <MovieItem key={movie.imdbID} movie={movie} />
            )}
          />
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
// MovieItemWithRating
