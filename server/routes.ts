import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/sentences", async (_req, res) => {
    const sentences = await storage.getSentences();
    res.json(sentences);
  });

  const httpServer = createServer(app);
  return httpServer;
}
