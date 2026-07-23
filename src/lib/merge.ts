type TimestampedEntry = { updatedAt: string };

/**
 * Last-write-wins merge of two progress maps (word or pattern), keyed by
 * id. For each id present on either side, the entry with the newer
 * `updatedAt` wins; local wins ties (no need to overwrite what's already
 * there with an identical remote copy).
 */
export function mergeProgressMaps<T extends TimestampedEntry>(
  local: Record<string, T>,
  remote: Record<string, T>,
): Record<string, T> {
  const merged: Record<string, T> = { ...local };

  for (const [id, remoteEntry] of Object.entries(remote)) {
    const localEntry = merged[id];
    if (!localEntry) {
      merged[id] = remoteEntry;
      continue;
    }
    const remoteTime = new Date(remoteEntry.updatedAt).getTime();
    const localTime = new Date(localEntry.updatedAt).getTime();
    if (remoteTime > localTime) {
      merged[id] = remoteEntry;
    }
  }

  return merged;
}
