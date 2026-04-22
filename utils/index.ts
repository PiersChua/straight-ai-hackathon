export const getDisplayDate = (date: Date) => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays >= 7) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(postDate);
  }

  if (diffInDays >= 1) return `${diffInDays}d ago`;

  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  if (diffInHours >= 1) return `${diffInHours}h ago`;

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  return `${diffInMinutes}m ago`;
};
