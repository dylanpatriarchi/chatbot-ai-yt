import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import './ChatWidget.css';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-window-container">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}
      
      <button 
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget; 