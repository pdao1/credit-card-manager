import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../index.css';
// ... other imports
import { ChromePicker } from 'react-color';  // import a color picker, you can install it via npm

const PersonDashboard = () => {
  const { person } = useParams();  // Get the person from the URL
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
  const [cardColor, setCardColor] = useState('#ffffff'); // new state for cardColor
  const [editCardColor, setEditCardColor] = useState('#ffffff'); // default to white


  const calculateTotalInterestPaid = (balance, apr, paymentAmount, periods) => {
    let totalInterestPaid = 0;
    let remainingBalance = parseFloat(balance);
    let monthlyRate = apr / 100 / 12;
  
    for (let i = 0; i < periods; i++) {
      let interestPayment = remainingBalance * monthlyRate;
      let principalPayment = paymentAmount - interestPayment;
  
      if (principalPayment > remainingBalance) {
        principalPayment = remainingBalance;
        interestPayment = 0;
      }
  
      totalInterestPaid += interestPayment;
      remainingBalance -= principalPayment;
    }
  
    return totalInterestPaid;
  };  
  const fetchCards = useCallback(async () => {
    const response = await axios.get(`https://credit-card-manager-backend.onrender.com/${person}/cards`);
    setCards(response.data);
  }, [person]);
  
  const addCard = async () => {
    await axios.post(`https://credit-card-manager-backend.onrender.com/${person}/add`, { person, name, balance, apr });
    fetchCards();
  };
  
  const editCard = async () => {
    await axios.put(`https://credit-card-manager-backend.onrender.com/${person}/edit/${editCardId}`, {
      person,
      name: editName,
      balance: editBalance,
      apr: editApr,
      cardColor: editCardColor  // include cardColor
    });
    setEditCardId(null);
    fetchCards();
  };
  
  const deleteCard = async (cardId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this card?");
    if (confirmDelete) {
      await axios.delete(`https://credit-card-manager-backend.onrender.com/${person}/delete/${cardId}`);
      fetchCards();
    }
  };
  
  const addPayment = async (cardId, currentBalance) => {
    const newBalance = currentBalance - paymentAmount;
    await axios.post(`https://credit-card-manager-backend.onrender.com/${person}/payment/${cardId}`, {
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
  
  // Fetch cards when the component mounts or the person changes
  useEffect(() => {
    fetchCards();  // Call the existing function directly
  }, [fetchCards]);  // fetchCards is now the only dependency

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
      return "\u221E";
    }
    
    return months;
  };

  const handleColorChange = (color) => {
    setCardColor(color.hex);
  };

  return (
    <div className="container mx-2 p-4">
      <div className="container my-2 py-2" id="add-card">
        <span className="text-slate-500 font-bold">Add Card</span>
      {/* Add New Card Form */}
      <div className="row">
       <div className="col"> <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} className="border p-2 mt-2 mb-4 mx-4 bg-white border-gray rounded text-black drop-shadow-xl" /></div>
       <div className="col"> <input type="text" placeholder="Balance" onChange={(e) => setBalance(e.target.value)} className="border p-2 m-4 my-4 bg-white border-gray rounded text-black drop-shadow-xl" /></div>
       <div className="col"> <input type="text" placeholder="APR" onChange={(e) => setApr(e.target.value)} className="border p-2 m-2 my-4 bg-white border-gray rounded text-black drop-shadow-xl" /></div>
       <div className="col"><input 
          type="color" 
          value={cardColor}
          onChange={(e) => setCardColor(e.target.value)} 
          className="border p-2 m-4 my-4 bg-white border-gray rounded text-black drop-shadow-xl"
        />
        {/* <ChromePicker 
            color={cardColor} 
            onChange={handleColorChange}
          /> */}
          </div>
        <button onClick={addCard} className="btn btn-secondary rounded drop-shadow-xl mb-5">Add Card</button>
      </div>  
    </div>
    <hr/>
    <div className="container cards mx-auto">
        <div className="row">
          {cards.map((card) => (
            <div 
              key={card._id} 
              className="card w-100 mx-auto glass mb-6 drop-shadow-lg border-gray" 
              style={{backgroundColor: card.cardColor}}>
    <div className="card-body">
    <div className="credit-card-chip">
      <div className="chip-row">
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
      </div>
      <div className="chip-row">
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
      </div>
      <div className="chip-row">
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
      </div>
      <div className="chip-row">
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
        <div className="chip-cell"></div>
      </div>
    </div>
    <strong className="my-1">{card.name}</strong><br/>
    <div className="row">  
    <span className="mx-3 my-3 py-3"><strong>Balance: </strong>${card.balance} </span>
    <span className="mx-3 my-3 py-3"><strong>APR: </strong>{card.apr}%
    </span>
    </div>
  </div>
  
  <div className="block">
    <input
    type="text"
    placeholder="Payment Amount"
    onChange={(e) => setPaymentAmount(e.target.value)}
    onKeyUp={() => fetchCards()}
    className="border p-2 m-4 my-4 bg-white border-gray rounded text-black drop-shadow-xl"
  /><br/>
  <p className="ml-4 mt-2 pt-2">Payoff Periods: {calculatePayoffPeriods(card.balance, card.apr, parseFloat(paymentAmount) || 0)} months
  </p>
  <p className="ml-4 mt-1 pt-1">Total Interest Paid: ${calculateTotalInterestPaid(card.balance, card.apr, parseFloat(paymentAmount) || 0, calculatePayoffPeriods(card.balance, card.apr, parseFloat(paymentAmount) || 0)).toFixed(2)}
  </p><br/>
   <div className="container pt-3 mt-3 mb-8">
      <button onClick={() => setEditCardId(card._id)} className="btn btn-primary mx-3">Edit</button>
      <button onClick={() => addPayment(card._id, card.balance)} className="btn btn-accent mx-3">Make Payment</button>
      <button onClick={() => deleteCard(card._id)} className="btn btn-warning bg-red-500 text-white mx-3">Delete</button>
      </div>
  
</div>
  </div>
))}
</div>
</div>

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

)}

export default PersonDashboard;
