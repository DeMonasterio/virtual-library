import React, { useState } from "react";
import LibraryMap from "./components/LibraryMap";
import useFetchBooks from "./hooks/useFetchBooks";

const App = () => {
  const books = useFetchBooks("science");
  const [fov, setfov] = useState(75)
  // <input onChange={(e) => handleFovChange(e)} type="range" name="fov" id="fov" min={0} max={200} />
  // const handleFovChange = (e)=>{
  //   setfov(e.target.value)
  //   console.log(e);
    
  // }

  return (
    <>
      <LibraryMap books={books} fov={fov} />;
    </>
  )
};

export default App;
