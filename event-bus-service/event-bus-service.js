const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

let events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);

  axios.post('http://localhost:3000/events', event); // authentication service
  axios.post('http://localhost:4000/events', event); // authors service
  axios.post('http://localhost:5000/events', event); // books service
  axios.post('http://localhost:6000/events', event); // categories service
  axios.post('http://localhost:7000/events', event); // reviews service
  axios.post('http://localhost:8000/events', event); // users service

  res.send({ status: 'OK' });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(9000, () => {
  console.log('Event bus service listening on port 9000');
});