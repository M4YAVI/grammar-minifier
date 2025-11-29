import { randomUUID } from "crypto";

export interface IStorage {
}

export class MemStorage implements IStorage {
  constructor() {
  }
}

export const storage = new MemStorage();
