import React from 'react';

const VideoActions = () => {
  return (
    <div style={actionsContainerStyle}>
      <button style={actionButtonStyle}>👍</button>
      <button style={actionButtonStyle}>👎</button>
      <button style={actionButtonStyle}>💬</button>
      <button style={actionButtonStyle}>🔗</button>
    </div>
  );
};

const actionsContainerStyle = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const actionButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  margin: '10px 0',
  cursor: 'pointer',
  color: 'white',
};

export default VideoActions;
