# embedded_bot
# Chatbot Integration Project

## Overview
This project is aimed at integrating a chatbot using the TIXAE platform into a WordPress site, allowing users to communicate with a bot seamlessly on the frontend UI. The chatbot is controlled using a Node.js backend that handles user messages and relays them to the TIXAE API, maintaining conversation state.

## How It Works
- **Frontend (WordPress)**: Users interact with the chatbot via a custom chat UI implemented on the WordPress frontend.
- **Backend (Node.js)**: Messages from users are sent to the Node.js server. The server processes these messages and interacts with the TIXAE API to generate appropriate responses.
- **Conversation State**: The Node.js app keeps track of ongoing conversations for each user to maintain continuity. This is currently handled with in-memory storage.
- **TIXAE API**: The Node.js server uses the TIXAE API to relay user messages and receive bot responses.

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file containing your TIXAE API key and agent ID.
4. Start the server with `npm start`.
5. Use the endpoint `/chat` to interact with the chatbot by sending POST requests with the user message and user ID.

## Current Issues
- **No Proper Response**: Currently, the bot only returns either no response or the initial welcome message repeatedly. This suggests issues in managing the conversation state effectively with TIXAE.
- **Conversation Flow**: The bot appears to restart the conversation each time a new message is sent, despite attempts to maintain session persistence.

## Potential Improvements
- **Persistent Storage**: Replace in-memory conversation storage with a database to enhance state management.
- **API Integration Fixes**: Review the TIXAE API documentation to refine the message format or action type being sent to ensure proper responses are received.





# Frontend HTML and js sample code (html code block wordpress)
```<div id="chat-container">
  <div id="chat-output"></div>
  <input type="text" id="user-input" placeholder="Type your message...">
  <button id="send-btn">Send</button>
</div>

<script>
  // Hardcoded user ID for testing purposes
  let userId = 'fixed-user-123';

  document.getElementById('send-btn').addEventListener('click', async () => {
    const userMessage = document.getElementById('user-input').value;

    try {
      const response = await fetch('https://5000-dylankane-embeddedbot-9s4p8gj1p5n.ws-eu116.gitpod.io/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage, userId: userId })
      });

      const responseData = await response.json();
      const botReply = responseData.turns?.[0]?.messages?.[0]?.item?.payload?.message || 'No response from bot';

      // Display user message and bot reply
      const chatOutput = document.getElementById('chat-output');
      chatOutput.innerHTML += `<div class="user-message">${userMessage}</div>`;
      chatOutput.innerHTML += `<div class="bot-message">${botReply}</div>`;

      // Clear input
      document.getElementById('user-input').value = '';
    } catch (error) {
      console.error('Error:', error);
    }
  });
</script>

<style>
  #chat-container {
    max-width: 900px;
    margin: 20px auto;
    padding: 20px;
    border: 0px solid #ccc;
    border-radius: 10px;
  }
  #chat-output {
    height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
  }
  .user-message {
    text-align: right;
    margin: 5px;
    color: blue;
  }
  .bot-message {
    text-align: left;
    margin: 5px;
    color: green;
  }
</style>```