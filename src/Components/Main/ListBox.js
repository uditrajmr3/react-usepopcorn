import { useState } from "react";

export default function ListBox({ isLoading, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      {isLoading ? (
        <Loader />
      ) : (
        <BuildList isOpen={isOpen} setIsOpen={setIsOpen}>
          {children}
        </BuildList>
      )}
    </div>
  );
}

function BuildList({ isOpen, setIsOpen, children }) {
  return (
    <>
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}
