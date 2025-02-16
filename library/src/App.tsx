import { useEffect, useState } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  genre: string;
  pages: number;
  available: boolean;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [formState, setFormState] = useState({
    title: '',
    author: '',
    year: 0,
    genre: '',
    pages: 0,
    available: true
  });
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [page, setPage] = useState(1); 
  const [sortBy, setSortBy] = useState('title'); 
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 

  const fetchBooks = async () => {
    const response = await fetch(`http://localhost:5000/books?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    const data = await response.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, [page, sortBy, sortOrder]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: name === 'available' ? value === 'true' : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBook) {
      await updateBook();
    } else {
      await addBook();
    }
  };

  const addBook = async () => {
    const response = await fetch('http://localhost:5000/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState)
    });

    if (response.ok) {
      fetchBooks();
      resetForm();
    }
  };

  const updateBook = async () => {
    if (!editingBook) return;

    const response = await fetch(`http://localhost:5000/books/${editingBook.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState)
    });

    if (response.ok) {
      fetchBooks();
      resetForm();
    }
  };


  const deleteBook = async (id: number) => {
    if (window.confirm('Biztosan törölni szeretnéd a könyvet?')) {
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBooks();
      }
    }
  };

  const resetForm = () => {
    setFormState({
      title: '',
      author: '',
      year: 0,
      genre: '',
      pages: 0,
      available: true
    });
    setEditingBook(null);
  };

  const editBook = (book: Book) => {
    setEditingBook(book);
    setFormState({
      title: book.title,
      author: book.author,
      year: book.year,
      genre: book.genre,
      pages: book.pages,
      available: book.available ? 'true' : 'false'
    });
  };

  return (
    <div className="App">
      <h1>Könyvtár</h1>

      <div>
        <label htmlFor="sortBy">Rendezés:</label>
        <select
          name="sortBy"
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title">Cím</option>
          <option value="author">Szerző</option>
          <option value="year">Kiadás Éve</option>
        </select>

        <select
          name="sortOrder"
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
        >
          <option value="asc">Növekvő</option>
          <option value="desc">Csökkenő</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Cím"
          value={formState.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Szerző"
          value={formState.author}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Kiadás Éve"
          value={formState.year}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Műfaj"
          value={formState.genre}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="pages"
          placeholder="Oldalszám"
          value={formState.pages}
          onChange={handleInputChange}
          required
        />
        <select
          name="available"
          value={formState.available ? 'true' : 'false'}
          onChange={handleInputChange}
          required
        >
          <option value="true">Elérhető</option>
          <option value="false">Nem elérhető</option>
        </select>
        <button type="submit">
          {editingBook ? 'Frissítés' : 'Hozzáadás'}
        </button>
        {editingBook && (
          <button type="button" onClick={resetForm}>Mégse</button>
        )}
      </form>

      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <h2>{book.author} - {book.title}</h2>
            <p><strong>Év:</strong> {book.year}</p>
            <p><strong>Műfaj:</strong> {book.genre}</p>
            <p><strong>Oldalszám:</strong> {book.pages}</p>
            <p><strong>Elérhető:</strong> {book.available ? 'Igen' : 'Nem'}</p>
            <button onClick={() => editBook(book)}>Szerkesztés</button>
            <button onClick={() => deleteBook(book.id)}>Törlés</button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          Előző
        </button>
        <span>Oldal: {page}</span>
        <button onClick={() => setPage(page + 1)}>Következő</button>
      </div>
    </div>
  );
}

export default App;
