import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  source?: string;
  actions?: { label: string; url: string }[];
  timestamp: string;
}

export const SakshamAiDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-0",
      sender: "ai",
      text: "Vanakkam & Namaste! I am Saksham AI Assistant. I can help you understand scholarship eligibility, prepare documents, recover returned applications, and stay on track for renewals across India.",
      timestamp: "Just now"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const { language } = useLanguage();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const speak = (text: string) => {
    if (!ttsEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === "ta") utterance.lang = "ta-IN";
    else if (language === "hi") utterance.lang = "hi-IN";
    else utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.aiChat(textToSend, language);
      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: res.reply || "I am processing your query based on verified schemes data.",
        source: res.source,
        actions: res.suggestedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, aiReply]);
      speak(aiReply.text);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "I am currently running in offline demo mode. Please refer to the verified portal guidelines.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome/Edge or type your question.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === "ta" ? "ta-IN" : language === "hi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const quickPrompts = [
    { label: "Am I eligible for scholarships?", query: "Check my eligibility based on my profile" },
    { label: "Why was my application returned?", query: "Why was my application returned and how do I rescue it?" },
    { label: "When is my renewal deadline?", query: "What is my renewal deadline and required documents?" },
    { label: "Explain document mismatch", query: "Explain my document mismatch between Indhira Iyappan and Iyyappan" }
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-saffron to-tribal text-white font-bold rounded-full shadow-2xl hover:opacity-95 transition-all transform hover:scale-105"
        title="Open Saksham AI Assistant"
      >
        <Bot className="w-5 h-5 animate-bounce" />
        <span className="text-sm">Saksham AI</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[580px] bg-surface rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-saffron to-saffron-dark text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none">Saksham AI Assistant</h3>
                <p className="text-[11px] text-white/80 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Grounded in Verified Schemes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white"
                title={ttsEnabled ? "Voice Speech Enabled" : "Voice Speech Muted"}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Guidance Chips */}
          <div className="p-2.5 bg-gray-50 border-b border-gray-200 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-gray-300 text-gray-700 hover:border-saffron hover:text-saffron transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-pageBg">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    m.sender === "user"
                      ? "bg-saffron text-white rounded-br-xs shadow-sm"
                      : "bg-surface text-gray-800 border border-gray-200 rounded-bl-xs shadow-sm"
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {m.source && (
                    <p className="mt-2 text-[10px] text-gray-400 font-medium flex items-center gap-1 border-t border-gray-100 pt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {m.source}
                    </p>
                  )}

                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {m.actions.map((act, aIdx) => (
                        <Link
                          key={aIdx}
                          to={act.url}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-tribal text-white hover:bg-tribal-dark"
                        >
                          {act.label} <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-saffron" />
                Thinking & consulting verified scholarship database...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Trust Disclaimer */}
          <div className="px-3 py-1.5 bg-gray-100 border-t border-gray-200 text-[10px] text-gray-500 text-center">
            AI-assisted preliminary guidance. Official authorities determine eligibility.
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-surface border-t border-gray-200 flex items-center gap-2">
            <button
              onClick={toggleVoiceInput}
              className={`p-2 rounded-full border transition-colors ${
                isListening
                  ? "bg-rose-100 text-rose-600 border-rose-400 animate-pulse"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              }`}
              title={isListening ? "Listening... click to stop" : "Speak your question"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about scholarships, rescue, or renewals..."
              className="flex-1 text-xs py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron focus:bg-white"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg bg-saffron text-white hover:bg-saffron-dark disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
