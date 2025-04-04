import React from "react";
import LibraryMap from "./components/LibraryMap";
import useFetchBooks from "./hooks/useFetchBooks";

const App = () => {
  const books = useFetchBooks("science");

  return <LibraryMap books={books} />;
};

export default App;
