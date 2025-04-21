import { useEffect, useState } from "react";

const useFetchBooks = (categories) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = [];
        for (const category of categories) {
          const res = await fetch(`https://openlibrary.org/search.json?q=${category}&limit=50`);
          const data = await res.json();
          allBooks.push(...data.docs);
        }
        setBooks(allBooks);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, []);

  return books;
};

export default useFetchBooks;
