import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const navigate = useNavigate();

  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleButtonClick = () => {
    const randomString = generateRandomString(12);
    navigate(`/${randomString}`);
  };

  return (
    <div className="container">
		<button className="btn btn-primary" onClick={handleButtonClick}>Generate Page</button>
    </div>
  );
};

export default MainPage;
