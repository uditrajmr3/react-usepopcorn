import { useEffect, useRef } from "react";
import { useKey } from "../../hooks/useKey";

export default function Search({ searchQuery, onChangeHandler }) {
  const inputEl = useRef(null);

  function updatedQuery(e) {
    onChangeHandler(e.target.value);
  }

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    onChangeHandler("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={searchQuery}
      onChange={updatedQuery}
      ref={inputEl}
    />
  );
}
