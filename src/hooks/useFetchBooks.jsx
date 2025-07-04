import { useState, useEffect } from 'react';

const useFetchBooks = (categories) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allBooks = [];
        const limit = 150; 

        for (const category of categories) {
          const response = await fetch(`https://openlibrary.org/subjects/${category}.json?limit=${limit}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.works) {
            allBooks.push(...data.works);
          }
        }
        setBooks(allBooks);
        console.log("useFetchBooks: Libros cargados con éxito.");
      } catch (err) {
        setError(err);
        console.error("useFetchBooks: Error al cargar libros:", err);
      } finally {
        setIsLoading(false);
        console.log("useFetchBooks: Carga finalizada (isLoading = false).");
      }
    };

    fetchBooks();
  }, [categories]);

  return [books, isLoading, error];
};

export default useFetchBooks;