import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { calculateStats } from "@/lib/typing-utils";
import type { Sentence } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function TimedTest() {
  const [input, setInput] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState({
    wpm: 0,
    charsPerMin: 0,
    accuracy: 100,
  });
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
      const finalWPM = (totalTyped / 5) * (60 / 60); // words per minute
      const finalCharsPerMin = totalTyped * (60 / 60); // characters per minute
      const finalAccuracy = (totalCorrect / totalTyped) * 100;
      setStats({
        wpm: finalWPM,
        charsPerMin: finalCharsPerMin,
        accuracy: finalAccuracy,
      });
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
    setStats({ wpm: 0, charsPerMin: 0, accuracy: 100 });
    inputRef.current?.focus();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const circleRadius = 35;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = ((60 - timeLeft) / 60) * circumference;

  return (
    <div className="space-y-8">
      <div className="flex justify-center items-center gap-16">
        {/* Timer */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={circleRadius}
              className="fill-none stroke-muted"
              strokeWidth="4"
            />
            <circle
              cx="48"
              cy="48"
              r={circleRadius}
              className="fill-none stroke-primary"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{timeLeft}</div>
              <div className="text-xs text-muted-foreground">seconds</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold">{Math.round(stats.wpm)}</div>
            <div className="text-sm text-muted-foreground">words/min</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{Math.round(stats.charsPerMin)}</div>
            <div className="text-sm text-muted-foreground">chars/min</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{Math.round(stats.accuracy)}</div>
            <div className="text-sm text-muted-foreground">% accuracy</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {!isStarted ? (
          <Button
            onClick={startTest}
            className="w-full text-lg py-8"
            variant="outline"
          >
            Start typing
          </Button>
        ) : (
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full h-24 p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-muted/5"
            placeholder={timeLeft > 0 ? currentSentence : "Test completed!"}
            disabled={timeLeft === 0}
          />
        )}
      </div>
    </div>
  );
}