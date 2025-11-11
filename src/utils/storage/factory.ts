// Session Storage Methods

export function hasSessionItem(key: string): boolean { 
  return sessionStorage.getItem(key) !== null; 
};

export function setSessionItem(key: string, value: string): void {
  sessionStorage.setItem(key, value);
};

export function setManySessionItems(items: { [key: string]: string }): void {
  Object.keys(items).forEach(key => {
    sessionStorage.setItem(key, items[key]);
  });
};

export function getSessionItemsOnPartialKey(partialKey: string): { [key: string]: string | null } {
  const items: { [key: string]: string | null } = {};
  for(let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if(key && key.includes(partialKey)) {
      const item = sessionStorage.getItem(key);
      items[key] = item ? JSON.parse(item) : null;
    };
  };
  return items;
};

export function getSessionItem(key: string): string | null {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export function getManySessionItems(keys: string[]): { [key: string]: string | null } {
  const items: { [key: string]: string | null } = {};
  keys.forEach(key => {
    const item = sessionStorage.getItem(key);
    items[key] = item ? JSON.parse(item) : null;
  });
  return items;
};

export function removeSessionItemsOnPartialKey(partialKey: string): void {
  const keysToRemove: string[] = [];
  for(let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if(key && key.includes(partialKey)) {
      keysToRemove.push(key);
    };
  };
  keysToRemove.forEach(key => {
    sessionStorage.removeItem(key);
  });
};

export function removeSessionItem(key: string): void {
  sessionStorage.removeItem(key);
};

export function removeManySessionItems(keys: string[]): void {
  keys.forEach(key => {
    sessionStorage.removeItem(key);
  });
};

export function clearSession(): void {
  sessionStorage.clear();
};

// Local Storage Methods

export function hasLocalItem(key: string): boolean {
  return localStorage.getItem(key) !== null;
};

export function setLocalItem(key: string, value: string): void {
  localStorage.setItem(key, value);
};

export function setManyLocalItems(items: { [key: string]: string }): void {
  Object.keys(items).forEach(key => {
    localStorage.setItem(key, items[key]);
  });
};

export function getLocalItemsOnPartialKey(partialKey: string): { [key: string]: string | null } {
  const items: { [key: string]: string | null } = {};
  for(let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if(key && key.includes(partialKey)) {
      const item = localStorage.getItem(key);
      items[key] = item ? JSON.parse(item) : null;
    };
  };
  return items;
};

export function getLocalItem(key: string): string | null {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export function getManyLocalItems(keys: string[]): { [key: string]: string | null } {
  const items: { [key: string]: string | null } = {};
  keys.forEach(key => {
    const item = localStorage.getItem(key);
    items[key] = item ? JSON.parse(item) : null;
  });
  return items;
};

export function removeLocalItemsOnPartialKey(partialKey: string): void {
  const keysToRemove: string[] = [];
  for(let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if(key && key.includes(partialKey)) {
      keysToRemove.push(key);
    };
  };
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
};

export function removeLocalItem(key: string): void {
  localStorage.removeItem(key);
};

export function removeManyLocalItems(keys: string[]): void {
  keys.forEach(key => {
    localStorage.removeItem(key);
  });
};

export function clearLocal(): void {
  localStorage.clear();
};

// Cookie Methods

export function hasCookie(name: string): boolean { 
  return getCookie(name) !== null; 
};

// * 864e5 is milliseconds in a day, scientific notation for better readability equals 86400000
export function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

export function removeCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};