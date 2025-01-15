export default function MovieList({ movies, renderMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => renderMovie(movie))}
    </ul>
  );
}
