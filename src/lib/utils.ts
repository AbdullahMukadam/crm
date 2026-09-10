export { cn } from "cn"

export function formatTimeAgo(date?: Date | string) {
    if (!date) return 'Recently';
    const past = new Date(date);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - past.getTime()) / 60000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
}