import React, { useEffect, useRef, useState } from "react";
import "./Chatbot.css";
import { pipeline } from "@xenova/transformers"; // Hugging Face transformers.js
import { Link } from "react-router-dom"; // Using Link for suggestion buttons

const Chatbot = () => {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);
  const [sentimentAnalyzer, setSentimentAnalyzer] = useState(null);

  // Load Gemini
  useEffect(() => {
    const loadAI = async () => {
      const { GoogleGenerativeAI } = await import(
        "https://esm.run/@google/generative-ai"
      );
      // 🔑 IMPORTANT: Replace with your actual Gemini API key
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      setChat(model);
    };
    loadAI();
  }, []);

  // Load sentiment model
  useEffect(() => {
    const loadSentimentModel = async () => {
      const analyzer = await pipeline("sentiment-analysis");
      setSentimentAnalyzer(analyzer);
    };
    loadSentimentModel();
  }, []);

  // Analyze sentiment
  const analyzeSentiment = async (text) => {
    if (!sentimentAnalyzer) return null;
    const result = await sentimentAnalyzer(text);
    return result[0];
  };

  // Detect suicidal/self-harm thoughts
  const checkSuicidal = (text) => {
    const keywords = [
      // Direct suicide terms
      "suicide", "kill myself", "end my life", "want to die", "take my life",
      "end it all", "end everything", "end this", "end myself",
      
      // Self-harm and destructive thoughts
      "self harm", "cut myself", "hurt myself", "harm myself", "damage myself",
      "no reason to live", "life is not worth", "life isn't worth", "not worth living",
      "better off dead", "better off without me", "world better without me",
      
      // Hopelessness and giving up
      "give up", "give up on life", "tired of living", "sick of living", "done with life",
      "can't go on", "can't continue", "can't take it anymore", "can't handle it",
      "don't want to be here", "don't want to exist", "don't want to live",
      
      // Passive suicidal thoughts
      "wish I was dead", "wish I could die", "hope I die", "hope I don't wake up",
      "if I die", "if something happens to me", "accident wouldn't be so bad",
      "maybe I should just", "perhaps I should", "thinking about ending",
      
      // Specific methods (be careful with these)
      "overdose", "over dose", "take pills", "swallow pills", "jump off", "jump from",
      "hang myself", "hanging", "gun", "shoot myself", "drive off", "crash car",
      
      // Emotional expressions
      "life is meaningless", "no point in living", "what's the point", "why bother",
      "nobody would miss me", "everyone would be better off", "burden to others",
      "worthless", "useless", "hopeless", "helpless", "trapped", "stuck"
    ];
    
    const lower = text.toLowerCase();
    return keywords.some((word) => lower.includes(word));
  };

  // New function to catch general negative feelings
  const checkGeneralNegative = (text) => {
    const keywords = [
      'sad', 'unhappy', 'depressed', 'anxious', 'feeling down',
      'miserable', 'awful', 'terrible', 'stressed', 'lonely', 'hurting'
    ];
    const lower = text.toLowerCase();
    return keywords.some((word) => lower.includes(word));
  };

  // New function to detect positive/happy moods
  const checkPositiveMood = (text) => {
    const positiveKeywords = [
      'happy', 'excited', 'great', 'awesome', 'amazing', 'wonderful',
      'fantastic', 'brilliant', 'excellent', 'joy', 'pleased', 'delighted',
      'thrilled', 'ecstatic', 'elated', 'cheerful', 'upbeat', 'positive',
      'good', 'nice', 'lovely', 'beautiful', 'perfect', 'best', 'love',
      'enjoy', 'fun', 'laugh', 'smile', 'grin', '😊', '😄', '😂', '😍'
    ];
    const lower = text.toLowerCase();
    return positiveKeywords.some((word) => lower.includes(word));
  };

  // Conversational prompt wrapper
  const makePrompt = (recentMessages, sentiment) => {
    let mood = "";
    if (sentiment?.label === "POSITIVE") {
      mood = "The user sounds happy, so keep the energy fun and upbeat.";
    } else if (sentiment?.label === "NEGATIVE") {
      mood = "The user might be feeling low, so respond with empathy, comfort, and maybe a gentle suggestion.";
    } else {
      mood = "Use a casual, friendly tone like chatting with a close friend.";
    }
    const history = recentMessages
      .map((m) => `${m.sender === "user" ? "User" : "AI"}: "${m.text}"`)
      .join("\n");
    return `
You are an AI friend who talks casually (like WhatsApp chat).
- Don't sound like a formal bot.
- Keep replies **short-medium**, but not one-liners.
- Share **ideas or suggestions** sometimes.
- Ask a follow-up only occasionally.
${mood}
Conversation so far:
${history}
AI (casual, friendly reply to the last User message):
    `;
  };

  // Handle Send
  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();

    setMessages((prev) => [...prev, { text: userMsg, sender: "user" }]);
    setInputText("");
    setIsTyping(true);

    const sentiment = await analyzeSentiment(userMsg);
    const isCrisis = checkSuicidal(userMsg);
    const isGeneralNegative = checkGeneralNegative(userMsg);
    const isPositiveMood = checkPositiveMood(userMsg);

    try {
      if (!chat) throw new Error("Gemini model not ready");

      const recentMessages = [...messages, { text: userMsg, sender: "user" }].slice(-10);
      const prompt = makePrompt(recentMessages, sentiment);

      const response = await chat.generateContent(prompt);
      const botReply = response.response.text();

      const botMessage = {
        text: botReply,
        sender: "bot",
        suggestions: [],
      };
      
      if (isCrisis) {
        // For suicidal thoughts - only show crisis support
        botMessage.suggestions = [
          { label: "Get Crisis Support", path: "/crisis-support" },
        ];
      } else if (isGeneralNegative || sentiment?.label === "NEGATIVE") {
        // For other negative emotions - show all other buttons
        botMessage.suggestions = [
          { label: "Get Crisis Support", path: "/crisis-support" },
          { label: "Play Mini Games", path: "/mini-games" },
          { label: "Visit Virtual Plant", path: "/virtual-plant" },
          { label: "Track Your Goals", path: "/goal-tracker" },
          { label: "Read Daily Tips", path: "/daily-tips" },
        ];
      } else if (isPositiveMood || sentiment?.label === "POSITIVE") {
        // For positive emotions
        botMessage.suggestions = [
          { label: "Read Daily Tips", path: "/daily-tips" },
          { label: "Visit Virtual Plant", path: "/virtual-plant" },
          { label: "Track Your Goals", path: "/goal-tracker" },
        ];
      }

      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      console.error("Gemini error:", err);
      setMessages((prev) => [
        ...prev,
        { text: "Oops! Something went wrong with Gemini.", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- 💡 CORRECTED SECTION START ---
  // Auto scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      // Corrected the typo from chatBoxBoxRef to chatBoxRef
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  // --- 💡 CORRECTED SECTION END ---

  // Format output
  const formatText = (text) => {
    return text
      .split("\n")
      .map((line) => {
        if (line.startsWith("###") && !line.endsWith("###")) {
          return `<div style="font-size: 20px; font-weight: bold; margin: 6px 0;">${line.replace(
            /^###\s*/,
            ""
          )}</div>`;
        }
        line = line.replace(
          /###(.*?)###/g,
          '<strong style="font-size: 18px;">$1</strong>'
        );
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return line;
      })
      .join("<br>");
  };

  return (
    <div className="chat-wrapper">
      
      <div className="chat-container" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`chat-bubble ${msg.sender}`}
              dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
            />
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="suggestion-buttons">
                {msg.suggestions.map((suggestion, i) => (
                  <Link to={suggestion.path} key={i} className="suggestion-btn">
                    {suggestion.label}
                  </Link>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
        {isTyping && <div className="chat-bubble bot typing">Typing...</div>}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => { if (e.key === "Enter") handleSend(); }}
        />
        <button onClick={handleSend} disabled={!chat || isTyping}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;