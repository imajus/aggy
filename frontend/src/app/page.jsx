import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-4xl font-bold">Welcome to Next.js with Shadcn UI</h1>
        <div className="flex gap-2">
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </div>
    </main>
  )
} 