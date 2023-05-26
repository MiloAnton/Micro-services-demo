const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let reviews = [
    {
        id: 1,
        bookId: 1,
        userId: 1,
        rating: 5,
        comment: "Excellent book, highly recommended!"
    },
    {
        id: 2,
        bookId: 2,
        userId: 2,
        rating: 4,
        comment: "Interesting read, but a bit slow in the middle."
    }
];

app.get('/reviews', (req, res) => {
    try {
        res.json(reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/reviews/:id', (req, res) => {
    try {
        const review = reviews.find(review => review.id === Number(req.params.id));
        if (!review) {
            res.status(404).send('Review not found');
        } else {
            res.json(review);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/reviews', (req, res) => {
    try {
        const review = req.body;
        reviews.push(review);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/reviews/:id', (req, res) => {
    try {
        const review = req.body;
        const index = reviews.findIndex(review => review.id === Number(req.params.id));
        if (index === -1) {
            res.status(404).send('Review not found');
        } else {
            reviews[index] = review;
            res.json(review);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/reviews/:id', (req, res) => {
    try {
        const reviewId = Number(req.params.id);
        const index = reviews.findIndex(review => review.id === reviewId);
        if (index === -1) {
            res.status(404).send('Review not found');
        } else {
            reviews = reviews.filter(review => review.id !== reviewId);
            res.json(reviews);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Reviews service listening on port ${PORT}`);
});
