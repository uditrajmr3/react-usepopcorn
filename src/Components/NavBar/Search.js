export default function Search({ searchQuery, onChangeHandler }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={searchQuery}
      onChange={onChangeHandler}
    />
  );
}
