"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";

interface Message {
  user: "hirer" | "agent";
  text: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    // Add user message
    const newMessages = [...messages, { user: "hirer" as const, text: input }];
    setMessages(newMessages);
    setInput("");
    // TODO: Send message to AI agent endpoint, get response, etc.
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#2D3748]">Talk to Aggy</h2>
      <Card className="mb-6 h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-4 last:mb-0">
            <div className={`inline-block p-3 rounded-lg ${
              msg.user === "hirer" 
                ? "bg-[#2B6CB0] text-white ml-auto" 
                : "bg-[#EDF2F7] text-[#2D3748]"
            }`}>
              <p className="text-sm font-medium mb-1">
                {msg.user === "hirer" ? "You" : "AI"}
              </p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </Card>

      <div className="flex space-x-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
} 