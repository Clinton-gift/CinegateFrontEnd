import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HeroSection({ onOpenDemo }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require("../../../assets/hero_bg.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* ✅ Brighter overlay */}
        <View style={styles.overlay} />

        {/* ✅ Softer vignette */}
        <View style={styles.vignetteTop} />
        <View style={styles.vignetteBottom} />

        {/* Top bar */}
        <View
          style={[
            styles.topBar,
            isMobile && {
              paddingTop: 16,
              paddingHorizontal: 14,
            },
          ]}
        >
          <Image
            source={require("../../../assets/cinegate_logo.png")}
            style={[styles.logo, isMobile && { width: 170, height: 44 }]}
            resizeMode="contain"
          />

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.langBtn,
              isMobile && {
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 9,
              },
            ]}
          >
            <Text style={[styles.langIcon, isMobile && { fontSize: 14 }]}>🌐</Text>
            <Text style={[styles.langText, isMobile && { fontSize: 14 }]}>English</Text>
            <Text style={[styles.langCaret, isMobile && { fontSize: 12 }]}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* Center content */}
        <View
          style={[
            styles.content,
            {
              paddingHorizontal: isMobile ? 18 : 24,

              // ✅ MOBILE: restore top spacing and add bottom breathing room
              paddingTop: isMobile ? 110 : 110,
              paddingBottom: isMobile ? 120 : 90,

              // ✅ MOBILE: let content occupy the hero height so CTA can sit lower
              justifyContent: isMobile ? "space-between" : "flex-start",
              flexGrow: isMobile ? 1 : 0,
            },
          ]}
        >
          {/* Top text block */}
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.kicker, { fontSize: isMobile ? 16 : 22 }]}>
              African films. Licensed for public screening.
            </Text>

            <Text
              style={[
                styles.headline,
                {
                  fontSize: isMobile ? 36 : 56,
                  lineHeight: isMobile ? 42 : 60,
                  paddingHorizontal: isMobile ? 6 : 0,
                },
              ]}
            >
              Pay once. <Text style={styles.headlineAccent}>Screen once.</Text>
            </Text>

            <Text
              style={[
                styles.sub,
                {
                  fontSize: isMobile ? 15 : 18,
                  lineHeight: isMobile ? 22 : 26,
                  paddingHorizontal: isMobile ? 10 : 0,
                },
              ]}
            >
              Built for cinemas, bars, schools and cultural spaces — not for streaming.
            </Text>
          </View>

          {/* CTA block (pushed lower on mobile) */}
          <View style={{ width: "100%", alignItems: "center", marginTop: isMobile ? 40 : 26 }}>
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={onOpenDemo}
              style={[
                styles.ctaShadowWrap,
                isMobile && {
                  width: "100%",
                  minWidth: undefined,
                  alignSelf: "stretch",
                },
              ]}
            >
              <LinearGradient
                colors={["#F29B1E", "#E07A15", "#C85E0B"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[
                  styles.ctaGradient,
                  isMobile && { paddingVertical: 14, paddingHorizontal: 18 },
                ]}
              >
                <View style={styles.ctaTopHighlight} />

                <View style={styles.ctaRow}>
                  <Text style={[styles.ctaPlay, isMobile && { fontSize: 22 }]}>▶</Text>

                  <Text
                    style={[styles.ctaText, isMobile && { fontSize: 22 }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Download Demo Film
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onOpenDemo}
              style={styles.secondaryLink}
            >
              <Text style={[styles.secondaryText, isMobile && { fontSize: 15 }]}>
                See how the one-time license works <Text style={styles.secondaryArrow}>›</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#000",
  },

  bg: {
    width: "100%",
    minHeight: Platform.OS === "web" ? "100vh" : 740,
    justifyContent: "flex-start",
  },

  // ✅ brightness control
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  vignetteTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 140,
    backgroundColor: "rgba(0,0,0,0.16)",
  },

  vignetteBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
    backgroundColor: "rgba(0,0,0,0.22)",
  },

  topBar: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    paddingTop: 22,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    width: 220,
    height: 52,
  },

  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(0,0,0,0.16)",
  },

  langIcon: { color: "#fff", fontSize: 16 },
  langText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  langCaret: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginLeft: 2 },

  content: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: 980,
    alignSelf: "center",
    paddingTop: 110,
    paddingBottom: 90,
    alignItems: "center",
  },

  kicker: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "500",
    marginBottom: 14,
    textAlign: "center",
    maxWidth: 900,
  },

  headline: {
    color: "#fff",
    fontWeight: "800",
    letterSpacing: -0.6,
    textAlign: "center",
    maxWidth: 980,
  },

  headlineAccent: {
    color: "#F09A2B",
  },

  sub: {
    marginTop: 14,
    color: "rgba(255,255,255,0.78)",
    maxWidth: 760,
    textAlign: "center",
    lineHeight: 26,
  },

  // ✅ CTA button styles
  ctaShadowWrap: {
    marginTop: 0, // ✅ handled by wrapper View so we can push it down on mobile
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    minWidth: 300,
    alignSelf: "center",
  },

  ctaGradient: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
  },

  ctaTopHighlight: {
    position: "absolute",
    left: 1,
    right: 1,
    top: 1,
    height: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },

  ctaPlay: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 1,
  },

  ctaText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  secondaryLink: {
    marginTop: 14,
  },

  secondaryText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 16,
    fontWeight: "500",
  },

  secondaryArrow: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 18,
  },
});