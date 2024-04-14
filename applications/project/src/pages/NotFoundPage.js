import React from 'react';

const NotFoundPage = () => {
  const containerStyle = {
    textAlign: 'center',
    marginTop: '2rem',
  };

  const titleStyle = {
    fontSize: '10rem',
    fontWeight: 'bold',
  };

  const messageStyle = {
    fontSize: '5rem',
    marginTop: '1rem',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>404 Not Found</h1>
      <p style={messageStyle}>Are you searching for the right page?</p>
    </div>
  );
};

export default NotFoundPage;