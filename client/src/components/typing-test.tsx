import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { calculateStats } from "@/lib/typing-utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import ResultsDisplay from "./results-display";
import type { Sentence } from "@shared/schema";

export default function TypingTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100 });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: sentences, isLoading } = useQuery<Sentence[]>({
    queryKey: ["/api/sentences"],
  });

  const currentSentence = sentences?.[currentIndex]?.text || "";

  useEffect(() => {
    if (input && !startTime) {
      setStartTime(Date.now());
    }
  }, [input, startTime]);

  useEffect(() => {
    if (startTime && input.length > 0) {
      const stats = calculateStats(currentSentence, input, startTime);
      setStats(stats);
    }
  }, [input, currentSentence, startTime]);

  const handleInput = (value: string) => {
    if (isComplete) return;
    setInput(value);
    
    if (value === currentSentence) {
      setIsComplete(true);
    }
  };

  const reset = () => {
    setInput("");
    setStartTime(null);
    setIsComplete(false);
    setStats({ wpm: 0, accuracy: 100 });
    setCurrentIndex((prev) => (prev + 1) % (sentences?.length || 1));
    inputRef.current?.focus();
  };

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  const progress = (input.length / currentSentence.length) * 100;

  return (
    <div className="space-y-6">
      <div className="text-xl font-medium leading-relaxed break-words">
        {currentSentence.split("").map((char, idx) => {
          const inputChar = input[idx];
          const isCorrect = inputChar === char;
          const isCurrent = idx === input.length;
          
          return (
            <span
              key={idx}
              className={`${
                inputChar === undefined
                  ? "text-muted-foreground"
                  : isCorrect
                  ? "text-green-500"
                  : "text-red-500 bg-red-100"
              } ${isCurrent ? "border-b-2 border-primary" : ""}`}
            >
              {char}
            </span>
          );
        })}
      </div>

      <div className="space-y-4">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          className="w-full h-24 p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Start typing..."
          autoFocus
        />

        <div className="flex items-center justify-between">
          <Progress value={progress} className="w-1/2" />
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <ResultsDisplay wpm={stats.wpm} accuracy={stats.accuracy} />
      </div>
    </div>
  );
}
