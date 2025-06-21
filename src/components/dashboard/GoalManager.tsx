"use client";

import { useState, useEffect, useMemo } from "react";
import type { Goal } from "@/lib/types";
import { getAdaptiveMessage } from "@/ai/flows/adaptive-message";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import HappyDemon from "@/components/icons/HappyDemon";
import NeutralDemon from "@/components/icons/NeutralDemon";
import SadDemon from "@/components/icons/SadDemon";
import { Separator } from "@/components/ui/separator";

type DemonState = "happy" | "neutral" | "sad";

export default function GoalManager() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalText, setNewGoalText] = useState("");
  const [userXp, setUserXp] = useState(0);
  const [demonXp, setDemonXp] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const { toast } = useToast();

  const completedGoals = useMemo(() => goals.filter((g) => g.completed).length, [goals]);
  const totalGoals = goals.length;

  const demonState: DemonState = useMemo(() => {
    if (totalGoals === 0) return "neutral";
    const completionRatio = completedGoals / totalGoals;
    if (completionRatio === 1) return "happy";
    if (completionRatio > 0) return "neutral";
    return "sad";
  }, [completedGoals, totalGoals]);

  const handleAddGoal = () => {
    if (newGoalText.trim() === "") {
      toast({ title: "Goal can't be empty!", variant: "destructive" });
      return;
    }
    if (goals.length >= 3) {
      toast({ title: "Max 3 goals per day!", description: "Finish your current goals first.", variant: "destructive" });
      return;
    }
    const newGoal: Goal = {
      id: Date.now(),
      text: newGoalText.trim(),
      completed: false,
    };
    setGoals([...goals, newGoal]);
    setNewGoalText("");
  };

  const handleToggleGoal = (id: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          if (!goal.completed) {
            setUserXp((prev) => prev + 10);
            setDemonXp((prev) => prev + 15);
          } else {
            setUserXp((prev) => Math.max(0, prev - 10));
            setDemonXp((prev) => Math.max(0, prev - 15));
          }
          return { ...goal, completed: !goal.completed };
        }
        return goal;
      })
    );
  };

  const handleFinishDay = async () => {
    if (totalGoals === 0) {
        toast({ title: "No goals set!", description: "Add at least one goal to finish the day.", variant: "destructive" });
        return;
    }
    
    setIsLoadingAi(true);
    setIsModalOpen(true);
    try {
      const { message } = await getAdaptiveMessage({
        goalsCompleted: completedGoals,
        totalGoals: totalGoals,
      });
      setAiMessage(message);
    } catch (error) {
      setAiMessage("Your Procrastinemon is silent today... must be plotting.");
      toast({ title: "Error", description: "Could not get message from Procrastinemon.", variant: "destructive" });
    } finally {
        setIsLoadingAi(false);
    }
  };
  
  const resetDay = () => {
    setGoals([]);
    // XP could persist or reset, for this demo we reset
    setUserXp(0);
    setDemonXp(0);
    setIsModalOpen(false);
    setAiMessage("");
  };

  const DemonAvatar = () => {
    switch(demonState) {
        case 'happy': return <HappyDemon className="w-full h-full" />;
        case 'neutral': return <NeutralDemon className="w-full h-full" />;
        case 'sad': return <SadDemon className="w-full h-full" />;
    }
  };

  return (
    <>
      <Card className="w-full bg-card/80 border-2 border-foreground shadow-lg pixel-corners mb-8">
        <CardContent className="p-4 md:p-6 text-center">
            <div className="mx-auto w-32 h-32 md:w-48 md:h-48 mb-4 transition-transform duration-500 ease-in-out transform hover:scale-110">
                <DemonAvatar />
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold mb-2 block">USER XP</label>
                    <Progress value={userXp} className="h-4 border border-foreground" />
                </div>
                <div>
                    <label className="text-sm font-semibold mb-2 block">DEMON XP</label>
                    <Progress value={demonXp} className="h-4 border border-foreground" />
                </div>
            </div>
        </CardContent>
      </Card>
      
      <Card className="w-full bg-card/80 border-2 border-foreground shadow-lg pixel-corners">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-center">DAILY QUESTS</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex gap-2 mb-6">
            <Input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
              placeholder="Add a new quest..."
              className="font-body text-sm flex-grow bg-white"
              disabled={goals.length >= 3}
            />
            <Button onClick={handleAddGoal} className="font-body text-xs" disabled={goals.length >= 3}>
              ADD
            </Button>
          </div>

          <div className="space-y-4 min-h-[150px]">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center gap-4 p-3 rounded-md transition-all ${goal.completed ? "bg-primary/30" : "bg-secondary"}`}
              >
                <Checkbox
                  id={`goal-${goal.id}`}
                  checked={goal.completed}
                  onCheckedChange={() => handleToggleGoal(goal.id)}
                  className="w-6 h-6 border-2 border-foreground data-[state=checked]:bg-accent"
                />
                <label
                  htmlFor={`goal-${goal.id}`}
                  className={`flex-grow text-sm md:text-base cursor-pointer ${goal.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {goal.text}
                </label>
              </div>
            ))}
             {goals.length === 0 && (
                <div className="text-center text-muted-foreground py-10 text-sm">
                    Your quest log is empty. Add up to 3 quests for today!
                </div>
            )}
          </div>
          
          <Separator className="my-6 bg-border" />
          
          <div className="text-center">
            <Button onClick={handleFinishDay} size="lg" variant="default" className="font-body bg-accent hover:bg-accent/90 text-accent-foreground text-base">
              FINISH DAY
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="font-body bg-card border-foreground border-2">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-headline text-center">DAY COMPLETE!</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground pt-2">
              You completed {completedGoals} of {totalGoals} quests.
            </DialogDescription>
          </DialogHeader>
          <div className="my-6 p-4 border-2 border-dashed border-foreground rounded-md min-h-[100px] flex items-center justify-center">
            {isLoadingAi ? (
                 <p className="text-muted-foreground animate-pulse">Demon is thinking...</p>
            ) : (
                <p className="text-center text-base">"{aiMessage}"</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={resetDay} className="w-full font-body bg-accent text-accent-foreground">
              Start a New Day
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
