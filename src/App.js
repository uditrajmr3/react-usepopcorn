import { useState } from "react";
import { tempMovieData } from "./lib/data/temp_movie_data";

import NavBar from "./Components/NavBar/NavBar";
import Main from "./Components/Main/Main";

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);

  return (
    <>
      <NavBar movies={movies} />
      <Main movies={movies} />
    </>
  );
}
