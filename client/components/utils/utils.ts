export function getFromLocalStorage(key: string): string | null {
  const value = localStorage.getItem(key);
  return value ? value : null;
}
export function setToLocalStorage(key: string,value: string): void {
  localStorage.setItem(key,value);
}