import { useState } from "react";

import Logo from "./Logo";
import Search from "./Search";

export default function NavBar({ query, updatedQuery, children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search searchQuery={query} onChangeHandler={updatedQuery} />
      {children}
    </nav>
  );
}
