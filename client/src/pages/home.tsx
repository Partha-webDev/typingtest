import { Card, CardContent } from "@/components/ui/card";
import { Keyboard } from "lucide-react";
import TypingTest from "@/components/typing-test";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Keyboard className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Typing Speed Test
          </h1>
        </div>

        <Card className="w-full">
          <CardContent className="pt-6">
            <TypingTest />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
