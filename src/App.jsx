import React, { useState, Suspense, lazy, useEffect } from "react";
import useFetchBooks from "./hooks/useFetchBooks.jsx"; 
import HUD from "./components/Hud/Hud.jsx";
import LibraryFallBack from "./components/FallBack/LibraryFallBack.jsx";
import SceneSetup from "./components/SceneSetup.jsx"



const categories = ["fiction", "science", "history", "programming", "art"];

const App = () => {
  const [books, isLoading, error] = useFetchBooks(categories); 

  const [mapLoaded, setMapLoaded] = useState(false); 
  const [showCanvas, setShowCanvas] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [fov, setFov] = useState(75);

  useEffect(() => {
    console.log("App Effect - isLoading:", isLoading, "error:", error, "mapLoaded:", mapLoaded);
    
    
    if ((!isLoading || error) && mapLoaded) {
      console.log("App: Libros y mapa listos. Preparando para mostrar el canvas...");
      const timer = setTimeout(() => {
        setShowCanvas(true);
        console.log("App: setShowCanvas(true) - Canvas debería aparecer.");
      }, 0);

      return () => clearTimeout(timer);
    } else if (isLoading) {
      console.log("App: Todavía cargando libros o esperando mapLoaded...");
    }

  }, [isLoading, error, mapLoaded]);


  return (
    <>
      <div className={`fallback-wrapper ${showCanvas ? "fade-out" : ""}`}>
        <LibraryFallBack />
        {error && <p style={{color: 'red'}}>Error al cargar libros: {error.message}</p>}
      </div>

      <Suspense fallback={<></>}>
        {!isLoading && !error && (
          <SceneSetup
            books={books}
            setSelectedBook={setSelectedBook}
            setIsBookOpen={setIsBookOpen}
            fov={fov}
            onLoaded={() => {
              setMapLoaded(true);
              console.log("App: SceneSetup ha llamado a onLoaded(true).");
            }}
            canvasClassName={`canvas-fullscreen ${showCanvas ? "visible" : ""}`}
            isBookOpen={isBookOpen}
            selectedBook={selectedBook}
          />
        )}
      </Suspense>

      <HUD isBookOpen={isBookOpen} selectedBook={selectedBook} />
    </>
  );
};

export default App;