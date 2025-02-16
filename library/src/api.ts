const API_URL = 'http://localhost:5000/books';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  pages: number;
  available: boolean;
}

export const fetchBooks = async (page: number, sortBy: string, sortOrder: 'asc' | 'desc') => {
  const response = await fetch(`${API_URL}?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
  if (!response.ok) {
    throw new Error('Hiba történt a könyvek betöltésekor');
  }
  return await response.json();
};

export const addBook = async (book: Book) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error('Hiba történt a könyv hozzáadása során');
  }
  return await response.json();
};

export const updateBook = async (id: number, book: Book) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error('Hiba történt a könyv frissítése során');
  }
  return await response.json();
};

export const deleteBook = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Hiba történt a könyv törlése során');
  }
  return await response.json();
};
