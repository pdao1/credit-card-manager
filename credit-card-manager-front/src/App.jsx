import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [cards, setCards] = useState([]);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [apr, setApr] = useState('');
  const [editCardId, setEditCardId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [editApr, setEditApr] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLog, setPaymentLog] = useState({});

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const response = await axios.get('https://credit-card-manager-backend.onrender.com/cards');
    setCards(response.data);
  };

  const addCard = async () => {
    await axios.post('https://credit-card-manager-backend.onrender.com/add', { name, balance, apr });
    fetchCards();
  };

  const editCard = async () => {
    await axios.put(`https://credit-card-manager-backend.onrender.com/edit/${editCardId}`, {
      name: editName,
      balance: editBalance,
      apr: editApr
    });
    setEditCardId(null);
    fetchCards();
  };

  const deleteCard = async (cardId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this card?");
    if (confirmDelete) {
      await axios.delete(`https://credit-card-manager-backend.onrender.com/delete/${cardId}`);
      fetchCards();
    }
  };

  const calculatePayoffPeriods = (balance, apr, payment) => {
    let months = 0;
    let remainingBalance = balance;
    const maxIterations = 1000; // or some other reasonable upper limit
    
    while (remainingBalance > 0 && months < maxIterations) {
      remainingBalance += remainingBalance * (apr / 100 / 12);  // Add monthly interest
      remainingBalance -= payment;  // Deduct payment
      if (remainingBalance <= 0) break;
      months++;
    }
  
    if (months >= maxIterations) {
      return "infinity";
    }
    
    return months;
  };
  

  const addPayment = async (cardId, currentBalance) => {
    const newBalance = currentBalance - paymentAmount;
    await axios.put(`https://credit-card-manager-backend.onrender.com/edit/${cardId}`, {
      balance: newBalance
    });
    fetchCards();

    // Update payment log
    if (!paymentLog[cardId]) {
      paymentLog[cardId] = [];
    }
    paymentLog[cardId].push(`Paid ${paymentAmount}, New balance: ${newBalance}`);
    setPaymentLog({ ...paymentLog });
  };
  
  return (
    <div className="container mx-2 p-4">
      <div className="container" id="add-card">
      <h1 className="text-4xl mb-4">Credit Card Tracker</h1>
      {/* Add New Card Form */}
      <div className="row">
       <div className="col"> <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} className="border p-2 m-4" /></div>
       <div className="col"> <input type="text" placeholder="Balance" onChange={(e) => setBalance(e.target.value)} className="border p-2 m-4" /></div>
       <div className="col"> <input type="text" placeholder="APR" onChange={(e) => setApr(e.target.value)} className="border p-2 m-4" /></div>
        <button onClick={addCard} className="bg-blue-500 text-white text-center rounded">Add Card</button>
      </div>  
    </div>

  <ul>
    
  {cards.map((card) => (
    <li key={card._id} className="cards">
      <strong>{card.name}</strong><br/>
      Balance: ${card.balance}<br/>
      {card.apr}%
      <div className="container pt-3 mt-3 mb-3">
      <button onClick={() => setEditCardId(card._id)} className="ml-4 text-blue-500">Edit</button>
      <button onClick={() => addPayment(card._id, card.balance)} className="ml-4 text-green-500">Make Payment</button>
      <button onClick={() => deleteCard(card._id)} className="ml-4 text-red-500">Delete</button>
      </div>
      <div className="block">
        <input
          type="text"
          placeholder="Payment Amount"
          onChange={(e) => setPaymentAmount(e.target.value)}
          onKeyUp={() => fetchCards()}
          className="border p-2 mr-2"
        /><br/> <p className="ml-4 mt-3 pt-3">Hypothetical Payoff Periods: {calculatePayoffPeriods(card.balance, card.apr, parseFloat(paymentAmount) || 0)} months
      </p><br/>
      
      </div>
    </li>
  ))}
</ul>
      {/* Display Payment Log */}
      <div className="container log">
        <h2>Payment Log</h2>
        {Object.keys(paymentLog).map((cardId) => (
          <div key={cardId} className="logItemName">
            <h3>{cards.find((card) => card._id === cardId)?.name}</h3>
       
              {paymentLog[cardId].map((log, index) => (
                <li key={index} className="logItem">{log}</li>
              ))}
         
          </div>
        ))}
      </div>
      {/* Edit Form */}
      {editCardId && (
        <div>
          <h2>Edit Card</h2>
          <input type="text" placeholder="Name" onChange={(e) => setEditName(e.target.value)} className="border p-2 mr-2" />
          <input type="text" placeholder="Balance" onChange={(e) => setEditBalance(e.target.value)} className="border p-2 mr-2" />
          <input type="text" placeholder="APR" onChange={(e) => setEditApr(e.target.value)} className="border p-2 mr-2" />
          <button onClick={editCard} className="bg-green-500 text-white p-2 rounded">Update</button>
          <button onClick={() => setEditCardId(null)} className="bg-red-500 text-white p-2 rounded ml-2">Cancel</button>
        </div>
        
      )}
    </div>
  );
}

export default App;
