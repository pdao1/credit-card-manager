const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://phung:Watacress1@phung.2yfqvwg.mongodb.net/CreditCardManager', { useNewUrlParser: true, useUnifiedTopology: true });

const createCreditCardModel = (personName) => {
  const schema = new mongoose.Schema({
    name: String,
    balance: Number,
    apr: Number
  });

  return mongoose.model(personName, schema, personName);
}

app.post('/:person/add', async (req, res) => {
  const CreditCard = createCreditCardModel(req.params.person);
  const newCard = new CreditCard(req.body);
  await newCard.save();
  res.send('Card Added');
});

app.get('/:person/cards', async (req, res) => {
  const CreditCard = createCreditCardModel(req.params.person);
  const cards = await CreditCard.find();
  res.json(cards);
});

app.put('/:person/edit/:id', async (req, res) => {
  const CreditCard = createCreditCardModel(req.params.person);
  await CreditCard.findByIdAndUpdate(req.params.id, req.body);
  res.send('Card Updated');
});

app.delete('/:person/delete/:id', async (req, res) => {
  const CreditCard = createCreditCardModel(req.params.person);
  await CreditCard.findByIdAndDelete(req.params.id);
  res.send('Card Deleted');
});

app.post('/:person/payment/:id', async (req, res) => {
  const CreditCard = createCreditCardModel(req.params.person);
  const card = await CreditCard.findById(req.params.id);
  card.balance -= req.body.amount;
  await card.save();
  res.send('Payment made');
});

// Start Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
