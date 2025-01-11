export default function MovieList({ movies, renderMovie }) {
  return <ul className="list">{movies?.map((movie) => renderMovie(movie))}</ul>;
}
