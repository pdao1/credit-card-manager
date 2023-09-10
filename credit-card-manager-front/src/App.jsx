import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import PersonDashboard from './components/PersonDashboard';  // Import this component from its file
import MainPage from './components/MainPage';

function App() {
  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<MainPage />} />
        <Route path="/:person" element={<PersonDashboard />} />
      </Routes>
    </Router>
  );
}


export default App;
