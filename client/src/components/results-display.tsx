import { Card, CardContent } from "@/components/ui/card";

interface ResultsDisplayProps {
  wpm: number;
  accuracy: number;
}

export default function ResultsDisplay({ wpm, accuracy }: ResultsDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round(wpm)}
            </div>
            <div className="text-sm text-muted-foreground">WPM</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round(accuracy)}%
            </div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
