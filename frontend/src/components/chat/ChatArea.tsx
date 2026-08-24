import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, Quote, Info } from 'lucide-react';
import type { Message } from '../../types';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, mode: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState<string>('standard');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea like Claude
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(text, activeMode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#181714] text-[#ECE7DF] relative select-text">
      {/* Top Header */}
      <header className="h-14 border-b border-[#262520] px-6 flex items-center justify-between bg-[#181714]/90 backdrop-blur-md z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 rounded-full bg-[#D97757]" />
          <span className="text-xs font-medium text-[#ECE7DF]">Therapeutic Space</span>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-1 bg-[#1F1E1A] p-1 rounded-xl border border-[#2B2A24]">
          {[
            { id: 'standard', label: 'Balanced' },
            { id: 'venting', label: 'Just Venting' },
            { id: 'socratic', label: 'Socratic CBT' },
            { id: 'advice', label: 'Action Steps' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition duration-150 ${
                activeMode === mode.id
                  ? 'bg-[#2B2A24] text-[#ECE7DF] shadow-sm'
                  : 'text-[#A39D93] hover:text-[#ECE7DF]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </header>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 max-w-3xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-12 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-[#22211C] border border-[#33312B] flex items-center justify-center text-[#D97757] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h2 className="font-editorial text-2xl font-semibold text-[#ECE7DF]">
                What is present for you right now?
              </h2>
              <p className="text-xs text-[#A39D93] max-w-md mx-auto leading-relaxed">
                MANAS holds space for self-reflection, untangling difficult thoughts, and observing recurring patterns with kindness.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-4 text-left">
              {[
                { label: "Untangle Work Pressure", text: "I'm overwhelmed with deadlines and feel stuck in overthinking" },
                { label: "Examine Self-Doubt", text: "I keep doubting myself and worrying that I'm falling behind" },
                { label: "Emotional Space", text: "I just need a quiet space to vent without being given quick fixes" },
                { label: "Reflect on a Decision", text: "I have a difficult choice to make and my mind feels cluttered" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(item.text, activeMode)}
                  className="p-3.5 rounded-xl bg-[#22211C] hover:bg-[#2B2A24] border border-[#33312B] hover:border-[#D97757]/40 text-left transition duration-200 group"
                >
                  <div className="text-xs font-semibold text-[#ECE7DF] group-hover:text-[#D97757] transition">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-[#A39D93] mt-1 line-clamp-2">
                    "{item.text}"
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className="animate-fade-in space-y-2">
                {/* User Message */}
                {isUser ? (
                  <div className="flex justify-end">
                    <div className="max-w-xl bg-[#262520] border border-[#383630] text-[#ECE7DF] px-4 py-3 rounded-2xl rounded-tr-sm text-xs leading-relaxed shadow-sm">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  /* Assistant Message (Claude Editorial Layout) */
                  <div className="flex items-start space-x-3.5 max-w-2xl">
                    <div className="w-7 h-7 rounded-lg bg-[#D97757] text-[#181714] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <span className="font-editorial italic">M</span>
                    </div>

                    <div className="space-y-2 flex-1">
                      {/* What I'm hearing reflection badge */}
                      {msg.reflections?.summary && (
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#22211C] border border-[#33312B] text-[11px] text-[#D97757]">
                          <Quote className="w-3 h-3 text-[#D97757] shrink-0" />
                          <span>{msg.reflections.summary}</span>
                        </div>
                      )}

                      {/* Main Assistant Body */}
                      <div className="text-xs text-[#ECE7DF] leading-relaxed space-y-3 font-normal">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>

                      <div className="text-[10px] text-[#736E65]">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3.5 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-[#D97757] text-[#181714] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              <span className="font-editorial italic">M</span>
            </div>
            <div className="bg-[#22211C] border border-[#33312B] px-3.5 py-2.5 rounded-xl flex items-center space-x-2 text-xs text-[#D97757]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D97757] animate-ping" />
              <span className="text-[#A39D93]">Reflecting deeply...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Claude-style Input Tray */}
      <div className="p-4 bg-gradient-to-t from-[#181714] via-[#181714] to-transparent">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-[#22211C] border border-[#33312B] focus-within:border-[#D97757]/70 rounded-2xl p-2.5 shadow-xl transition-all duration-200 flex flex-col space-y-2"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What thoughts or feelings are you noticing?"
              disabled={isLoading}
              className="w-full bg-transparent text-xs text-[#ECE7DF] placeholder-[#736E65] outline-none px-2 pt-1 resize-none min-h-[40px] max-h-[180px] leading-relaxed"
            />

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-1.5 text-[10px] text-[#736E65]">
                <Info className="w-3 h-3" />
                <span>Shift+Enter for newline · Private & Local</span>
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-[#D97757] hover:bg-[#E38769] disabled:opacity-30 disabled:hover:bg-[#D97757] text-[#181714] transition duration-200 flex items-center justify-center shadow-sm"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
