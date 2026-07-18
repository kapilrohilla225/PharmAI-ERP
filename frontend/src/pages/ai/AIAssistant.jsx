import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Bot, User, BarChart, Database, Lightbulb, PieChart, Copy, Check, Trash2, Zap, AlertTriangle, Package, TrendingUp, Activity, Brain, Cpu } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import { askAI, getInventoryAnalysis, getBusinessInsights, getSalesSummary, getDashboardSummary } from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";
import { getRoleLabel } from "../../constants/access";

function formatAI(text) {
  const lines = text.split("\n");
  const out = [];
  let inCode = false;
  let codeBuf = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      if (inCode) {
        out.push({ t: "code", v: codeBuf.join("\n") });
        codeBuf = [];
      }
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^(#{1,3})\s/)[1].length;
      const label = line.replace(/^#{1,3}\s/, "");
      out.push({ t: `h${level}`, v: label });
    } else if (/^\*\s/.test(line)) {
      out.push({ t: "li", v: line.replace(/^\*\s/, "") });
    } else if (/^\d+\.\s/.test(line)) {
      out.push({ t: "li", v: line.replace(/^\d+\.\s/, "") });
    } else if (line.trim() === "") {
      out.push({ t: "spacer" });
    } else {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const children = parts.map((p, idx) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return { b: true, v: p.slice(2, -2) };
        }
        return { b: false, v: p };
      });
      out.push({ t: "p", children });
    }
  }
  if (inCode && codeBuf.length) {
    out.push({ t: "code", v: codeBuf.join("\n") });
  }
  return out;
}

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Failed to copy");
    }
  };
  return (
    <button onClick={handle} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition cursor-pointer" title="Copy message">
      {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const FormattedMessage = ({ text, isAi }) => {
  if (!isAi) {
    return (
      <p>{text}</p>
    );
  }
  const blocks = formatAI(text);
  return (
    <div className="space-y-1.5">
      {blocks.map((block, idx) => {
        switch (block.t) {
          case "h1":
            return <h1 key={idx} className="text-base font-bold text-white mt-3 first:mt-0">{block.v}</h1>;
          case "h2":
            return <h2 key={idx} className="text-sm font-bold text-white mt-3 first:mt-0">{block.v}</h2>;
          case "h3":
            return <h3 key={idx} className="text-sm font-semibold text-slate-100 mt-2 first:mt-0">{block.v}</h3>;
          case "li":
            return <li key={idx} className="text-sm text-slate-200 ml-4 list-disc">{block.v}</li>;
          case "code":
            return (
              <pre key={idx} className="mt-2 mb-2 rounded-xl bg-slate-950/80 border border-slate-700/60 p-3 overflow-x-auto text-xs text-emerald-300 font-mono leading-relaxed">
                <code>{block.v}</code>
              </pre>
            );
          case "spacer":
            return <div key={idx} className="h-1.5" />;
          default: {
            const p = block;
            return (
              <p key={idx} className="text-sm text-slate-200 leading-relaxed">
                {p.children.map((child, ci) =>
                  child.b ? <strong key={ci} className="font-semibold text-white">{child.v}</strong> : <span key={ci}>{child.v}</span>
                )}
              </p>
            );
          }
        }
      })}
    </div>
  );
};

const presets = [
  { name: "Inventory Audit", icon: Database, desc: "Stock levels, expiry tracking, low stock alerts", action: "inventory", gradient: "from-blue-600/10 to-blue-900/5 border-blue-500/20 hover:border-blue-400/50", iconWrap: "bg-blue-500/15 text-blue-400 group-hover:bg-blue-500/25" },
  { name: "Business Insights", icon: Lightbulb, desc: "Strategic decisions, procurement optimization", action: "insights", gradient: "from-amber-600/10 to-amber-900/5 border-amber-500/20 hover:border-amber-400/50", iconWrap: "bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25" },
  { name: "Sales Performance", icon: BarChart, desc: "Revenue trends, top products, daily summary", action: "sales", gradient: "from-emerald-600/10 to-emerald-900/5 border-emerald-500/20 hover:border-emerald-400/50", iconWrap: "bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25" },
  { name: "Dashboard Summary", icon: PieChart, desc: "Executive overview, health check, KPIs", action: "dashboard", gradient: "from-indigo-600/10 to-indigo-900/5 border-indigo-500/20 hover:border-indigo-400/50", iconWrap: "bg-indigo-500/15 text-indigo-400 group-hover:bg-indigo-500/25" },
];

const quickPrompts = [
  { text: "Summarize low stock risk across all medicines.", icon: AlertTriangle, short: "Low Stock" },
  { text: "List products that need reordering this week.", icon: Package, short: "Reordering" },
  { text: "Give me business insights for procurement and sales.", icon: TrendingUp, short: "Insights" },
  { text: "Explain the current dashboard health in simple terms.", icon: Activity, short: "Dashboard" },
];

const AIAssistant = () => {
  const { user, roleLabel } = useAuth();
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I'm your **Gloss Pharma** AI assistant. I can help you manage inventory, analyze sales, and generate business insights.\n\nTry one of the **preset analysis** buttons below, or type any question about your pharmacy data.", time: new Date() },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = useCallback(async (textToSend) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim()) return;
    if (!textToSend) setInputText("");
    setMessages(prev => [...prev, { sender: "user", text: prompt, time: new Date() }]);
    setLoading(true);
    try {
      const res = await askAI(prompt);
      setMessages(prev => [...prev, { sender: "ai", text: res.data.data || "I processed your request. The system returned no specific data.", time: new Date() }]);
    } catch {
      toast.error("AI service is currently unavailable");
      setMessages(prev => [...prev, { sender: "ai", text: "Sorry, I encountered an error. Please ensure your **Gemini API key** is configured in the backend `.env` file.", time: new Date() }]);
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  const runPreset = useCallback(async (presetName, apiCall) => {
    setMessages(prev => [...prev, { sender: "user", text: `Generate ${presetName}`, time: new Date() }]);
    setLoading(true);
    try {
      const res = await apiCall();
      setMessages(prev => [...prev, { sender: "ai", text: res.data.data || "Preset report compiled successfully.", time: new Date() }]);
      toast.success(`${presetName} generated`);
    } catch {
      toast.error(`Failed to fetch ${presetName}`);
      setMessages(prev => [...prev, { sender: "ai", text: `Error executing **${presetName}**. Please verify database records and backend connection.`, time: new Date() }]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearChat = () => {
    setMessages([{ sender: "ai", text: "Hello! I'm your **Gloss Pharma** AI assistant. I can help you manage inventory, analyze sales, and generate business insights.\n\nTry one of the **preset analysis** buttons below, or type any question about your pharmacy data.", time: new Date() }]);
    toast.success("Conversation cleared");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <PageHeader title="AI Assistant" subtitle="Conversational intelligence for pharmacy operations — powered by Gemini" />
      </div>

      {/* Body: sidebar presets + main chat area */}
      <div className="flex flex-1 min-h-0 gap-5">
        {/* Presets sidebar */}
        <div className="hidden xl:flex xl:w-64 shrink-0 flex-col gap-3">
          <Card className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-amber-400" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold">Presets</span>
            </div>
            {presets.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    const mapping = { inventory: getInventoryAnalysis, insights: getBusinessInsights, sales: getSalesSummary, dashboard: getDashboardSummary };
                    runPreset(p.name, mapping[p.action]);
                  }}
                  disabled={loading}
                  className={`group relative flex items-center gap-3 rounded-xl border bg-gradient-to-br ${p.gradient} p-3 text-left transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer`}
                >
                  <div className={`h-8 w-8 rounded-lg ${p.iconWrap} flex items-center justify-center transition shrink-0`}>
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight truncate">{p.desc}</p>
                  </div>
                </button>
              );
            })}
          </Card>

          <Card className="p-4 flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Brain size={14} className="text-blue-400" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold">Model</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/50 border border-slate-700/60 p-3">
              <div className="h-7 w-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Cpu size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Gemini 2.0</p>
                <p className="text-[10px] text-slate-500">Google AI</p>
              </div>
            </div>
            <div className="mt-auto pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Connected
              </div>
            </div>
          </Card>
        </div>

        {/* Main chat area */}
        <div className="flex-1 min-w-0 flex flex-col bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl shadow-black/5">
          {/* Quick prompts strip */}
          <div className="shrink-0 border-b border-slate-800/50 bg-slate-900/50 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
            <Zap size={13} className="text-amber-400 shrink-0" />
            <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500 font-semibold mr-1 shrink-0">Quick</span>
            {quickPrompts.map((prompt, i) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(prompt.text)}
                  disabled={loading}
                  className="shrink-0 rounded-full border border-slate-700/50 bg-slate-800/30 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-600 transition flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <Icon size={11} />
                  {prompt.short}
                </button>
              );
            })}
            <div className="ml-auto shrink-0 flex items-center gap-2">
              <button
                onClick={clearChat}
                className="rounded-full border border-slate-700/50 bg-slate-800/30 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition flex items-center gap-1.5 cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 size={11} />
                Clear
              </button>
              <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                <span className="hidden sm:inline">Gemini</span>
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => {
                const isAi = msg.sender === "ai";
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`flex gap-3 max-w-4xl ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                  >
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                      isAi
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-600/20"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}>
                      {isAi ? <Bot size={17} /> : <User size={17} />}
                    </div>

                    <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
                      isAi
                        ? "bg-slate-800/70 text-slate-100 border border-slate-700/50 shadow-sm max-w-[90%]"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/15 max-w-[80%]"
                    }`}>
                      <FormattedMessage text={msg.text} isAi={isAi} />
                      <div className={`flex items-center gap-3 mt-2 ${isAi ? "" : "justify-end"}`}>
                        <span className={`text-[10px] ${isAi ? "text-slate-600" : "text-blue-200"}`}>
                          {new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {isAi && <CopyButton text={msg.text} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 mr-auto max-w-sm items-center"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Bot size={17} />
                </div>
                <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl px-5 py-3.5 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    {[0, 160, 320].map((d) => (
                      <div key={d} className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-slate-800/50 p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  placeholder="Ask AI about inventory, sales, or business insights..."
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 focus:bg-slate-800 placeholder:text-slate-500 disabled:opacity-40 transition"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !inputText.trim()}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-3.5 transition flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-600/15 cursor-pointer"
              >
                <Send size={17} />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-slate-600 text-center">
              AI responses are generated by Google Gemini. Verify critical data before acting on it.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile preset buttons (shown below xl) */}
      <div className="xl:hidden grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
        {presets.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                const mapping = { inventory: getInventoryAnalysis, insights: getBusinessInsights, sales: getSalesSummary, dashboard: getDashboardSummary };
                runPreset(p.name, mapping[p.action]);
              }}
              disabled={loading}
              className={`group flex items-center gap-2 rounded-xl border bg-gradient-to-br ${p.gradient} px-3 py-2.5 text-left transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer`}
            >
              <div className={`h-7 w-7 rounded-lg ${p.iconWrap} flex items-center justify-center transition shrink-0`}>
                <Icon size={13} />
              </div>
              <span className="text-xs font-semibold text-white">{p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AIAssistant;
