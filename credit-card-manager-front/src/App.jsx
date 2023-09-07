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
    const response = await axios.get('http://localhost:3000/cards');
    setCards(response.data);
  };

  const addCard = async () => {
    await axios.post('http://localhost:3000/add', { name, balance, apr });
    fetchCards();
  };

  const editCard = async () => {
    await axios.put(`http://localhost:3000/edit/${editCardId}`, {
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
      await axios.delete(`http://localhost:3000/delete/${cardId}`);
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
      return "Calculation not feasible within reasonable time";
    }
    
    return months;
  };
  

  const addPayment = async (cardId, currentBalance) => {
    const newBalance = currentBalance - paymentAmount;
    await axios.put(`http://localhost:3000/edit/${cardId}`, {
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
    <div className="container mx-auto p-4">
      <div className="container" id="add-card">
      <h1 className="text-4xl mb-4">Credit Card Tracker</h1>
      {/* Add New Card Form */}
      <div className="row">
       <div className="col"> <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} className="border p-2 m-4" /></div>
       <div className="col"> <input type="text" placeholder="Balance" onChange={(e) => setBalance(e.target.value)} className="border p-2 m-4" /></div>
       <div className="col"> <input type="text" placeholder="APR" onChange={(e) => setApr(e.target.value)} className="border p-2 m-4" /></div>
        <button onClick={addCard} className="bg-blue-500 text-white p-2 rounded">Add Card</button>
      </div>  
    </div>

  <ul>
    
  {cards.map((card) => (
    <li key={card._id}>
      {card.name} - {card.balance} - {card.apr}%
      <button onClick={() => setEditCardId(card._id)} className="ml-4 text-blue-500">Edit</button>
      <button onClick={() => addPayment(card._id, card.balance)} className="ml-4 text-green-500">Make Payment</button>
      <button onClick={() => deleteCard(card._id)} className="ml-4 text-red-500">Delete</button>
      
      <div className="inline-block">
        <input
          type="text"
          placeholder="Payment Amount"
          onChange={(e) => setPaymentAmount(e.target.value)}
          onKeyUp={() => fetchCards()}
          className="border p-2 mr-2"
        /><br/>
        <span className="ml-4">
          Hypothetical Payoff Periods: {calculatePayoffPeriods(card.balance, card.apr, parseFloat(paymentAmount) || 0)} months
        </span>
      </div>
    </li>
  ))}
</ul>



      {/* Display Payment Log */}
      <div>
        <h2>Payment Log</h2>
        {Object.keys(paymentLog).map((cardId) => (
          <div key={cardId}>
            <h3>{cards.find((card) => card._id === cardId)?.name}</h3>
            <ul>
              {paymentLog[cardId].map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
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
