// import { useState, useRef, useEffect } from 'react';
// import { MdSend } from 'react-icons/md';
// import { FaRobot, FaUser } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import { useMentalHealth } from '../../context/MentalHealthContext';
// import Chatbot from '../../components/Chatbot/Chatbot';
// import './ChatInterface.css';
// import { auth } from "../../firebase/auth";
// import { saveChatHistory, saveChatMood } from "../../firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// const ChatInterface = () => {

//     // const [user, setUser] = useState(null);
//     // useEffect(() => { 
//     //    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => { 
//     //     setUser(firebaseUser); 
//     //    }); 
//     //     return () => unsubscribe(); 
//     //    }, []);
//   const user = auth.currentUser;

//   const { addChatMessage, analyzeSentiment, chatHistory, crisisLevel } = useMentalHealth();
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your AI mental health companion. I'm here to listen and support you. How are you feeling today?",
//       sender: 'bot',
//       timestamp: new Date().toISOString()
//     }
//   ]);
//   const chatBoxRef = useRef(null);

//   // Simple sentiment analysis function
//   const analyzeMessageSentiment = (text) => {
//     const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'joy', 'love', 'excited', 'grateful'];
//     const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'angry', 'frustrated', 'anxious', 'depressed', 'lonely', 'hopeless'];
//     const crisisWords = ['suicide', 'kill myself', 'want to die', 'end it all', 'no reason to live', 'better off dead'];
    
//     const lowerText = text.toLowerCase();
//     let score = 0;
    
//     // Check for crisis words first
//     if (crisisWords.some(word => lowerText.includes(word))) {
//       return -1.0; // Critical negative sentiment
//     }
    
//     // Count positive and negative words
//     positiveWords.forEach(word => {
//       if (lowerText.includes(word)) score += 0.2;
//     });
    
//     negativeWords.forEach(word => {
//       if (lowerText.includes(word)) score -= 0.3;
//     });
    
//     // Normalize score between -1 and 1
//     return Math.max(-1, Math.min(1, score));
//   };

//   // AI response generation (simplified version)
//   const generateAIResponse = (userMessage, sentiment) => {
//     const responses = {
//       positive: [
//         "That's wonderful to hear! Your positive energy is contagious. What's contributing to your good mood today?",
//         "I'm so glad you're feeling good! It's important to celebrate these moments. Is there anything specific that's making you happy?",
//         "Your positivity is inspiring! Keep embracing those good feelings. What would you like to focus on today?"
//       ],
//       neutral: [
//         "I hear you. Sometimes it's okay to just be. How are you taking care of yourself today?",
//         "Thank you for sharing that with me. What's on your mind right now?",
//         "I'm here to listen. Is there anything specific you'd like to talk about?"
//       ],
//       negative: [
//         "I'm sorry you're going through a difficult time. Your feelings are valid, and I'm here to listen. Can you tell me more about what's happening?",
//         "It sounds like you're really struggling right now. That must be really hard. What's been the most challenging part?",
//         "I hear the pain in your words. You don't have to go through this alone. What would be most helpful for you right now?"
//       ],
//       crisis: [
//         "I'm very concerned about what you're saying. Your life has value, and there are people who care about you. Please reach out to a crisis helpline right now.",
//         "This sounds like a crisis situation. Please call the National Suicide Prevention Lifeline at 988 or text HOME to 741741 to reach the Crisis Text Line.",
//         "I want you to know that you're not alone, and there is help available. Please talk to someone you trust or call a crisis helpline immediately."
//       ]
//     };

//     let category = 'neutral';
//     if (sentiment <= -0.8) category = 'crisis';
//     else if (sentiment <= -0.2) category = 'negative';
//     else if (sentiment >= 0.2) category = 'positive';

