import { useState } from "react";
import { tempWatchedData } from "../../lib/data/temp_watched_data";
import ListBox from "./ListBox";
import MovieList from "./MovieList";
import MovieRatingList from "./MovieRatingList";

export default function Main({ movies }) {
  const [watched, setWatched] = useState(tempWatchedData);

  return (
    <main className="main">
      <ListBox>
        <MovieList movies={movies} />
      </ListBox>
      <ListBox>
        <MovieRatingList movies={watched} />
      </ListBox>
    </main>
  );
}
