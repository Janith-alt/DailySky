export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - date.getTime());
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffMin < 1) return 'Updated just now';
    if (diffMin === 1) return 'Updated 1 min ago';
    if (diffMin < 60) return `Updated ${diffMin} mins ago`;
    if (diffHour === 1) return 'Updated 1 hour ago';
    if (diffHour < 24) return `Updated ${diffHour} hours ago`;
    return `Updated ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  } catch {
    return 'Updated recently';
  }
}

export function formatTimeAmPm(isoStringOrTime: string): string {
  try {
    const date = new Date(isoStringOrTime);
    if (isNaN(date.getTime())) {
      // If it's already HH:mm
      return isoStringOrTime;
    }
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return isoStringOrTime;
  }
}

export function formatHourShort(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  } catch {
    return isoString;
  }
}

export function formatDayName(isoDateString: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    const date = new Date(isoDateString);
    return date.toLocaleDateString([], { weekday: 'short' });
  } catch {
    return `Day ${index + 1}`;
  }
}

export function formatFullDate(isoDateString?: string): string {
  const date = isoDateString ? new Date(isoDateString) : new Date();
  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}
