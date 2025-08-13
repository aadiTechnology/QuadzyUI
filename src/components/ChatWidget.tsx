import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const ChatWidget: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, message]);
      setMessage('');
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 300,
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: 2,
        padding: 2,
        backgroundColor: 'white',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Chat Support
      </Typography>
      <Box
        sx={{
          maxHeight: 200,
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: 1,
          marginBottom: 1,
        }}
      >
        {chatHistory.map((msg, index) => (
          <Typography key={index} variant="body2">
            {msg}
          </Typography>
        ))}
      </Box>
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginTop: 1 }}>
        Send
      </Button>
    </Box>
  );
};

export default ChatWidget;