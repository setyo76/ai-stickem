export interface Level {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}