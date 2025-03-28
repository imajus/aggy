import { Inter } from "next/font/google";
import Link from "next/link";
import { WalletStatus } from "@/components/WalletStatus";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const sidebarItems = [
  { name: "Chat", path: "/" },
  { name: "Open Tasks", path: "/tasks" },
  { name: "My Tasks", path: "/my-tasks" },
  { name: "Tasks in Review", path: "/reviewed" },
  { name: "Completed Tasks", path: "/completed" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col mx-auto max-w-7xl">
            {/* Header */}
            <header className="border-b">
              <div className="px-4 h-16 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Aggy</h1>
                <WalletStatus />
              </div>
            </header>

            <div className="flex flex-1">
              {/* Sidebar */}
              <aside className="w-64 border-r bg-muted/30">
                <nav className="p-4 space-y-2">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="block px-4 py-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </aside>

              {/* Main content */}
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
} 