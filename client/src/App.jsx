import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

function App() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setChat(prev => [...prev, userMessage]);
    setInput('');
    setIsBotTyping(true);

    setTimeout(async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/chat', { message: input });
        const botMessage = { sender: 'bot', text: res.data.reply };
        setChat(prev => [...prev, botMessage]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsBotTyping(false);
      }
    }, 1200);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, isBotTyping]);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-tl from-[#0F172A] via-[#1E293B] to-[#3B82F6]">

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:30px_30px] animate-spin-slower" />
      </div>

      {/* Header */}
      <motion.h1
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-4xl sm:text-5xl font-bold text-center text-white mb-4 tracking-tight"
      >
        Your Smart Task Assistant <br />
        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
          Organize. Prioritize. Accomplish.
        </span>
      </motion.h1>

      {/* Subheader */}
      <p className="relative z-10 text-center text-gray-200 max-w-2xl mb-8 text-sm">
        Manage tasks, set reminders, track progress, and boost productivity — all through natural conversation.
      </p>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative z-10 w-full max-w-4xl h-[70vh] p-6 flex flex-col rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl ${isBotTyping ? 'animate-pulse' : ''}`}
      >

        <motion.div
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {chat.map((msg, idx) => (
              <motion.div
                key={idx}
                variants={messageVariants}
                className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm break-words ${
                  msg.sender === 'user'
                    ? 'ml-auto text-right bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'bg-white/80 text-gray-800 border border-gray-200 shadow-md'
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </motion.div>
            ))}
          </AnimatePresence>

          {isBotTyping && (
            <motion.div
              className="flex items-center space-x-1 text-indigo-400 text-sm font-semibold px-3 py-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span>Bot is typing</span>
              {[0.2, 0.3, 0.4].map((delay, idx) => (
                <motion.span
                  key={idx}
                  className="w-2 h-2 bg-indigo-400 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: delay }}
                />
              ))}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </motion.div>

        {/* Input */}
        <motion.div
          className="mt-4 flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Enter your task or question..."
            className="flex-1 p-4 rounded-full bg-white/80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
          />
          <motion.button
            onClick={sendMessage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            Send
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default App;
