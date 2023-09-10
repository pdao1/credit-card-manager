import React from 'react';


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
      <p className="py-4 px-4"><strong>Tap Generate below for a unique instance. </strong></p><br/>
      <button className="btn btn-secondary" id="generate-id" onClick={handleButtonClick}>GENERATE Unique Instance ID</button><br/>
      <hr/>
      <p className="py-4 px-4">You may also choose your own instance ID. <br/><sub>Minimum 8 characters, alphanumeric.</sub></p>
      <hr/>
      <p className="py-4 px-4 text-sm">Decide on the ID, then append it like this: <br/>https://notyoursandbox.com/<strong>DebtsAndShit382</strong></p>
      <p className="py-4 px-4 text-sm">Make it unique and unidentifiably linked to you. <br/>Instances are not indexed, crawled, or on sitemaps.</p>
      <hr/>
      <p className="py-4 px-4 text-sm">Only card nickname, amount, APR, card color, and uniqueID is stored.<strong> Payment logs/history do not get stored.</strong></p>
      <hr/>
      <p className="pt-4 mt-2 px-4"><strong>IMPORTANT</strong></p>
      <p className="pt-2 mt-2 px-4 text-sm">Be sure to SAVE/BOOKMARK the generated URL on the next page to return to your saved instance & continue managing your cards.</p><br/>
    </div>
  );
};

export default MainPage;
