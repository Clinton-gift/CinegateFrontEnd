
const isIOS = () => {
  if (navigator.standalone) return false;
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua);
};

const useIosInstallPrompt = () => {
  return [isIOS(), () => {}];
};

export default useIosInstallPrompt;
