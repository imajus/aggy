"use client";

import { v4 as uuid } from 'uuid';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from '@privy-io/react-auth';
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { sendChatMessage } from '@/lib/api';



interface Message {
  user: "hirer" | "agent";
  text: string;
}

export default function ChatPage() {
  const { user } = usePrivy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(uuid());

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { user: "hirer" as const, text: input }];
    setMessages(newMessages);
    setInput("");
    sendChatMessage(user?.id, sessionId, input)
      .then((text) => {
        setMessages([...newMessages, { user: "agent" as const, text }]);
      })
      //#3173e2
      .catch(error => console.error('Error sending chat message:', error));
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-[#3173e2]">Talk to Aggy</h2>

      {/* Chat messages fill the rest of the screen */}
      <div className="flex-1 flex-grow">
        <Card className="h-150 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-4 last:mb-0">
              <div
                className={`inline-block p-3 rounded-lg ${
                  msg.user === "hirer"
                    ? "bg-[#2B6CB0] text-white ml-auto"
                    : "bg-[#EDF2F7] text-[#3173e2]"
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
      </div>

      {/* Message input + send button at the bottom */}
      <div className="flex w-full mt-4 px-4">
        <div className="flex-grow">
          <Input
            className="flex-1  mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
        </div>
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
