import { useState, useEffect, useCallback } from "react";

const API_KEY_STORAGE_KEY = "openrouter_api_key";

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === API_KEY_STORAGE_KEY) {
        setApiKey(e.newValue || "");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const updateApiKey = useCallback((key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKey("");
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }, []);

  return { apiKey, updateApiKey, clearApiKey };
}

export { API_KEY_STORAGE_KEY };
