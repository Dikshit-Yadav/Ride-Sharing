import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import API from '../services/api';
import '../style/Chat.css';

const socket = io('http://localhost:4550');

function Chat() {
  const { userId: recipientId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (user && recipientId) {
        try {
          const res = await API.get(`/chat/${recipientId}`, { withCredentials: true });
          setMessages(res.data);
        } catch (err) {
          console.error("Failed to fetch messages", err);
        }
      }
    };
    fetchMessages();
  }, [user, recipientId]);

  useEffect(() => {
    if (user) {
      socket.emit('join', user._id);

      socket.on('message', (message) => {
        console.log('Received message:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.emit('leaveRoom', user._id);
        socket.off('message');
      };
    }
  }, [user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message && user) {
      const msg = { message, sender: user._id, recipient: recipientId };
      socket.emit('chatMessage', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
      setMessage('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">Chat with User <strong>{recipientId}</strong> </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === user?._id ? 'sent' : 'received'}`}
            >
              {/* <p><strong>{user.name}:</strong> {msg.message}</p> */}
              <p>
                {msg.sender !== user?._id && <strong>{user.name}</strong>} {msg.message}
              </p>
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default Chat;