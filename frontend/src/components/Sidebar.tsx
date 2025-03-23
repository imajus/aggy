import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-background-sidebar p-4">
      <div className="mb-8">
        <p className="text-xl font-bold text-primary-main">Aggy Dapp</p>
      </div>
      <nav className="space-y-2">
        <Link
          href="/chat"
          className="block p-2 text-text-secondary hover:bg-border rounded-md"
        >
          Chat
        </Link>
        <Link
          href="/tasks"
          className="block p-2 text-text-secondary hover:bg-border rounded-md"
        >
          Task Board
        </Link>
        <Link
          href="/pending-reviews"
          className="block p-2 text-text-secondary hover:bg-border rounded-md"
        >
          Pending Reviews
        </Link>
        <Link
          href="/completed-tasks"
          className="block p-2 text-text-secondary hover:bg-border rounded-md"
        >
          Completed Tasks
        </Link>
      </nav>
    </aside>
  );
} 