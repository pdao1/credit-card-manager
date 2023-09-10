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
      <sub className="pt-5 px-2">Hit the Generate button below to create a randomly-generated, unique instance ID. <br/>
       <strong>IMPORTANT:</strong>Be sure to SAVE the generated URL to return to your saved instance to continue managing your cards.</sub>
      <button className="btn btn-secondary" id="generate-id" onClick={handleButtonClick}>Generate a Unique Instance ID to Begin.</button>
    </div>
  );
};

export default MainPage;
