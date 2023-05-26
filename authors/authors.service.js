const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let authors = [
    {
        id: 1,
        name: 'F. Scott Fitzgerald'
    },
    {
        id: 2,
        name: 'John Steinbeck'
    },
    {
        id: 3,
        name: 'J. D. Salinger'
    }
];

app.get('/authors', (req, res) => {
    try {
        res.json(authors);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/authors/:id', (req, res) => {
    try {
        const author = authors.find(author => author.id === Number(req.params.id));
        if (!author) {
            res.status(404).send('Author not found');
        } else {
            res.json(author);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/authors', (req, res) => {
    try {
        const author = req.body;
        authors.push(author);
        res.status(201).json(author);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/authors/:id', (req, res) => {
    try {
        const author = req.body;
        const index = authors.findIndex(author => author.id === Number(req.params.id));
        if (index === -1) {
            res.status(404).send('Author not found');
        } else {
            authors[index] = author;
            res.json(author);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/authors/:id', (req, res) => {
    try {
        const authorId = Number(req.params.id);
        const index = authors.findIndex(author => author.id === authorId);
        if (index === -1) {
            res.status(404).send('Author not found');
        } else {
            authors = authors.filter(author => author.id !== authorId);
            res.json(authors);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Authors service listening on port ${PORT}`);
});
