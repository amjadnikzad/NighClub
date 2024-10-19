export function getFromLocalStorage(key: string): string | null {
    const value = localStorage.getItem(key);
    return value ? value : null;
  }