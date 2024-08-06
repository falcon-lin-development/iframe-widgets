export const formatTime = (time: number): string => {
  // if within 1 minute, show x seconds ago
  // if within 1 hour, show x minutes ago
  // if within 24 hours, show x hours ago
  // if within 1 week, show x days ago
  // if within 1 month, show x weeks ago
  // if within 1 year, show x months ago
  // otherwise, show x years ago
  const now = new Date();
  const diff = now.getTime() - time;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (months <= 0) {
    return `${weeks} weeks ago`;
  } else if (months < 12) {
    return `${months} months ago`;
  } else {
    return `${years} years ago`;
  }
};

export const formatTimeConcise = (time: number): string => {
  // if within 1 minute, show x seconds ago
  // if within 1 hour, show x minutes ago
  // if within 24 hours, show x hours ago
  // if within 1 week, show x days ago
  // if within 1 month, show x weeks ago
  // if within 1 year, show x months ago
  // otherwise, show x years ago
  const now = new Date();
  const diff = now.getTime() - time;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    return `${seconds}s`;
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 7) {
    return `${days}d`;
  } else if (months <= 0) {
    return `${weeks}w`;
  } else if (months < 12) {
    return `${months}m`;
  } else {
    return `${years}y`;
  }
};
