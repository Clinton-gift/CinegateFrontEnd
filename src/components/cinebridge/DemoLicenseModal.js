import React, { useEffect, useMemo, useState } from "react";
import whyBg from "../../../assets/why_section_bg.png";

// ✅ your assets (all inside assets)
import posterImg from "../../../assets/poster.jpeg";
import clapperIcon from "../../../assets/clapper_icon.png";
import clockIcon from "../../../assets/clock.png";
import checkIcon from "../../../assets/check.png";
import shieldIcon from "../../../assets/shield.png";
import oneIcon from "../../../assets/one.png";

// ✅ new icons/images you added
import macIcon from "../../../assets/mac.png";
import videoIcon from "../../../assets/video.png";
import windowsIcon from "../../../assets/windows.png";

// ✅ convert Metro assets to usable web URLs
import { assetUri } from "../../lib/assetUri"; // <-- adjust if your path differs

const API_BASE =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://api.cinegates.com"
    : "http://localhost:4010";

async function createDemoSession(payload = {}) {
  const res = await fetch(`${API_BASE}/api/demo/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(
      data?.error || data?.message || `Request failed (${res.status})`
    );
  }
  return data;
}

function triggerDownload(url) {
  window.location.assign(url);
}

export default function DemoLicenseModal({ open, onClose, onStartDownload }) {
  const [downloadOpen, setDownloadOpen] = useState(false);

  // session state
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState("");

  // ✅ build URIs once (works on web + keeps your images stable)
  const uris = useMemo(() => {
    return {
      whyBg: assetUri(whyBg),
      poster: assetUri(posterImg),
      clapper: assetUri(clapperIcon),
      clock: assetUri(clockIcon),
      check: assetUri(checkIcon),
      shield: assetUri(shieldIcon),
      one: assetUri(oneIcon),
      mac: assetUri(macIcon),
      video: assetUri(videoIcon),
      windows: assetUri(windowsIcon),
    };
  }, []);

  useEffect(() => {
    if (!open && downloadOpen) setDownloadOpen(false);
  }, [open, downloadOpen]);

  useEffect(() => {
    if (!open && !downloadOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, downloadOpen]);

  // Reset session state when modal fully closes
  useEffect(() => {
    if (!open) {
      setSession(null);
      setSessionLoading(false);
      setSessionError("");
    }
  }, [open]);

  if (!open) return null;

  const ensureSession = async () => {
    if (session || sessionLoading) return session;
    setSessionLoading(true);
    setSessionError("");
    try {
      const data = await createDemoSession({});
      setSession(data);
      return data;
    } catch (e) {
      setSessionError(e?.message || "Failed to create download session");
      return null;
    } finally {
      setSessionLoading(false);
    }
  };

  const handleStartDemoDownload = async () => {
    if (onStartDownload) onStartDownload();
    setDownloadOpen(true);
    await ensureSession();
  };

  return (
    <>
      <div style={S.overlay} onClick={onClose} role="presentation">
        <style>{css}</style>

        <div
          style={S.panel}
          className="cg-modal-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-license-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ ...S.panelBg, backgroundImage: `url(${uris.whyBg})` }} />
          <div style={S.panelVignette} />

          {/* ✅ IMPORTANT: this is the scroll container */}
          <div style={S.content} className="cg-content">
            {/* Header */}
            <div style={S.headerRow} className="cg-header">
              <div />
              <div style={S.headerCenter}>
                <h3 id="demo-license-title" style={S.title} className="cg-title">
                  Demo Screening License
                </h3>
                <p style={S.subtitle} className="cg-subtitle">
                  This demo film can be screened only once. After playback,
                  access expires automatically.
                </p>
              </div>

              <button
                onClick={onClose}
                style={S.closeBtn}
                className="cg-close"
                aria-label="Close modal"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Main */}
            <div style={S.main} className="cg-main">
              {/* Poster card (shows FIRST on mobile now) */}
              <div style={S.leftCard} className="cg-left">
                <div style={S.posterFrame} className="cg-poster-frame">
                  <img
                    src={uris.poster}
                    alt="Demo film poster"
                    style={S.posterImg}
                    className="cg-poster-img"
                    draggable={false}
                  />
                </div>

                <div style={S.metaRow}>
                  <span style={S.metaItem}>
                    <span style={S.metaIcon}>
                      <img src={uris.clock} alt="" style={S.metaIconImg} />
                    </span>
                    <span style={S.timeText}>3 min</span>
                  </span>
                </div>

                <div style={S.metaRow}>
                  <span style={S.metaItem}>
                    <span style={S.metaIcon}>
                      <img src={uris.check} alt="" style={S.metaIconImg} />
                    </span>
                    Single-use demo license
                  </span>
                </div>
              </div>

              {/* Steps */}
              <div style={S.stepsCol} className="cg-right">
                <div style={S.stepCard} className="cg-step">
                  <div style={S.stepIconCircle} className="cg-step-icon">
                    <img src={uris.one} alt="Step 1" style={S.stepIconImg} />
                  </div>
                  <div>
                    <div style={S.stepTitle} className="cg-step-title">
                      Download Demo Film
                    </div>
                    <div style={S.stepText} className="cg-step-text">
                      Download the secure demo film file through CineGate.
                    </div>
                  </div>
                </div>

                <div style={S.stepCard} className="cg-step">
                  <div style={S.stepIconBox} className="cg-step-icon">
                    <img src={uris.shield} alt="Secure player" style={S.stepIconImg} />
                  </div>
                  <div>
                    <div style={S.stepTitle} className="cg-step-title">
                      Download &amp; Install Secure Player
                    </div>
                    <div style={S.stepText} className="cg-step-text">
                      Install the CineGate Player required for playback.
                    </div>
                  </div>
                </div>

                <div style={S.stepCard} className="cg-step">
                  <div style={S.stepIconBox} className="cg-step-icon">
                    <img src={uris.clapper} alt="Play in player" style={S.stepIconImg} />
                  </div>
                  <div>
                    <div style={S.stepTitle} className="cg-step-title">
                      Play Demo in Player
                    </div>
                    <div style={S.stepText} className="cg-step-text">
                      Open the player and enjoy the demo film one time.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer CTA (inside scroll, so you can reach it) */}
            <div style={S.footer} className="cg-footer">
              <div style={S.footerDivider} />
              <div style={S.footerTitle} className="cg-footer-title">
                Start Demo Download
              </div>

              {sessionError ? (
                <div
                  style={{
                    marginBottom: 10,
                    color: "rgba(255,120,120,0.95)",
                    fontWeight: 700,
                  }}
                >
                  {sessionError}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleStartDemoDownload}
                style={{
                  ...S.ctaBtn,
                  opacity: sessionLoading ? 0.85 : 1,
                  cursor: sessionLoading ? "progress" : "pointer",
                }}
                className="cg-cta"
                disabled={sessionLoading}
              >
                <span style={S.ctaTriangle} aria-hidden="true" />
                <span style={S.ctaLabel}>
                  {sessionLoading ? "Preparing download..." : "Start Demo Download"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ SECOND MODAL (no change requested) */}
      <DemoDownloadOptionsModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        session={session}
        ensureSession={ensureSession}
        sessionLoading={sessionLoading}
        sessionError={sessionError}
        uris={uris}
      />
    </>
  );
}

/* ---------------------------
   SECOND MODAL
---------------------------- */
function DemoDownloadOptionsModal({
  open,
  onClose,
  session,
  ensureSession,
  sessionLoading,
  sessionError,
  uris,
}) {
  if (!open) return null;

  const downloadWithSession = async (which) => {
    const s = session || (await ensureSession());
    if (!s) return;

    if (which === "windows") triggerDownload(s.playerWinUrl);
    if (which === "mac") triggerDownload(s.playerMacUrl);
    if (which === "film") triggerDownload(s.filmUrl);
  };

  return (
    <div style={D.overlay} onClick={onClose} role="presentation">
      <div
        style={D.panel}
        className="cg-download-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ ...D.panelBg, backgroundImage: `url(${uris.whyBg})` }} />
        <div style={D.panelVignette} />

        <div style={D.content} className="cg-download-content">
          <div style={D.headerRow} className="cg-download-header">
            <div />
            <div style={D.headerCenter}>
              <h3 id="download-modal-title" style={D.title} className="cg-download-title">
                Download Required Files
              </h3>
              <p style={D.subtitle} className="cg-download-subtitle">
                Download the CineGate Player for your device and the Demo Film.
              </p>
            </div>

            <button
              onClick={onClose}
              style={D.closeBtn}
              className="cg-download-close"
              aria-label="Close modal"
              type="button"
            >
              ✕
            </button>
          </div>

          <div style={D.cards} className="cg-download-cards">
            <button
              type="button"
              style={{
                ...D.cardBtn,
                opacity: sessionLoading ? 0.75 : 1,
                cursor: sessionLoading ? "progress" : "pointer",
              }}
              onClick={() => downloadWithSession("windows")}
              disabled={sessionLoading}
              className="cg-download-card"
            >
              <div style={D.cardIconWrap} className="cg-download-iconwrap">
                <img src={uris.windows} alt="" style={D.cardIcon} className="cg-download-icon" />
              </div>
              <div>
                <div style={D.cardTitle} className="cg-download-card-title">
                  Download CineGate Player (Windows)
                </div>
                <div style={D.cardText} className="cg-download-card-text">
                  Install the secure player required for playback on Windows.
                </div>
              </div>
            </button>

            <button
              type="button"
              style={{
                ...D.cardBtn,
                opacity: sessionLoading ? 0.75 : 1,
                cursor: sessionLoading ? "progress" : "pointer",
              }}
              onClick={() => downloadWithSession("mac")}
              disabled={sessionLoading}
              className="cg-download-card"
            >
              <div style={D.cardIconWrap} className="cg-download-iconwrap">
                <img src={uris.mac} alt="" style={D.cardIcon} className="cg-download-icon" />
              </div>
              <div>
                <div style={D.cardTitle} className="cg-download-card-title">
                  Download CineGate Player (Mac)
                </div>
                <div style={D.cardText} className="cg-download-card-text">
                  Install the secure player required for playback on macOS.
                </div>
              </div>
            </button>

            <button
              type="button"
              style={{
                ...D.cardBtn,
                opacity: sessionLoading ? 0.75 : 1,
                cursor: sessionLoading ? "progress" : "pointer",
              }}
              onClick={() => downloadWithSession("film")}
              disabled={sessionLoading}
              className="cg-download-card"
            >
              <div style={D.cardIconWrap} className="cg-download-iconwrap">
                <img src={uris.video} alt="" style={D.cardIcon} className="cg-download-icon" />
              </div>
              <div>
                <div style={D.cardTitle} className="cg-download-card-title">
                  Download Demo Film
                </div>
                <div style={D.cardText} className="cg-download-card-text">
                  Download the secure one-time demo film file.
                </div>
              </div>
            </button>
          </div>

          <div style={D.footerRow} className="cg-download-footer">
            <button type="button" style={D.secondaryBtn} onClick={onClose}>
              Close
            </button>
          </div>

          {sessionError ? (
            <div style={{ textAlign: "center", color: "rgba(255,120,120,0.95)", fontWeight: 700 }}>
              {sessionError}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
const S = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    zIndex: 9999,
  },

  panel: {
    position: "relative",
    width: "min(820px, calc(100vw - 64px))",
    maxHeight: "92dvh", // ✅ critical: stable on mobile (dynamic viewport)
    borderRadius: 14,
    border: "1px solid rgba(255,170,80,0.32)",
    overflow: "hidden",
    boxShadow: "0 26px 90px rgba(0,0,0,0.60)",
  },

  panelBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(1.12) contrast(1.06) saturate(1.06)",
    transform: "scale(1.02)",
    zIndex: 0,
  },

  panelVignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(75% 80% at 50% 24%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.42) 70%, rgba(0,0,0,0.62) 100%)",
    zIndex: 1,
    pointerEvents: "none",
  },

  // ✅ This scrolls on mobile + still looks normal on desktop
  content: {
    position: "relative",
    zIndex: 2,
    maxHeight: "92dvh",
    padding: "22px 28px",
    color: "#fff",
    display: "grid",
    gridTemplateRows: "auto auto auto", // ✅ no 1fr trapping on small screens
    rowGap: 14,
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
  },

  headerRow: {
    display: "grid",
    gridTemplateColumns: "40px 1fr 40px",
    alignItems: "start",
    gap: 10,
  },

  headerCenter: { textAlign: "center", paddingTop: 2 },

  title: {
    margin: 0,
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.05,
    textShadow: "0 10px 35px rgba(0,0,0,0.45)",
  },

  subtitle: {
    margin: "8px auto 0",
    maxWidth: 760,
    fontSize: 16.5,
    lineHeight: 1.45,
    color: "rgba(255,255,255,0.74)",
    textShadow: "0 8px 26px rgba(0,0,0,0.40)",
  },

  closeBtn: {
    justifySelf: "end",
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.20)",
    color: "rgba(255,255,255,0.88)",
    fontSize: 22,
    cursor: "pointer",
    lineHeight: "40px",
  },

  main: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: 16,
    alignItems: "stretch",
  },

  leftCard: {
    borderRadius: 12,
    border: "1px solid rgba(255,170,80,0.26)",
    background: "rgba(0,0,0,0.20)",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)",
    padding: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    boxSizing: "border-box",
  },

  posterFrame: {
    width: "calc(100% + 24px)",
    marginLeft: 69,
    marginRight: 12,
    marginTop: 12,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 2,
  },

  posterImg: {
    width: "240px",
    height: "100%",
    display: "block",
    borderRadius: 14,
  },

  metaRow: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgba(255,255,255,0.80)",
  },

  metaItem: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 18,
    textAlign: "center",
  },

  metaIcon: {
    opacity: 0.9,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
  },

  metaIconImg: {
    width: 20,
    height: 20,
    display: "block",
  },

  timeText: {
    color: "#FFAE2B",
    fontWeight: 900,
    fontSize: 20,
    letterSpacing: 0.2,
    textShadow:
      "0 2px 0 rgba(0,0,0,0.55), 0 0 14px rgba(255,174,43,0.35)",
    WebkitTextStroke: "0.6px rgba(0,0,0,0.35)",
  },

  stepsCol: { display: "grid", gap: 18 },

  stepCard: {
    display: "grid",
    gridTemplateColumns: "40px 1fr",
    gap: 12,
    alignItems: "center",
    borderRadius: 12,
    border: "1px solid rgba(255,170,80,0.22)",
    background: "rgba(0,0,0,0.18)",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)",
    padding: "10px 14px",
  },

  stepIconCircle: {
    width: 32,
    height: 32,
    display: "grid",
    placeItems: "center",
    border: "none",
    background: "transparent",
    borderRadius: 0,
    overflow: "visible",
  },

  stepIconBox: {
    width: 32,
    height: 32,
    display: "grid",
    placeItems: "center",
    border: "none",
    background: "transparent",
    borderRadius: 0,
    overflow: "visible",
  },

  stepIconImg: {
    width: 30,
    height: 30,
    display: "block",
    objectFit: "contain",
  },

  stepTitle: {
    fontSize: 21,
    fontWeight: 700,
    lineHeight: 1.02,
    textShadow: "0 10px 26px rgba(0,0,0,0.40)",
  },

  stepText: {
    marginTop: 1,
    fontSize: 14.5,
    lineHeight: 1.2,
    color: "rgba(255,255,255,0.72)",
  },

  footer: { textAlign: "center", paddingTop: 6 },

  footerDivider: {
    height: 1,
    background:
      "linear-gradient(to right, rgba(255,170,80,0), rgba(255,170,80,0.26), rgba(255,170,80,0))",
    marginBottom: 12,
  },

  footerTitle: {
    fontSize: 34,
    fontWeight: 700,
    marginBottom: 10,
    textShadow: "0 10px 30px rgba(0,0,0,0.45)",
  },

  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: "14px 26px",
    minWidth: 420,
    maxWidth: "100%",
    borderRadius: 10,
    border: "1px solid rgba(255,160,55,0.24)",
    background: "linear-gradient(180deg, #FFAE2B 0%, #CF5A10 100%)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.36)",
    cursor: "pointer",
    color: "#fff",
    fontWeight: 800,
    fontSize: 21,
    lineHeight: 1,
    textShadow: "0 6px 16px rgba(0,0,0,0.36)",
  },

  ctaTriangle: {
    width: 0,
    height: 0,
    borderTop: "9px solid transparent",
    borderBottom: "9px solid transparent",
    borderLeft: "14px solid rgba(255,255,255,0.95)",
    transform: "translateY(1px)",
    filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))",
  },

  ctaLabel: { whiteSpace: "nowrap" },
};

/* ---------------------------
   SECOND MODAL STYLES (unchanged)
---------------------------- */
const D = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.62)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    zIndex: 10001,
  },

  panel: {
    position: "relative",
    width: "min(820px, calc(100vw - 64px))",
    maxHeight: "92dvh",
    borderRadius: 14,
    border: "1px solid rgba(255,170,80,0.32)",
    overflow: "hidden",
    boxShadow: "0 26px 90px rgba(0,0,0,0.60)",
  },

  panelBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(1.12) contrast(1.06) saturate(1.06)",
    transform: "scale(1.02)",
    zIndex: 0,
  },

  panelVignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(75% 80% at 50% 24%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.52) 70%, rgba(0,0,0,0.70) 100%)",
    zIndex: 1,
    pointerEvents: "none",
  },

  content: {
    position: "relative",
    zIndex: 2,
    padding: "22px 28px 24px",
    color: "#fff",
    display: "grid",
    rowGap: 16,
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    maxHeight: "92dvh",
  },

  headerRow: {
    display: "grid",
    gridTemplateColumns: "40px 1fr 40px",
    alignItems: "start",
    gap: 10,
  },

  headerCenter: { textAlign: "center", paddingTop: 2 },

  title: {
    margin: 0,
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1.05,
    textShadow: "0 10px 35px rgba(0,0,0,0.45)",
  },

  subtitle: {
    margin: "8px auto 0",
    maxWidth: 760,
    fontSize: 15.5,
    lineHeight: 1.45,
    color: "rgba(255,255,255,0.74)",
    textShadow: "0 8px 26px rgba(0,0,0,0.40)",
  },

  closeBtn: {
    justifySelf: "end",
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.20)",
    color: "rgba(255,255,255,0.88)",
    fontSize: 22,
    cursor: "pointer",
    lineHeight: "40px",
  },

  cards: { display: "grid", gap: 14, marginTop: 6 },

  cardBtn: {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gap: 14,
    alignItems: "center",
    borderRadius: 12,
    border: "1px solid rgba(255,170,80,0.22)",
    background: "rgba(0,0,0,0.18)",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)",
    padding: "14px 16px",
    cursor: "pointer",
    textAlign: "left",
    color: "#fff",
  },

  cardIconWrap: {
    width: 56,
    height: 56,
    display: "grid",
    placeItems: "center",
    borderRadius: 10,
    background: "rgba(0,0,0,0.12)",
    border: "1px solid rgba(255,170,80,0.14)",
  },

  cardIcon: {
    width: 42,
    height: 42,
    display: "block",
    objectFit: "contain",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.1,
    textShadow: "0 10px 26px rgba(0,0,0,0.40)",
  },

  cardText: {
    marginTop: 4,
    fontSize: 14.5,
    lineHeight: 1.2,
    color: "rgba(255,255,255,0.72)",
  },

  footerRow: { display: "flex", justifyContent: "center", paddingTop: 6 },

  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 18px",
    borderRadius: 8,
    border: "1px solid rgba(255,170,80,0.25)",
    background: "rgba(0,0,0,0.20)",
    color: "rgba(255,255,255,0.88)",
    fontWeight: 800,
    cursor: "pointer",
  },
};

const css = `
  .cg-modal-panel, .cg-download-panel { box-sizing: border-box; }

  /* ✅ Tablet + Mobile: poster stays visible, then scroll down */
  @media (max-width: 980px) {
    .cg-main {
      display: flex !important;
      flex-direction: column !important;
      gap: 14px !important;
    }

    /* ✅ DO NOT HIDE poster on mobile */
    .cg-left { display: flex !important; }

    /* ✅ Make poster fit cleanly on mobile (no weird margins) */
    .cg-poster-frame {
      width: 100% !important;
      margin: 0 !important;
      border-radius: 14px !important;
      overflow: hidden !important;
    }
    .cg-poster-img {
      width: 100% !important;
      height: auto !important;
      display: block !important;
      border-radius: 14px !important;
      object-fit: cover !important;
    }

    .cg-title { font-size: 34px !important; }
    .cg-subtitle { font-size: 15px !important; }
    .cg-footer-title { font-size: 28px !important; }
    .cg-cta { min-width: 0 !important; width: 100% !important; }
  }

  /* ✅ Phones: tighter spacing + still scroll */
  @media (max-width: 520px) {
    .cg-content {
      padding: 14px 14px 16px !important;
      row-gap: 10px !important;
      max-height: 92dvh !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }

    .cg-title { font-size: 30px !important; }
    .cg-subtitle { font-size: 13.5px !important; line-height: 1.35 !important; max-width: 320px !important; }

    .cg-step { padding: 10px 12px !important; }
    .cg-step-title { font-size: 18px !important; }
    .cg-step-text { font-size: 13px !important; }
    .cg-step-icon img { width: 24px !important; height: 24px !important; }

    .cg-footer-title { font-size: 22px !important; margin-bottom: 8px !important; }

    .cg-cta { font-size: 16px !important; padding: 12px 14px !important; border-radius: 12px !important; }
    .cg-close { width: 38px !important; height: 38px !important; font-size: 20px !important; }
  }

  /* ✅ Short screens: ensure you can scroll to the CTA */
  @media (max-height: 740px) {
    .cg-content { max-height: 92dvh !important; overflow-y: auto !important; }
  }

  /* ✅ Second modal (leave as-is, but keep mobile safe) */
  @media (max-width: 520px) {
    .cg-download-content { padding: 14px 14px 16px !important; row-gap: 12px !important; }
    .cg-download-title { font-size: 28px !important; }
    .cg-download-subtitle { font-size: 13.5px !important; line-height: 1.35 !important; max-width: 320px !important; margin-top: 6px !important; }
    .cg-download-card { grid-template-columns: 46px 1fr !important; padding: 12px !important; gap: 12px !important; }
    .cg-download-iconwrap { width: 46px !important; height: 46px !important; border-radius: 10px !important; }
    .cg-download-icon { width: 30px !important; height: 30px !important; }
    .cg-download-card-title { font-size: 16px !important; }
    .cg-download-card-text { font-size: 12.8px !important; }
    .cg-download-close { width: 38px !important; height: 38px !important; font-size: 20px !important; }
  }
`;