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

// Schema and Model
const creditCardSchema = new mongoose.Schema({
  name: String,
  balance: Number,
  apr: Number
});

const CreditCard = mongoose.model('CreditCard', creditCardSchema);

// Routes
app.post('/add', async (req, res) => {
  const newCard = new CreditCard(req.body);
  await newCard.save();
  res.send('Card Added');
});

app.get('/cards', async (req, res) => {
  const cards = await CreditCard.find();
  res.json(cards);
});

app.put('/edit/:id', async (req, res) => {
  await CreditCard.findByIdAndUpdate(req.params.id, req.body);
  res.send('Card Updated');
});

app.delete('/delete/:id', async (req, res) => {
  await CreditCard.findByIdAndDelete(req.params.id);
  res.send('Card Deleted');
});

app.post('/payment/:id', async (req, res) => {
  const card = await CreditCard.findById(req.params.id);
  card.balance -= req.body.amount;
  await card.save();
  res.send('Payment made');
});

// Start Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
