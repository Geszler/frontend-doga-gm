const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const dataFilePath = path.join(__dirname, 'data.json');

const readData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.get('/books', (req, res) => {
  const { page = 1, sortBy = 'title', sortOrder = 'asc' } = req.query;
  let data = readData();

  data = data.sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    }
    if (sortBy === 'author') {
      return sortOrder === 'asc' ? a.author.localeCompare(b.author) : b.author.localeCompare(a.author);
    }
    return 0;
  });

  const itemsPerPage = 12;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  res.json(data.slice(start, end));
});

app.post('/books', (req, res) => {
  const newBook = req.body;
  const data = readData();
  const newId = data.length ? data[data.length - 1].id + 1 : 1;
  const bookWithId = { id: newId, ...newBook };
  data.push(bookWithId);
  writeData(data);
  res.status(201).json(bookWithId);
});

app.patch('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  const data = readData();
  const bookIndex = data.findIndex(book => book.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).send('Book not found');
  }

  data[bookIndex] = { id: bookId, ...updatedBook };
  writeData(data);
  res.json(data[bookIndex]);
});

app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const data = readData();
  const bookIndex = data.findIndex(book => book.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).send('Book not found');
  }

  data.splice(bookIndex, 1);
  writeData(data);
  res.status(204).send();
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