//     const categoryResponses = responses[category];
//     return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
//   };

  // const sendMessage = async () => {
  //   const userMsg = inputMessage.trim();
  //   if (!userMsg) return;

  //   // Add user message
  //   const userMessageObj = {
  //     id: Date.now(),
  //     text: userMsg,
  //     sender: 'user',
  //     timestamp: new Date().toISOString()
  //   };

  //   setMessages(prev => [...prev, userMessageObj]);
  //   /*addChatMessage({
  //     message: userMsg,
  //     sender: 'user',
  //     sentiment: 0
  //   });*/

  //   setInputMessage('');

  //   setIsTyping(true);

  //   // Analyze sentiment
  //   const sentiment = analyzeMessageSentiment(userMsg);
  //   analyzeSentiment(sentiment);

  //   // Simulate AI response delay
  //   setTimeout(() => {
  //     const aiResponse = generateAIResponse(userMsg, sentiment);
      
  //     const botMessageObj = {
  //       id: Date.now() + 1,
  //       text: aiResponse,
  //       sender: 'bot',
  //       timestamp: new Date().toISOString()
  //     };

  //     setMessages(prev => [...prev, botMessageObj]);
  //     addChatMessage({
  //       message: aiResponse,
  //       sender: 'bot',
  //       sentiment: sentiment
  //     });

  //     setIsTyping(false);
  //   }, 1500);
  // };
  
  
  
  
  
//   const sendMessage = async () => {
//     const userMsg = inputMessage.trim();
//     if (!userMsg) return;
  
//     // Add user message locally
//     const userMessageObj = {
//       id: Date.now(),
//       text: userMsg,
//       sender: "user",
//       timestamp: new Date().toISOString(),
//     };
  
//     setMessages((prev) => [...prev, userMessageObj]);
//     setInputMessage("");
//     setIsTyping(true);
  
//     // Analyze sentiment
//     const sentiment = analyzeMessageSentiment(userMsg);
//     analyzeSentiment(sentiment);
  
//     try {
//       if (user?.email) {
//         // Save user message into Chat History
//         await saveChatHistory(user.email, "General Chat", userMsg);
  
//         // Save mood entry based on sentiment
//         await saveChatMood(user.email, sentiment);
  
//         console.log("✅ Chat + sentiment saved to Firestore");
//       }
//     } catch (err) {
//       console.error("❌ Firestore save error:", err);
//     }
  
//     // Simulate AI response delay
//     setTimeout(async () => {
//       const aiResponse = generateAIResponse(userMsg, sentiment);
  
//       const botMessageObj = {
//         id: Date.now() + 1,
//         text: aiResponse,
//         sender: "bot",
//         timestamp: new Date().toISOString(),
//       };
  
//       setMessages((prev) => [...prev, botMessageObj]);
  
//       addChatMessage({
//         message: aiResponse,
//         sender: "bot",
//         sentiment: sentiment,
//       });
  
//       try {
//         if (user?.email) {
//           // Save bot response to Chat History as well
//           await saveChatHistory(user.email, "General Chat", aiResponse);
//         }
//       } catch (err) {
//         console.error("❌ Error saving bot reply:", err);
//       }
  
// //
// try {
//   const email = user?.email || "test@example.com"; // ✅ fallback
//   await saveChatHistory(email, "General Chat", aiResponse);
// } catch (err) {
//   console.error("❌ Error saving bot reply:", err);
// }
// //

//       setIsTyping(false);
//     }, 1500);
//   };
  

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const formatText = (text) => {
//     // Split into lines to handle line-based ###heading behavior
//     const lines = text.split('\n').map(line => {
//       // Line starts with ### but does NOT end with ###
//       if (line.startsWith("###") && !line.endsWith("###")) {
//         return `<div style="font-size: 20px; font-weight: bold; margin: 6px 0;">${line.replace(/^###\s*/, '')}</div>`;
//       }
//       // Inline ###text### -> large bold
//       line = line.replace(/###(.*?)###/g, '<strong style="font-size: 18px;">$1</strong>');
//       // Inline **text** -> bold
//       line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//       return line;
//     });
//     return lines.join('<br>');
//   };

//   return (
//     <div className="chat-interface">
//       <div className="chat-header">
//         <h1>AI Therapist Chat</h1>
//         <p>Share your thoughts and feelings with our AI mental health assistant</p>
        
//         {crisisLevel >= 8 && (
//           <div className="crisis-alert">
//             <Link to="/crisis-support" className="crisis-link">
//               ⚠️ Would you like to access crisis support resources?
//             </Link>
//           </div>
//         )}
//       </div>

//       <Chatbot />
//     </div>
//   );
// };

// export default ChatInterface;
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMentalHealth } from "../../context/MentalHealthContext";
import Chatbot from "../../components/Chatbot/Chatbot";
import "./ChatInterface.css";
import { auth } from "../../firebase/auth";
import { saveChatHistory, saveChatMood } from "../../firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Hugging Face
import { pipeline } from "@xenova/transformers";

