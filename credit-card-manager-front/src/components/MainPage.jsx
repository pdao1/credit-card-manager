import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  // Removed navigate to use window.location instead for external URLs

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
    window.location.href = `https://notyoursandbox.com/${randomString}`;
    // If you want to open this in a new tab, you could use window.open() instead
    // window.open(`https://notyoursandbox.com/${randomString}`, '_blank');
  };

  return (
    <div className="container">
      <p className="pt-5 px-2">Hit Generate Page to create a randomly-generated unique instance.  Be sure to SAVE the generated URL to return to manage your cards.</p>
      <button className="btn btn-primary" id="generate-id" onClick={handleButtonClick}>Generate Page</button>
    </div>
  );
};

export default MainPage;
