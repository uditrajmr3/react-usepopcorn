import RatingSummary from "./RatingSummary";
import MovieItemWithRating from "./MovieItemWithRating";

export default function MovieRatingList({ movies }) {
  return (
    <>
      <RatingSummary movies={movies} />

      <ul className="list">
        {movies.map((movie) => (
          <MovieItemWithRating key={movie.imdbID} movie={movie} />
        ))}
      </ul>
    </>
  );
}
