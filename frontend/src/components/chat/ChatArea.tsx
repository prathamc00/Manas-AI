import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, Quote, Info, Menu } from 'lucide-react';
import type { Message } from '../../types';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, mode: string) => void;
  onOpenMobileMenu?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onOpenMobileMenu,
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
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
    <div className="flex-1 flex flex-col h-full bg-[#181714] text-[#ECE7DF] relative select-text">
      {/* Floating Header */}
      <header className="h-14 border-b border-[#262520] px-4 md:px-8 flex items-center justify-between bg-[#181714]/90 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="p-1.5 rounded-lg text-[#A39D93] hover:text-[#ECE7DF] hover:bg-[#22211C] md:hidden transition active:scale-95"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#D97757]" />
            <span className="text-xs font-semibold text-[#ECE7DF]">Therapeutic Dialogue</span>
          </div>
        </div>

        {/* Mode Selector Pill Bar */}
        <div className="flex items-center space-x-1 bg-[#1F1E19] p-0.5 md:p-1 rounded-xl border border-[#2B2A24] overflow-x-auto max-w-[220px] sm:max-w-none">
          {[
            { id: 'standard', label: 'Balanced' },
            { id: 'venting', label: 'Just Venting' },
            { id: 'socratic', label: 'Socratic CBT' },
            { id: 'advice', label: 'Action Steps' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`px-2.5 md:px-3 py-1 text-[11px] md:text-xs font-medium rounded-lg transition duration-150 whitespace-nowrap active:scale-95 ${
                activeMode === mode.id
                  ? 'bg-[#2A2923] text-[#ECE7DF] shadow-sm font-semibold'
                  : 'text-[#736E65] hover:text-[#ECE7DF]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </header>

      {/* Centered Conversational Canvas (Max-width 720px) */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-7 max-w-[720px] w-full mx-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-5 md:space-y-6 pt-4 md:pt-8 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-[#22211C] border border-[#33312B] flex items-center justify-center text-[#D97757] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="space-y-2 px-2">
              <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-[#ECE7DF] tracking-tight">
                What is present for you right now?
              </h2>
              <p className="text-xs text-[#A39D93] max-w-md mx-auto leading-relaxed">
                Take your time. MANAS listens without judgment, reflects on your recurring patterns, and challenges unhelpful thoughts gently.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-2 md:pt-4 text-left">
              {[
                { label: "Untangle Work Anxiety", text: "I'm overwhelmed by expectations and stuck in mental loops" },
                { label: "Examine Self-Doubt", text: "I feel like I'm not doing enough and falling behind" },
                { label: "Safe Venting Space", text: "I just need a safe place to vent without quick fixes" },
                { label: "Reflect on a Choice", text: "I'm caught between options and feeling paralyzed" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(item.text, activeMode)}
                  className="p-4 rounded-2xl bg-[#22211C] hover:bg-[#2A2923] active:scale-[0.99] border border-[#33312B] hover:border-[#D97757]/40 text-left transition duration-200 group shadow-sm"
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
              <div key={msg.id} className="animate-slide-up space-y-2">
                {isUser ? (
                  /* User Bubble */
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[80%] bg-[#262520] border border-[#383630] text-[#ECE7DF] px-4 py-3 rounded-2xl rounded-tr-md text-xs leading-relaxed shadow-sm">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  /* Assistant Turn */
                  <div className="flex items-start space-x-3 max-w-full">
                    <div className="w-7 h-7 rounded-lg bg-[#D97757] text-[#181714] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <span className="font-editorial italic font-bold">M</span>
                    </div>

                    <div className="space-y-2.5 flex-1 min-w-0">
                      {/* What I'm hearing reflection badge */}
                      {msg.reflections?.summary && (
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#22211C] border border-[#33312B] text-[11px] text-[#D97757] max-w-full shadow-xs">
                          <Quote className="w-3 h-3 text-[#D97757] shrink-0" />
                          <span className="truncate">{msg.reflections.summary}</span>
                        </div>
                      )}

                      {/* Main Message Body */}
                      <div className="text-xs text-[#ECE7DF] leading-[1.75] space-y-3">
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
          <div className="flex items-start space-x-3 animate-fade-in">
            <div className="w-7 h-7 rounded-lg bg-[#D97757] text-[#181714] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <span className="font-editorial italic font-bold">M</span>
            </div>
            <div className="bg-[#22211C] border border-[#33312B] px-4 py-2.5 rounded-xl flex items-center space-x-2 text-xs text-[#D97757] shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D97757] animate-ping" />
              <span className="text-[#A39D93]">Reflecting deeply...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Prompt Bar (Centered Max-width 720px) */}
      <div className="p-3 md:p-5 bg-gradient-to-t from-[#181714] via-[#181714] to-transparent shrink-0">
        <div className="max-w-[720px] mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-[#22211C]/95 backdrop-blur-xl border border-[#383630] focus-within:border-[#D97757]/70 rounded-2xl p-2.5 shadow-2xl transition-all duration-200 flex flex-col space-y-2"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What thoughts or feelings are you noticing?"
              disabled={isLoading}
              className="w-full bg-transparent text-xs text-[#ECE7DF] placeholder-[#736E65] outline-none px-2 pt-1 resize-none min-h-[38px] max-h-[160px] leading-relaxed"
            />

            <div className="flex items-center justify-between px-1">
              <div className="hidden sm:flex items-center space-x-1.5 text-[10px] text-[#736E65]">
                <Info className="w-3 h-3" />
                <span>Shift+Enter for newline · Private & Local</span>
              </div>
              <div className="sm:hidden text-[10px] text-[#736E65]">
                <span>Private & Local</span>
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-[#D97757] hover:bg-[#E38769] active:scale-95 disabled:opacity-25 disabled:hover:bg-[#D97757] text-[#181714] transition duration-200 flex items-center justify-center shadow-md shrink-0"
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
