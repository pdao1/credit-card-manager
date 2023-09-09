const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const session = require('express-session');
const path = require('path');

// Middleware
app.use(cors());  // use CORS middleware
app.use(bodyParser.json());
app.use(express.json());
// Connect to MongoDB
mongoose.connect('mongodb+srv://phung:Watacress1@phung.2yfqvwg.mongodb.net/CreditCardManager', { useNewUrlParser: true, useUnifiedTopology: true });


// Initialize session middleware
app.use(
  session({
    secret: 'your_secret',
    resave: false,
    saveUninitialized: true,
  })
);

// To serve the static files from React app
app.use(express.static(path.join(__dirname, './credit-card-manager-front/dist')));

// Serve the index.html for all routes for React Router to take over
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './credit-card-manager-front/dist', 'index.html'));
});



// Your routes and middleware
app.post('/phung/login', (req, res) => {
  const { password } = req.body;
  if (password === 'yourPasswordHere') {
    req.session.loggedIn = true;
    res.send('Logged in');
  } else {
    res.status(401).send('Unauthorized');
  }
});


const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};


// Use middleware in your routes
app.get('/phung', isAuthenticated, (req, res) => {
  res.send('Welcome, you are authenticated');
});

const CreditCardSchema = new mongoose.Schema({
  person: String, // new field
  name: String,
  balance: Number,
  apr: Number,
  cardColor: String
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
