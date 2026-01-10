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
