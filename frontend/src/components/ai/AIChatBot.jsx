import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send, User, Sparkles, MessageSquare, Cpu } from "lucide-react";
import { askAI } from "../../services/aiService";

const AIChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I'm your Pharma AI assistant. Ask me about stock, sales, or HR.", time: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const handleSend = async (text) => {
    const prompt = text || input;
    if (!prompt.trim() || loading) return;
    if (!text) setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: prompt, time: new Date() }]);
    setLoading(true);

    try {
      const res = await askAI(prompt);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.data.data || "Request processed.", time: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "AI service unavailable. Please try again.", time: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Low stock medicines?",
    "Today's sales summary",
    "Top selling products",
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-600/30 transition-shadow hover:shadow-blue-500/40 cursor-pointer"
        aria-label="Toggle AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute inset-0 rounded-2xl animate-ping bg-blue-500 opacity-25 pointer-events-none" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl border border-slate-700/70 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden"
            style={{ maxHeight: "540px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/95 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                <Bot size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Pharma AI</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[11px] text-slate-500">Online</p>
                  <span className="text-[10px] text-slate-700 mx-0.5">|</span>
                  <Cpu size={10} className="text-slate-600" />
                  <span className="text-[10px] text-slate-600">Gemini</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: 0 }}>
              {messages.map((msg, i) => {
                const isAi = msg.sender === "ai";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex gap-2.5 ${isAi ? "" : "flex-row-reverse"}`}
                  >
                    <div className={`h-7 w-7 shrink-0 rounded-xl flex items-center justify-center ${
                      isAi
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}>
                      {isAi ? <Bot size={13} /> : <User size={13} />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                      isAi
                        ? "bg-slate-800/80 text-slate-100 border border-slate-700/60"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                    }`}>
                      {msg.text.split("\n").map((line, j) => (
                        <p key={j} className={j > 0 ? "mt-1" : ""}>{line}</p>
                      ))}
                      <span className={`block text-[10px] mt-1 ${isAi ? "text-slate-600" : "text-blue-200"}`}>
                        {new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {loading && (
                <div className="flex gap-2.5">
                  <div className="h-7 w-7 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
                    <Bot size={13} />
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    disabled={loading}
                    className="rounded-full border border-slate-700/60 bg-slate-800/50 px-3 py-1 text-[11px] text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-slate-800/60 bg-slate-900/80 px-3 py-3 backdrop-blur">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  placeholder="Ask anything..."
                  className="flex-1 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-slate-500 disabled:opacity-40"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-600/10 cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;
