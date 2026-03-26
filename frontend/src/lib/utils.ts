export const saveToStorage = <T>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const clearStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.clear();
};

export const loadFromStorage = (key: string) => {
  if (typeof window === "undefined") return null;

  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;

  try {
    return JSON.parse(encrypted);
  } catch {
    return null;
  }
};

function getOrdinal(n: number) {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export const formattedDateTime = (iso: string) => {
  const date = new Date(iso);
  const day = date.getDate();
  const suffix = getOrdinal(day);

  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const time = date.toLocaleString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}${suffix} ${month}, ${year} — ${time}`;
};

export const getRankStyle = (rank: number) => {
  if (rank === 1) return "bg-yellow-100 border-yellow-300";
  if (rank === 2) return "bg-slate-200 border-slate-300";
  if (rank === 3) return "bg-orange-100 border-orange-300";
  return "bg-light border-color";
};

export const getRankDisplay = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `${rank}.`;
};
