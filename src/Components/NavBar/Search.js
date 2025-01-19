import { useEffect, useRef } from "react";

export default function Search({ searchQuery, onChangeHandler }) {
  const inputEl = useRef(null);

  function updatedQuery(e) {
    onChangeHandler(e.target.value);
  }

  useEffect(function () {
    inputEl.current.focus();
  }, []);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) return;

        if (e.code === "Enter") {
          inputEl.current.focus();
          onChangeHandler("");
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onChangeHandler]
  );

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
