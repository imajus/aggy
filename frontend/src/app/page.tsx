'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivy } from '@privy-io/react-auth';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatPage() {
  const { user } = usePrivy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Generate session ID on component mount
    setSessionId(uuidv4());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://aggy-agent.majus.app/webhook/02f1ac90-0c99-44fe-844f-e657ea21798d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          sessionId: sessionId,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.text,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-4 flex flex-col">
      <Card className="h-[700px] mb-4 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({className, children, ...props}: {
                        className?: string;
                        children: React.ReactNode;
                        inline?: boolean;
                      }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return props.inline && !match ? (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        ) : (
                          <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match?.[1] || 'text'}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        );
                      },
                      // Style links
                      a: ({node, ...props}) => (
                        <a 
                          {...props} 
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                      // Style paragraphs
                      p: ({node, ...props}) => (
                        <p {...props} className="text-sm mb-2" />
                      ),
                      // Style lists
                      ul: ({node, ...props}) => (
                        <ul {...props} className="list-disc list-inside mb-2" />
                      ),
                      ol: ({node, ...props}) => (
                        <ol {...props} className="list-decimal list-inside mb-2" />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="px-4 py-2"
          variant="default"
          size="default"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
} 