// Reflection captures insights from Reflect/Memory/Replay stations.
export type ReflectionTag = 'breakthrough' | 'confusion' | 'reminder';

export interface Reflection {
  id: string;
  projectId: string;
  tag: ReflectionTag;
  note: string;
  createdAt: string;
}
