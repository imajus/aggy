"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const handlePostJob = () => {
    // Suppose we've refined job details with the AI
    // Now we can "post" it and redirect
    router.push("/tasks");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">AI Refinement Chat</h2>
      <div className="border p-4 mb-4 h-64 overflow-y-auto bg-white">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.user === "hirer" ? "You" : "AI"}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

      <div className="mt-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handlePostJob}
        >
          Post Job
        </button>
      </div>
    </div>
  );
} 