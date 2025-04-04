import { useEffect, useState } from "react";

const categories = ["fiction", "science", "history", "programming", "art"];

const useFetchBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = [];
        for (const category of categories) {
          const res = await fetch(`https://openlibrary.org/search.json?q=${category}&limit=20`);
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
