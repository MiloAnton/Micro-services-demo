const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com'
    },
    {
        id: 2,
        name: 'User 2',
        email: 'user2@example.com'
    },
    {
        id: 3,
        name: 'User 3',
        email: 'user3@example.com'
    }
];

app.get('/users', (req, res) => {
    try {
        res.json(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/users/:id', (req, res) => {
    try {
        const user = users.find(user => user.id === Number(req.params.id));
        if (!user) {
            res.status(404).send('User not found');
        } else {
            res.json(user);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/users', (req, res) => {
    try {
        const user = req.body;
        users.push(user);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/users/:id', (req, res) => {
    try {
        const user = req.body;
        const index = users.findIndex(user => user.id === Number(req.params.id));
        if (index === -1) {
            res.status(404).send('User not found');
        } else {
            users[index] = user;
            res.json(user);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/users/:id', (req, res) => {
    try {
        const userId = Number(req.params.id);
        const index = users.findIndex(user => user.id === userId);
        if (index === -1) {
            res.status(404).send('User not found');
        } else {
            users = users.filter(user => user.id !== userId);
            res.json(users);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Users service listening on port ${PORT}`);
});
