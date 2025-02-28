import { sentences, type Sentence, type InsertSentence } from "@shared/schema";

export interface IStorage {
  getSentences(): Promise<Sentence[]>;
  addSentence(sentence: InsertSentence): Promise<Sentence>;
}

export class MemStorage implements IStorage {
  private sentences: Map<number, Sentence>;
  private currentId: number;

  constructor() {
    this.sentences = new Map();
    this.currentId = 1;
    
    // Add some default sentences
    const defaultSentences = [
      "The quick brown fox jumps over the lazy dog.",
      "Pack my box with five dozen liquor jugs.",
      "How vexingly quick daft zebras jump!",
      "The five boxing wizards jump quickly.",
      "Sphinx of black quartz, judge my vow.",
    ];

    defaultSentences.forEach(text => {
      this.addSentence({ text });
    });
  }

  async getSentences(): Promise<Sentence[]> {
    return Array.from(this.sentences.values());
  }

  async addSentence(insertSentence: InsertSentence): Promise<Sentence> {
    const id = this.currentId++;
    const sentence: Sentence = { ...insertSentence, id };
    this.sentences.set(id, sentence);
    return sentence;
  }
}

export const storage = new MemStorage();
