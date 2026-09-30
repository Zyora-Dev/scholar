import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  source?: string;
  actions?: { label: string; url: string }[];
  timestamp: string;
}

export const SakshamAiAssistantPage: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-0",
      sender: "ai",
      text: "Vanakkam! I am your Saksham AI Assistant. I can assist you with discovering scholarships across all 28 states, explaining dynamic eligibility, reviewing document mismatches, resolving returned applications in the Rescue Center, and preparing for renewals.",
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
  }, [messages]);

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
        text: res.reply,
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
          text: "I am currently running in offline demo mode. Please refer to verified scheme details.",
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
      alert("Voice speech recognition is not supported in this browser. Please use Chrome/Edge or type your query.");
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

  const promptChips = [
    { label: "Am I eligible for scholarships?", query: "Am I eligible for scholarships based on my profile?" },
    { label: "How to fix returned application?", query: "How do I fix my returned application in the Rescue Center?" },
    { label: "When is my renewal deadline?", query: "When is my renewal deadline and what documents are required?" },
    { label: "Check my document mismatch", query: "Check my document mismatch between Indhira Iyappan and Iyyappan" }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[80vh] flex flex-col">
      {/* Header */}
      <div className="bg-surface p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-tribal p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-saffron">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Saksham AI Assistant</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Grounded in Verified Schemes Database
            </p>
          </div>
        </div>

        <button
          onClick={() => setTtsEnabled(!ttsEnabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          <span>{ttsEnabled ? "Voice Speech ON" : "Muted"}</span>
        </button>
      </div>

      {/* Quick Question Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {promptChips.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.query)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:border-saffron hover:text-saffron transition-colors shadow-2xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-surface rounded-2xl border border-gray-200 p-5 overflow-y-auto space-y-4 shadow-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-saffron text-white rounded-br-xs shadow-xs"
                  : "bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-xs shadow-2xs"
              }`}
            >
              <p>{m.text}</p>

              {m.source && (
                <p className="mt-2 text-[10px] text-gray-400 font-medium flex items-center gap-1 border-t border-gray-200/60 pt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> {m.source}
                </p>
              )}

              {m.actions && m.actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.actions.map((act, aIdx) => (
                    <Link
                      key={aIdx}
                      to={act.url}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold bg-tribal text-white hover:bg-tribal-dark"
                    >
                      {act.label} <ExternalLink className="w-3 h-3" />
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
            <Sparkles className="w-4 h-4 animate-spin text-saffron" />
            Analyzing verified scholarship rules and profile parameters...
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Trust Notice */}
      <div className="text-center text-[10px] text-gray-500">
        AI assists. Authorized government authorities determine official eligibility and approval.
      </div>

      {/* Input Bar */}
      <div className="bg-surface p-3 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-2">
        <button
          onClick={toggleVoiceInput}
          className={`p-2.5 rounded-xl border transition-colors ${
            isListening
              ? "bg-rose-100 text-rose-600 border-rose-400 animate-pulse"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-300"
          }`}
          title={isListening ? "Listening... click to stop" : "Speak question"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Saksham AI about scholarships, eligibility, document mismatches, or deadlines..."
          className="flex-1 text-xs py-2.5 px-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-saffron focus:bg-white"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-saffron text-white hover:bg-saffron-dark disabled:opacity-50 transition-colors font-bold text-xs flex items-center gap-1.5"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </div>
  );
};
