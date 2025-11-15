export type Role = "user" | "model";

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  model: string;
  messages: ChatMessage[];
}
