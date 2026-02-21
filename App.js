// App.js — CineBridge Frontend (Expo SDK 51 compatible)
// ✅ Web: render in a real <div> so scrolling/layout works normally
// ✅ Native: keep <View>
// ✅ Keeps PWA install prompt + fonts + i18n

import React, { useEffect, useRef, useState, createContext } from "react";
import {
  Platform,
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import "./src/global.css";

// ✅ i18n provider
import { LanguageProvider } from "./src/i18n";

// ✅ CineBridge page
import CineBridgeLandingPage from "./src/pages/CineBridgeLandingPage";

export const AppContext = createContext();

const COLORS = {
  primary: "#024A59",
  secondary: "#D99178",
  text: "#0b1a1f",
  white: "#ffffff",
};

// Loading component
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

// Button component (used in install prompt)
const Button = ({ title, onPress, variant = "primary", style }) => {
  const buttonStyle = [
    styles.button,
    variant === "secondary" ? styles.buttonSecondary : styles.buttonPrimary,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    variant === "secondary" ? styles.buttonTextSecondary : styles.buttonTextPrimary,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

function InstallPrompt({ visible, onClose, deferredEvent }) {
  const isIOS =
    Platform.OS === "ios" ||
    (Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent));

  const canPrompt = !!deferredEvent;

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Image
              source={require("./assets/icons/vidicon.png")}
              style={{ width: 35, height: 35, borderRadius: 6 }}
            />
            <Text style={styles.modalTitle}>Install the app</Text>
          </View>

          {isIOS ? (
            <Text style={styles.modalText}>
              On iPhone/iPad: tap the Share button in Safari, then choose “Add to Home Screen”.
            </Text>
          ) : (
            <View>
              <Text style={styles.modalText}>
                {canPrompt
                  ? "Install this app for faster access."
                  : "To install: open your browser menu and choose “Install app” / “Add to Home screen”."}
              </Text>

              <Button
                title={canPrompt ? "Install now" : "OK"}
                onPress={() => {
                  if (deferredEvent) deferredEvent.prompt();
                  onClose();
                }}
                variant="secondary"
                style={{ marginTop: 12 }}
              />
            </View>
          )}

          <TouchableOpacity onPress={onClose} style={{ marginTop: 16, alignItems: "center" }}>
            <Text style={[styles.modalText, { color: COLORS.primary, fontWeight: "600" }]}>
              Later
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  // ✅ PWA install prompt behavior (web only)
  const [showPrompt, setShowPrompt] = useState(false);
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const isStandalone =
      (typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(display-mode: standalone)").matches) ||
      (typeof navigator !== "undefined" && navigator.standalone === true);

    let timer;

    const onBIP = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      if (!isStandalone) setShowPrompt(true);
    };

    const showSoon = () => {
      if (!isStandalone) setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    timer = setTimeout(showSoon, 1200);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <LanguageProvider>
      <AppContext.Provider value={{}}>
        {/* ✅ KEY FIX: use a real web div so the page scrolls and sections render normally */}
        {Platform.OS === "web" ? (
          <div
            style={{
              minHeight: "100vh",
              width: "100%",
              overflowX: "hidden",
              background: "#000",
            }}
          >
            <CineBridgeLandingPage />

            <InstallPrompt
              visible={showPrompt}
              onClose={() => setShowPrompt(false)}
              deferredEvent={deferredPromptRef.current}
            />

            <ExpoStatusBar style="auto" />
          </div>
        ) : (
          <View style={styles.container}>
            <CineBridgeLandingPage />
            <ExpoStatusBar style="auto" />
          </View>
        )}
      </AppContext.Provider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: "Montserrat_400Regular",
  },

  button: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  buttonPrimary: { backgroundColor: COLORS.primary },
  buttonSecondary: { backgroundColor: COLORS.secondary },
  buttonText: { fontFamily: "Montserrat_700Bold", fontSize: 16 },
  buttonTextPrimary: { color: COLORS.white },
  buttonTextSecondary: { color: COLORS.text },

  modalBackdrop: {
    ...Platform.select({ web: { position: "fixed" }, default: { position: "absolute" } }),
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalSheet: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: { fontFamily: "Montserrat_700Bold", fontSize: 18, color: COLORS.text },
  modalText: { fontFamily: "Montserrat_400Regular", color: COLORS.text },
});