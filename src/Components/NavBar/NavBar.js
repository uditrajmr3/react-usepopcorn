import { useState } from "react";

import Logo from "./Logo";
import Search from "./Search";
import SearchStats from "./SearchStats";

export default function NavBar({ movies }) {
  const [query, setQuery] = useState("");

  function updatedQuery(e) {
    setQuery(e.target.value);
  }

  return (
    <nav className="nav-bar">
      <Logo />
      <Search searchQuery={query} onChangeHandler={updatedQuery} />
      <SearchStats movies={movies} />
    </nav>
  );
}
