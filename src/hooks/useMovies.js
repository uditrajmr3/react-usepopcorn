import { useState, useEffect } from "react";

import { tempMovieData } from "../lib/data/temp_movie_data";
import { KEY } from "../lib/private/Key";

export function useMovies(query /*callback*/) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      //   callback?.();

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

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