// Cache HF model globally
let sentimentAnalysis = null;
const loadSentimentModel = async () => {
  if (!sentimentAnalysis) {
    sentimentAnalysis = await pipeline(
      "sentiment-analysis",
      "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
    );
  }
  return sentimentAnalysis;
};

const analyzeWithHF = async (text) => {
  const model = await loadSentimentModel();
  const result = await model(text);
  console.log("🔎 Hugging Face Sentiment:", result);
  return result[0]; // {label, score}
};

const ChatInterface = () => {
  const [user, setUser] = useState(null);
  const { addChatMessage, analyzeSentiment, crisisLevel } = useMentalHealth();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI mental health companion. I'm here to listen and support you. How are you feeling today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
  ]);
  const chatBoxRef = useRef(null);

  // Monitor Firebase auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Generate AI response (simple rules)
  const generateAIResponse = (userMessage, sentiment) => {
    const responses = {
      positive: [
        "That's wonderful to hear! 🌟 What's contributing to your good mood today?",
        "I'm so glad you're feeling good! 😊 Anything specific making you happy?",
        "Your positivity is inspiring! Keep embracing those feelings 💖",
      ],
      neutral: [
        "I hear you. Sometimes it's okay to just be. 🌱",
        "Thanks for sharing that. What's on your mind right now?",
        "I'm here to listen. Is there anything you'd like to talk about?",
      ],
      negative: [
        "I'm sorry you're going through a difficult time. 💙 I'm here to listen.",
        "That sounds really tough. What’s been the hardest part for you?",
        "I hear the pain in your words. You're not alone 💜",
      ],
      crisis: [
        "I'm very concerned by what you're saying. 💔 Please call a crisis helpline immediately.",
        "This sounds serious. Dial 988 (Suicide Prevention Lifeline) or text HOME to 741741.",
        "Your life has value. Please reach out to someone you trust right now 🙏",
      ],
    };

    let category = "neutral";
    if (sentiment <= -0.8) category = "crisis";
    else if (sentiment <= -0.2) category = "negative";
    else if (sentiment >= 0.2) category = "positive";

    const categoryResponses = responses[category];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const sendMessage = async () => {
    const userMsg = inputMessage.trim();
    if (!userMsg) return;

    // Add user message locally
    const userMessageObj = {
      id: Date.now(),
      text: userMsg,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessageObj]);
    setInputMessage("");
    setIsTyping(true);

    // Analyze with Hugging Face
    const sentimentResult = await analyzeWithHF(userMsg);
    const sentiment =
      sentimentResult.label === "POSITIVE" ? sentimentResult.score : -sentimentResult.score;

    analyzeSentiment(sentiment);

    try {
      if (user?.uid) {
        await saveChatHistory(user.uid, "General Chat", userMsg);
        await saveChatMood(user.uid, sentiment);
        console.log("✅ Chat + sentiment saved to Firestore");
      }
    } catch (err) {
      console.error("❌ Firestore save error:", err);
    }

    // AI response
    setTimeout(async () => {
      const aiResponse = generateAIResponse(userMsg, sentiment);
      const botMessageObj = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessageObj]);

      addChatMessage({
        message: aiResponse,
        sender: "bot",
        sentiment: sentiment,
      });

      try {
        if (user?.uid) {
          await saveChatHistory(user.uid, "General Chat", aiResponse);
        }
      } catch (err) {
        console.error("❌ Error saving bot reply:", err);
      }

      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h1>AI Therapist Chat</h1>
        <p>Share your thoughts and feelings with our AI mental health assistant</p>

        {crisisLevel >= 8 && (
          <div className="crisis-alert">
            <Link to="/crisis-support" className="crisis-link">
              ⚠️ Would you like to access crisis support resources?
            </Link>
          </div>
        )}
      </div>

      <Chatbot />
    </div>
  );
};

export default ChatInterface;
