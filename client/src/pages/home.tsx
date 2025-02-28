import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Keyboard, Timer } from "lucide-react";
import TypingTest from "@/components/typing-test";
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
          <Tabs defaultValue="practice" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="practice" className="gap-2">
                <Keyboard className="h-4 w-4" />
                Practice Mode
              </TabsTrigger>
              <TabsTrigger value="timed" className="gap-2">
                <Timer className="h-4 w-4" />
                Timed Test
              </TabsTrigger>
            </TabsList>

            <TabsContent value="practice">
              <TypingTest />
            </TabsContent>

            <TabsContent value="timed">
              <TimedTest />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}