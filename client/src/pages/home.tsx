import { Card } from "@/components/ui/card";
import TimedTest from "@/components/timed-test";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
            Typing Speed Test
          </h2>
          <h1 className="text-5xl font-bold text-foreground">
            Test your typing skills
          </h1>
        </div>

        <Card className="w-full p-8">
          <TimedTest />
        </Card>
      </div>
    </div>
  );
}