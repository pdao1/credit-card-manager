const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// Connect to MongoDB
mongoose.connect('mongodb+srv://phung:Watacress1@phung.2yfqvwg.mongodb.net/CreditCardManager', { useNewUrlParser: true, useUnifiedTopology: true });

const CreditCardSchema = new mongoose.Schema({
  person: String, // new field
  name: String,
  balance: Number,
  apr: Number
});

const CreditCard = mongoose.model('CreditCard', CreditCardSchema);


app.post('/:person/add', async (req, res) => {
  try {
    const newCardData = {
      ...req.body,
      person: req.params.person
    };
    const newCard = new CreditCard(newCardData);
    await newCard.save();
    res.send('Card Added');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get all cards for a person
app.get('/:person/cards', async (req, res) => {
  const cards = await CreditCard.find({ person: req.params.person });
  res.json(cards);
});

// Edit a card for a person
app.put('/:person/edit/:id', async (req, res) => {
  await CreditCard.findOneAndUpdate({ _id: req.params.id, person: req.params.person }, req.body);
  res.send('Card Updated');
});

// Delete a card for a person
app.delete('/:person/delete/:id', async (req, res) => {
  await CreditCard.findOneAndDelete({ _id: req.params.id, person: req.params.person });
  res.send('Card Deleted');
});

// Make a payment on a card for a person
app.post('/:person/payment/:id', async (req, res) => {
  const card = await CreditCard.findOne({ _id: req.params.id, person: req.params.person });
  if (card) {
    card.balance -= req.body.amount;
    await card.save();
    res.send('Payment made');
  } else {
    res.status(404).send('Card not found');
  }
});
// Start Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
