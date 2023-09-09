import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import PersonDashboard from './components/PersonDashboard';  // Import this component from its file

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:person" element={<PersonDashboard />} />
      </Routes>
    </Router>
  );
}


export default App;
