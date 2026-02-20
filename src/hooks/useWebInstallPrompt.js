
import { useState, useEffect } from 'react';
import useShouldShowPrompt from './useShouldShowPrompt';

const KEY = 'Taxi Identification_webInstallPromptedAt';

const useWebInstallPrompt = () => {
  const [installEvt, setInstallEvt] = useState(null);
  const [shouldShow, markSeen] = useShouldShowPrompt(KEY);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      if (shouldShow) setInstallEvt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [shouldShow]);

  const handleDeclined = () => { markSeen(); setInstallEvt(null); };
  const handleAccepted = () => {
    if (!installEvt) return;
    installEvt.prompt();
    installEvt.userChoice.then((choice) => {
      if (choice.outcome !== 'accepted') markSeen();
      setInstallEvt(null);
    });
  };

  return [installEvt, handleDeclined, handleAccepted];
};

export default useWebInstallPrompt;
