// Import dependencies
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// In-memory storage for conversation state (replace with a persistent solution in production)
const conversations = {};

// Create endpoint to handle chat messages
app.post('/chat', async (req, res) => {
  console.log('TIXAE API Key:', process.env.TIXAE_API_KEY);
  try {
    const userMessage = req.body.message;
    const agentId = process.env.TIXAE_AGENT_ID;
    const userId = req.body.userId || 'user-123';

    // Fetch existing conversation or create a new one
    let conversation = conversations[userId] || [];

    // Append the user's message
    conversation.push({ sender: 'user', text: userMessage });

    // Determine action type based on conversation state
    const actionType = conversation.length === 1 ? 'launch' : 'continue';

    // Construct request payload based on TIXAE documentation
    const requestPayload = {
      action: { type: actionType },
      appendMessages: [{ type: 'text', text: userMessage }],
      metadata: { sessionId: userId } // Maintain consistent session
    };

    console.log('Constructed URL:', `https://na-vg-edge.moeaymandev.workers.dev/agents/${agentId}/interact/${userId}`);
    const response = await axios.post(`https://na-vg-edge.moeaymandev.workers.dev/agents/${agentId}/interact/${userId}`, requestPayload, {
      headers: {
        'Authorization': `Bearer ${process.env.TIXAE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Log the full response for debugging
    console.log('Full TIXAE Response:', JSON.stringify(response.data, null, 2));

    // Extract the bot's response message
    let botReply = 'No response from bot';
    if (response.data.turns && response.data.turns.length > 0) {
      const lastTurn = response.data.turns[response.data.turns.length - 1];
      if (lastTurn && lastTurn.messages && lastTurn.messages.length > 0) {
        const botMessage = lastTurn.messages[0]?.item?.payload?.message;
        if (botMessage) {
          botReply = botMessage;
        }
      }
    }

    // Append the bot's reply to the conversation
    conversation.push({ sender: 'bot', text: botReply });

    // Update the conversation state
    conversations[userId] = conversation;

    res.json({ botReply });
  } catch (error) {
    console.error('Error interacting with TIXAE:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error interacting with TIXAE', details: error.message });
  }
});

// Set up server to listen on defined port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
