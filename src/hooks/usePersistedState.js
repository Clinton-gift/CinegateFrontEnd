import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await AsyncStorage.getItem(key);
        if (saved !== null) {
          setState(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading state: - usePersistedState.js:16', error);
      } finally {
        setLoading(false);
      }
    };
    loadState();
  }, [key]);

  useEffect(() => {
    if (!loading) {
      const saveState = async () => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
          console.error('Error saving state: - usePersistedState.js:30', error);
        }
      };
      saveState();
    }
  }, [state, key, loading]);

  return [state, setState, loading];
}