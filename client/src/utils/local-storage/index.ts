type ValueType = number | string;

export const setLocalStorage = (key: string, value: ValueType): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getLocalStorage = (key: string): string | null => {
  if (typeof window !== "undefined") {
    const storedItem = localStorage.getItem(key);
    return storedItem ? JSON.parse(storedItem) : null;
  }
  return null;
};

export const setWithExpiry = (
  key: string,
  value: ValueType,
  ttl: number
): void => {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(item));
  }
};

interface ItemWithExpiry {
  value: ValueType;
  expiry: number;
}

export const getWithExpiry = (key: string): ValueType | null => {
  if (typeof window !== "undefined") {
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item: ItemWithExpiry = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }
  return null;
};

export const removeLocalStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
