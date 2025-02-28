import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { calculateStats } from "@/lib/typing-utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import ResultsDisplay from "./results-display";
import type { Sentence } from "@shared/schema";

export default function TimedTest() {
  const [input, setInput] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100 });
  const [totalTyped, setTotalTyped] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: sentences, isLoading } = useQuery<Sentence[]>({
    queryKey: ["/api/sentences"],
  });

  const currentSentence = sentences?.[currentIndex]?.text || "";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      // Calculate final stats
      const finalWPM = (totalTyped / 5) * (60 / 60); // words per minute
      const finalAccuracy = (totalCorrect / totalTyped) * 100;
      setStats({ wpm: finalWPM, accuracy: finalAccuracy });
    }
  }, [timeLeft, totalTyped, totalCorrect]);

  const handleInput = (value: string) => {
    if (!isStarted || timeLeft === 0) return;
    
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    setInput(value);
    
    // Count total characters typed and correct characters
    const newCorrect = value.split('').filter((char, idx) => char === currentSentence[idx]).length;
    setTotalCorrect(prev => prev + (newCorrect - (value.length - 1 >= 0 ? value.length - 1 : 0)));
    setTotalTyped(prev => prev + 1);

    // Move to next sentence if current is completed
    if (value === currentSentence) {
      setCurrentIndex((prev) => (prev + 1) % (sentences?.length || 1));
      setInput("");
    }
  };

  const startTest = () => {
    setIsStarted(true);
    setTimeLeft(60);
    setStartTime(null);
    setInput("");
    setTotalTyped(0);
    setTotalCorrect(0);
    setCurrentIndex(0);
    inputRef.current?.focus();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-primary">
          {timeLeft}s
        </div>
        {!isStarted && (
          <Button onClick={startTest} className="gap-2">
            <Timer className="h-4 w-4" />
            Start Test
          </Button>
        )}
      </div>

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

      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        className="w-full h-24 p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={isStarted ? "Start typing..." : "Click 'Start Test' to begin"}
        disabled={!isStarted || timeLeft === 0}
      />

      {timeLeft === 0 && (
        <div className="space-y-4">
          <ResultsDisplay wpm={stats.wpm} accuracy={stats.accuracy} />
          <Button onClick={startTest} variant="outline" className="w-full gap-2">
            <Timer className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
