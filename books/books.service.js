const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let books = [
    {
        id: 1,
        title: 'The Great Gatsby',
        authorId: 1,
        categoryId: 1
    },
    {
        id: 2,
        title: 'The Grapes of Wrath',
        authorId: 2,
        categoryId: 2
    },
    {
        id: 3,
        title: 'The Catcher in the Rye',
        authorId: 3,
        categoryId: 3
    }
];

app.get('/books', (req, res) => {
    try {
        res.json(books);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/books/:id', (req, res) => {
    try {
        const book = books.find(book => book.id === Number(req.params.id));
        if (!book) {
            res.status(404).send('Book not found');
        } else {
            res.json(book);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/books', (req, res) => {
    try {
        const book = req.body;
        books.push(book);
        res.status(201).json(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/books/:id', (req, res) => {
    try {
        const book = req.body;
        const index = books.findIndex(book => book.id === Number(req.params.id));
        if (index === -1) {
            res.status(404).send('Book not found');
        } else {
            books[index] = book;
            res.json(book);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/books/:id', (req, res) => {
    try {
        const bookId = Number(req.params.id);
        const index = books.findIndex(book => book.id === bookId);
        if (index === -1) {
            res.status(404).send('Book not found');
        } else {
            books = books.filter(book => book.id !== bookId);
            res.json(books);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Books service listening on port ${PORT}`);
});
