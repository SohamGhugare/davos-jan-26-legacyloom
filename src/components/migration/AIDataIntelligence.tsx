"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Database,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What is the overall reconciliation status?",
  "Which tables have the most discrepancies?",
  "Show me failed test rules",
  "What are the top data quality issues?",
  "Summarize the migration health"
];

export function AIDataIntelligence() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, customMessage?: string) => {
    e?.preventDefault();
    const messageText = customMessage || input.trim();

    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Data Intelligence</h2>
            <p className="text-zinc-500 text-sm">Powered by Gemini AI with migration data context</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">2 Data Sources</span>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/50 transition-all"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Data Sources Banner */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Database className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Reconciliation Data</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Source vs Target comparisons</p>
          </div>
        </div>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <FileSpreadsheet className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Test Rule Data</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Validation rules & results</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/20 mb-6">
                <Bot className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ask me about your migration data</h3>
              <p className="text-zinc-500 text-sm max-w-md mb-8">
                I have access to your reconciliation and test rule data. Ask me questions about discrepancies, data quality, or migration status.
              </p>

              {/* Suggested Questions */}
              <div className="w-full max-w-xl">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Suggested Questions</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTED_QUESTIONS.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSubmit(undefined, question)}
                      className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-zinc-600 transition-all"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 h-fit">
                      <Bot className="h-5 w-5 text-purple-400" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-5 py-4",
                      message.role === 'user'
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-800 border border-zinc-700 text-zinc-100"
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none prose-p:text-zinc-200 prose-p:leading-relaxed prose-p:my-2 prose-headings:text-white prose-headings:font-bold prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-strong:text-white prose-strong:font-semibold prose-code:text-purple-400 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-ul:my-2 prose-ul:space-y-1 prose-li:text-zinc-300 prose-li:my-0 prose-ol:my-2 prose-ol:space-y-1 prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-purple-500 prose-blockquote:text-zinc-400 prose-hr:border-zinc-700">
                        <ReactMarkdown
                          components={{
                            // Custom renderers for better styling
                            ul: ({ children }) => (
                              <ul className="list-disc list-outside ml-4 space-y-1.5 my-3">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-outside ml-4 space-y-1.5 my-3">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-zinc-300 text-sm leading-relaxed">
                                {children}
                              </li>
                            ),
                            p: ({ children }) => (
                              <p className="text-zinc-200 text-sm leading-relaxed my-2">
                                {children}
                              </p>
                            ),
                            strong: ({ children }) => (
                              <strong className="text-white font-semibold">
                                {children}
                              </strong>
                            ),
                            code: ({ children, className }) => {
                              const isInline = !className;
                              if (isInline) {
                                return (
                                  <code className="text-purple-400 bg-zinc-900/80 px-1.5 py-0.5 rounded text-xs font-mono">
                                    {children}
                                  </code>
                                );
                              }
                              return (
                                <code className={className}>
                                  {children}
                                </code>
                              );
                            },
                            pre: ({ children }) => (
                              <pre className="bg-zinc-900 rounded-lg p-3 overflow-x-auto my-3 text-xs">
                                {children}
                              </pre>
                            ),
                            h1: ({ children }) => (
                              <h1 className="text-lg font-bold text-white mt-4 mb-2">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-base font-bold text-white mt-3 mb-2">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-sm font-bold text-white mt-3 mb-1">
                                {children}
                              </h3>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-purple-500 pl-3 my-3 text-zinc-400 italic">
                                {children}
                              </blockquote>
                            ),
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-3">
                                <table className="min-w-full text-sm border-collapse">
                                  {children}
                                </table>
                              </div>
                            ),
                            th: ({ children }) => (
                              <th className="border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-xs font-bold text-zinc-300 uppercase tracking-wider">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="border border-zinc-700 px-3 py-2 text-zinc-300">
                                {children}
                              </td>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    )}
                    <p className={cn(
                      "text-[10px] mt-2 font-mono",
                      message.role === 'user' ? "text-blue-200" : "text-zinc-500"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 h-fit">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0 p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 h-fit">
                    <Bot className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                      <span className="text-sm text-zinc-400">Analyzing data...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-400 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <RefreshCw className="h-4 w-4 text-red-500" />
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800 bg-black/40">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about reconciliation status, test rules, data quality..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none transition-all"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-3 rounded-xl font-semibold transition-all flex items-center justify-center",
                input.trim() && !isLoading
                  ? "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/20"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
          <p className="text-[10px] text-zinc-600 mt-2 text-center font-medium">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
