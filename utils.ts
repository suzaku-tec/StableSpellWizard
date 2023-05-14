export const loadJSON = async <T>(path: string): Promise<T> => {
  const response = await fetch(path);
  const data = await response.json();
  return data as T;
};
