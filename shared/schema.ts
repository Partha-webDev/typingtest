import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sentences = pgTable("sentences", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
});

export const insertSentenceSchema = createInsertSchema(sentences).pick({
  text: true,
});

export type InsertSentence = z.infer<typeof insertSentenceSchema>;
export type Sentence = typeof sentences.$inferSelect;
