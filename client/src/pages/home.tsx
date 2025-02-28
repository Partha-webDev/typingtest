import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Keyboard, Timer } from "lucide-react";
import TypingTest from "@/components/typing-test";
import TimedTest from "@/components/timed-test";

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}