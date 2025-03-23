import React from 'react';

export default function ChatWindow() {
  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Header */}
      <header className="bg-[#2B6CB0] text-white p-4">
        <h1 className="text-xl font-bold">Chat</h1>
      </header>

      {/* Chat Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/4 bg-[#EDF2F7] p-4 overflow-y-auto">
          <p className="font-bold">Contacts</p>
          {/* Add contact list here */}
        </aside>

        {/* Message Section */}
        <main className="flex-1 bg-white p-4 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {/* Add messages here */}
            <div className="bg-[#F7FAFC] p-2 rounded-md shadow-sm">
              <p>User: Hello!</p>
            </div>
            <div className="bg-[#E2E8F0] p-2 rounded-md shadow-sm">
              <p>You: Hi there!</p>
            </div>
          </div>
        </main>
      </div>

      {/* Input Section */}
      <footer className="bg-[#F7FAFC] p-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </footer>
    </div>
  );
} 