import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GoalManager from "@/components/dashboard/GoalManager";
import ProcrastinemonLogo from "@/components/icons/ProcrastinemonLogo";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 md:p-8 font-body text-foreground">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <ProcrastinemonLogo className="h-12 w-12" />
          <h1 className="text-2xl md:text-3xl font-headline hidden sm:block">
            Procrastinemon Trainer
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border-2 border-foreground">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="pixel art avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button variant="outline" className="font-body text-xs">Logout</Button>
        </div>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        <GoalManager />
      </main>

      <footer className="w-full max-w-4xl mt-12 text-center text-muted-foreground text-xs">
        <p>Procrastinemon Trainer - Vanquish your tasks, feed the demon.</p>
      </footer>
    </div>
  );
}
