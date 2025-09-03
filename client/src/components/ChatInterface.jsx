import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import socket from '../socket';

const ChatInterface = ({ 
  isOpen, 
  onClose, 
  appointmentId, 
  otherUser, 
  currentUser 
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen || !appointmentId) return;

    // Connect to socket
    socket.connect();
    
    // Join the appointment room
    socket.emit('joinRoom', appointmentId);
    
    // Listen for connection status
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for incoming messages
    socket.on('chatMessage', (messageData) => {
      setMessages(prev => [...prev, {
        ...messageData,
        timestamp: new Date(),
        id: Date.now() + Math.random()
      }]);
    });

    // Cleanup on unmount or close
    return () => {
      socket.off('chatMessage');
      socket.off('connect');
      socket.off('disconnect');
      if (isOpen) {
        socket.emit('leaveRoom', appointmentId);
      }
      socket.disconnect();
    };
  }, [isOpen, appointmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    const messageData = {
      roomId: appointmentId,
      message: newMessage.trim(),
      sender: {
        id: user.id,
        name: user.name,
        role: user.role
      },
      timestamp: new Date()
    };

    // Add message to local state immediately
    setMessages(prev => [...prev, {
      ...messageData,
      id: Date.now() + Math.random()
    }]);

    // Emit to other users in the room
    socket.emit('chatMessage', messageData);
    
    setNewMessage('');
  };

  const handleClose = () => {
    socket.emit('leaveRoom', appointmentId);
    socket.disconnect();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed right-4 top-20 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="glass-morphism h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white border-opacity-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-300" />
            <div>
              <h3 className="text-white font-semibold text-sm">
                Chat with {otherUser?.name}
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-xs text-gray-300">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={handleClose}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-300 text-sm mt-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Start your conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender.id === user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.sender.id === user.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white bg-opacity-20 text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="text-xs font-medium">
                          {message.sender.name}
                        </span>
                        <span className={`text-xs px-1 py-0.5 rounded ${
                          message.sender.role === 'teacher' 
                            ? 'bg-purple-500 bg-opacity-50' 
                            : 'bg-green-500 bg-opacity-50'
                        }`}>
                          {message.sender.role}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white border-opacity-20">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-white bg-opacity-20 text-white placeholder-gray-300 px-3 py-2 rounded-lg border border-white border-opacity-30 focus:outline-none focus:border-blue-400"
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;