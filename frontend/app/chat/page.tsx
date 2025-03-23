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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { user: "hirer" as const, text: input }];
    setMessages(newMessages);
    setInput("");
    // TODO: Send message to AI agent endpoint, get response, etc.
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <h2 className="text-2xl font-bold mb-4 text-[#2D3748]">Talk to Aggy</h2>

      {/* Chat messages fill the rest of the screen */}
      <Card className="flex-1 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-4 last:mb-0">
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.user === "hirer"
                  ? "bg-[#2B6CB0] text-white ml-auto"
                  : "bg-[#EDF2F7] text-[#2D3748]"
              }`}
            >
              <p className="text-sm font-medium mb-1">
                {msg.user === "hirer" ? "You" : "AI"}
              </p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Message input + send button at the bottom */}
      <div className="flex w-full mt-4 px-4">
        <Input
          className="flex-1 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
