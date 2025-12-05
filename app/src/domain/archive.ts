// ArchiveEntry stores checkpoints from Memory/Replay (Time Tunnels).
export interface ArchiveEntry {
  id: string;
  projectId: string;
  label: string;
  summary?: string;
  snapshot?: unknown;
  createdAt: string;
}
