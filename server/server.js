const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {Dog} = require('./models/dog.js')

const app = express();

//setup
const port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
const database = process.env.MONGODB_URI || "mongodb://localhost:27017/Doglist"
mongoose.connect(database)
  .then(() => {
    console.log('connected to database');
  }).catch(() => {
    console.log('unable to connect to database');
  })

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send("GET /");
})

app.post('/dogs', (req, res) => {
  const dog = new Dog({
    name: 'Spot',
    age: 2
  })
  dog.save()
    .then(dog => {
      res.send(dog);
    })
    .catch(e => {
      res.status(400).send();
    })
})

app.listen(port, () => {
  console.log( `Listening on port ${port}`);
})
