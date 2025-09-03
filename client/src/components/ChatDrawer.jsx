import React, { useState, useEffect, useRef } from "react";
import socket from "../socket";

const ChatDrawer = ({ open, onClose, roomId, user, peerName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!open || !roomId) return;
    socket.connect();
    socket.emit("joinRoom", roomId);
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("chatMessage");
      socket.disconnect();
    };
  }, [open, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = { roomId, message: input, sender: user.name };
    setMessages((prev) => [...prev, msg]);
    socket.emit("chatMessage", msg);
    setInput("");
  };

  if (!open) return null;
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <span className="text-white font-bold">Chat with {peerName}</span>
        <button onClick={onClose} className="text-white">
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm ${
              msg.sender === user.name
                ? "text-blue-300 text-right"
                : "text-green-300 text-left"
            }`}
          >
            <span className="font-bold">{msg.sender}: </span>
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={sendMessage}
        className="p-4 border-t border-gray-700 flex"
      >
        <input
          className="flex-1 rounded-l px-2 py-1 bg-gray-800 text-white border-none outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 px-4 py-1 rounded-r text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatDrawer;
