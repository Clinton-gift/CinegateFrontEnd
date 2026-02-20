
import { useState } from 'react';

const getLastSeen = (key) => localStorage.getItem(key);
const setSeenToday = (key) => localStorage.setItem(key, new Date().toISOString());

function shouldPrompt(key, days = 30) {
  const lastISO = getLastSeen(key);
  if (!lastISO) return true;
  const last = new Date(lastISO);
  const diff = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
  return diff > days;
}

const useShouldShowPrompt = (key, days = 30) => {
  const [show, setShow] = useState(shouldPrompt(key, days));
  const markSeen = () => { setShow(false); setSeenToday(key); };
  return [show, markSeen];
};

export default useShouldShowPrompt;
