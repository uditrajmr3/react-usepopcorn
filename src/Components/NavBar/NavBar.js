import { useState } from "react";

import Logo from "./Logo";
import Search from "./Search";

export default function NavBar({ children }) {
  const [query, setQuery] = useState("");

  function updatedQuery(e) {
    setQuery(e.target.value);
  }

  return (
    <nav className="nav-bar">
      <Logo />
      <Search searchQuery={query} onChangeHandler={updatedQuery} />
      {children}
    </nav>
  );
}
