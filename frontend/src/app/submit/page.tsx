"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

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
      <h2 className="text-xl font-bold mb-4">Submit a Job Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            className="border w-full p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter job title"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Brief Description</label>
          <textarea
            className="border w-full p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description..."
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price (USDC)</label>
          <input
            type="number"
            className="border w-full p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.0"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            className="border w-full p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Deadline</label>
          <input
            type="date"
            className="border w-full p-2"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit &amp; Proceed to AI Chat
        </button>
      </form>
    </div>
  );
} 