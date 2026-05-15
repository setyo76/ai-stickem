export interface Level {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  isActive?: boolean;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}