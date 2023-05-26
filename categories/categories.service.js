const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let categories = [
    {
        id: 1,
        name: 'Fiction'
    },
    {
        id: 2,
        name: 'Non-fiction'
    },
    {
        id: 3,
        name: 'Biography'
    }
];

app.get('/categories', (req, res) => {
    try {
        res.json(categories);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/categories/:id', (req, res) => {
    try {
        const category = categories.find(category => category.id === Number(req.params.id));
        if (!category) {
            res.status(404).send('Category not found');
        } else {
            res.json(category);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/categories', (req, res) => {
    try {
        const category = req.body;
        categories.push(category);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/categories/:id', (req, res) => {
    try {
        const category = req.body;
        const index = categories.findIndex(category => category.id === Number(req.params.id));
        if (index === -1) {
            res.status(404).send('Category not found');
        } else {
            categories[index] = category;
            res.json(category);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/categories/:id', (req, res) => {
    try {
        const categoryId = Number(req.params.id);
        const index = categories.findIndex(category => category.id === categoryId);
        if (index === -1) {
            res.status(404).send('Category not found');
        } else {
            categories = categories.filter(category => category.id !== categoryId);
            res.json(categories);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Categories service listening on port ${PORT}`);
});
