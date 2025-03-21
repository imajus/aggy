"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";

export default function SubmitFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // TODO: call your backend or contract logic to create a new job
    // For now, assume success and redirect to Chat UI
    router.push("/chat");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#2D3748]">Submit a Job Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter job title"
          required
        />

        <TextArea
          label="Brief Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description..."
          required
        />

        <Input
          label="Price (USDC)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.0"
          required
        />

        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <Input
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <Button type="submit" variant="primary" className="w-full">
          Submit &amp; Proceed to AI Chat
        </Button>
      </form>
    </div>
  );
} 