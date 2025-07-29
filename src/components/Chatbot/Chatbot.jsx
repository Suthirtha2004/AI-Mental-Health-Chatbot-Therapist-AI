import React, { useEffect, useRef, useState } from "react";
import './Chatbot.css';

const Chatbot = () => {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const loadAI = async () => {
      const { GoogleGenAI } = await import("https://esm.run/@google/genai");
      const ai = new GoogleGenAI({
        apiKey: "AIzaSyBw7k7pjVfMs5zpUEAbVAJuvLxCNOVNoLk",
      });

      const chatInstance = await ai.chats.create({
        model: "gemini-2.5-flash",
        history: [
          {
            role: "model",
            parts: [
              {
                text: "You are a helpful mental health assistant. Answer in a friendly and empathetic way.",
              },
            ],
          },
        ],
      });

      setChat(chatInstance);
    };

    loadAI();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();

    setMessages((prev) => [...prev, { text: userMsg, sender: "user" }]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await chat.sendMessage({ message: userMsg });
      setMessages((prev) => [...prev, { text: response.text, sender: "bot" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "Oops! Something went wrong.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const formatText = (text) => {
    return text
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("###") && !line.endsWith("###")) {
          return `<div style="font-size: 20px; font-weight: bold; margin: 6px 0;">${line.replace(/^###\s*/, "")}</div>`;
        }
        line = line.replace(/###(.*?)###/g, '<strong style="font-size: 18px;">$1</strong>');
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return line;
      })
      .join("<br>");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.sender}`}
            dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
          />
        ))}
        {isTyping && (
          <div className="chat-bubble bot typing">Typing...</div>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button onClick={handleSend} disabled={!chat || isTyping}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
