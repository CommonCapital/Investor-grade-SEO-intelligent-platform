'use client';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React, { useEffect, useRef, useState } from 'react'
import {useChat} from '@ai-sdk/react';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  seoReportId: string
}

const AIChat = ({seoReportId}: Props) => {
  const [input, setInput] = useState("");
  const {messages, sendMessage, status} = useChat({
    id: seoReportId
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({text: input, metadata: {seoReportId}});
      setInput("");
    }
  }
  
  const isTyping = status === 'submitted';
  
  return (
    <div 
      className={cn(
        'fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-black/10 flex flex-col overflow-hidden w-[90vw] sm:w-[500px] h-[90vh] sm:h-[600px]',
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-5 bg-black text-white rounded-t-3xl'>
        <div className='flex items-center gap-3'>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className='font-bold text-base'>
              AI SEO Assistant
            </h3>
            <div className='flex items-center gap-2'>
              <div className={cn(
                'w-2 h-2 rounded-full', 
                isTyping ? "bg-white animate-pulse" : "bg-white/50"
              )}></div>
              <p className='text-xs'>
                {isTyping ? "Thinking..." : "Online"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div ref={chatRef} className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
        {messages.length === 0 && (
          <div className='text-center text-black/50 text-sm py-8'>
            <div className='mb-4'>
              <MessageCircle className='h-12 w-12 mx-auto mb-2' />
            </div>
            <p className='font-medium mb-1'>
              Welcome to AI SEO Assistant!
            </p>
            <p className='text-xs'>
              Ask me anything about your SEO report
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={cn(
            'flex', 
            message.role === 'user' ? "justify-end" : "justify-start"
          )}>
            <div className={cn(
              "max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm",
              message.role === 'user' 
                ? 'bg-black text-white rounded-br-md'
                : "bg-white text-black border border-black/10 rounded-bl-md"
            )}>
              {message.parts.map((part, index) => {
                if (part.type === 'tool-web_search') {
                  switch (part.state) {
                    case 'input-streaming':
                    case 'input-available':
                      return (
                        <div
                          key={`${message.id}-${index}`}
                          className='flex items-center gap-2 text-sm text-black/50'
                        >
                          <Loader2 className='w-4 h-4 animate-spin' />
                          <span>Searching the web...</span>
                        </div>
                      );
                    case 'output-available':
                      return (
                        <div
                          key={`${message.id}-${index}`}
                          className='text-sm text-black font-medium'
                        >
                          ✓ Finished web search
                        </div>
                      );
                    case 'output-error':
                      return (
                        <div 
                          key={`${message.id}-${index}`}
                          className='text-sm text-red-600'
                        >
                          ✗ Web search failed: {part.errorText}
                        </div>
                      )
                  }
                }

                if (part.type === 'text') {
                  return (
                    <div key={`${message.id}-${index}`} className="leading-relaxed">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({children}) => <p className='mb-3 last:mb-0'>{children}</p>,
                          ul: ({children}) => <ul className='mb-3 pl-4 space-y-1 list-disc'>{children}</ul>,
                          ol: ({children}) => <ol className='mb-3 pl-4 space-y-1 list-decimal'>{children}</ol>,
                          li: ({children}) => <li className='text-sm'>{children}</li>,
                          a: ({children, href}) => (
                            <a 
                              href={href}
                              className='text-black underline'
                              target="_blank"
                              rel="noopener noreferrer"
                            >{children}</a>
                          ),
                          strong: ({children}) => <strong className='font-bold'>{children}</strong>,
                          em: ({children}) => <em className='italic'>{children}</em>,
                          code: ({children}) => <code className='bg-black/5 px-1 py-0.5 rounded text-xs font-mono'>{children}</code>,
                          pre: ({children}) => <pre className='bg-black/5 p-2 rounded text-xs overflow-x-auto mb-3'>{children}</pre>,
                        }}
                      >
                        {part.text}
                      </ReactMarkdown>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className='flex justify-start'>
            <div className='bg-white border border-black/10 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]'>
              <div className='flex items-center gap-2'>
                <Loader2 className='w-4 h-4 animate-spin'/>
                <span className='text-sm text-black/50'>
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className='p-5 border-t border-black/10 bg-white'>
        <div className='flex gap-3'>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your question..."
            className='flex-1 h-11 border-black/30 rounded-xl focus:border-black focus:ring-2 focus:ring-black/20'
            disabled={isTyping}
          />
          <Button 
            onClick={handleSubmit}
            disabled={!input.trim() || isTyping}
            className='h-11 px-4 bg-black text-white rounded-xl shadow-sm disabled:opacity-50'
          >
            <Send className='w-4 h-4'/>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AIChat
