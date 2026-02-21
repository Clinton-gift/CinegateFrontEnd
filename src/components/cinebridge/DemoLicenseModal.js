import React, { useEffect, useMemo, useState } from "react";
import whyBg from "../../../assets/why_section_bg.png";

// ✅ your assets (all inside assets)
import posterImg from "../../../assets/poster.jpeg";
import clapperIcon from "../../../assets/clapper_icon.png";
import clockIcon from "../../../assets/clock.svg";
import checkIcon from "../../../assets/check.svg";
import shieldIcon from "../../../assets/shield.png";
import oneIcon from "../../../assets/one.png";

// ✅ new icons/images you added
import macIcon from "../../../assets/mac.png";
import videoIcon from "../../../assets/video.png";
import windowsIcon from "../../../assets/windows.png";

const API_BASE =
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.REACT_APP_API_URL || process.env.API_URL)) ||
  "http://localhost:3000";

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
    throw new Error(data?.error || data?.message || `Request failed (${res.status})`);
  }
  return data;
}

function triggerDownload(url) {
  // Use normal navigation so the browser handles it as a file download.
  window.location.assign(url);
}

export default function DemoLicenseModal({ open, onClose, onStartDownload }) {
  const [downloadOpen, setDownloadOpen] = useState(false);

  // session state
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState("");

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

  // Reset session state when modal fully closes (optional, cleaner)
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
    if (onStartDownload) onStartDownload(); // keep external callback
    setDownloadOpen(true); // always open download modal

    // Create session once in the background
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
          <div style={{ ...S.panelBg, backgroundImage: `url(${whyBg})` }} />
          <div style={S.panelVignette} />

          <div style={S.content} className="cg-content">
            {/* Header */}
            <div style={S.headerRow}>
              <div />
              <div style={S.headerCenter}>
                <h3 id="demo-license-title" style={S.title} className="cg-title">
                  Demo Screening License
                </h3>
                <p style={S.subtitle} className="cg-subtitle">
                  This demo film can be screened only once. After playback, access
                  expires automatically.
                </p>
              </div>

              <button
                onClick={onClose}
                style={S.closeBtn}
                aria-label="Close modal"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Main */}
            <div style={S.main} className="cg-main">
              {/* Left poster */}
              <div style={S.leftCard} className="cg-left">
                <div style={S.posterFrame}>
                  <img
                    src={posterImg}
                    alt="Demo film poster"
                    style={S.posterImg}
                    draggable={false}
                  />
                </div>

                <div style={S.metaRow}>
                  <span style={S.metaItem}>
                    <span style={S.metaIcon}>
                      <img src={clockIcon} alt="" style={S.metaIconImg} />
                    </span>
                    <span style={S.timeText}>3 min</span>
                  </span>
                </div>

                <div style={S.metaRow}>
                  <span style={S.metaItem}>
                    <span style={S.metaIcon}>
                      <img src={checkIcon} alt="" style={S.metaIconImg} />
                    </span>
                    Single-use demo license
                  </span>
                </div>
              </div>

              {/* Right steps */}
              <div style={S.stepsCol} className="cg-right">
                <div style={S.stepCard} className="cg-step">
                  <div style={S.stepIconCircle}>
                    <img src={oneIcon} alt="Step 1" style={S.stepIconImg} />
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
                  <div style={S.stepIconBox}>
                    <img
                      src={shieldIcon}
                      alt="Secure player"
                      style={S.stepIconImg}
                    />
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
                  <div style={S.stepIconBox}>
                    <img
                      src={clapperIcon}
                      alt="Play in player"
                      style={S.stepIconImg}
                    />
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

            {/* Footer CTA */}
            <div style={S.footer} className="cg-footer">
              <div style={S.footerDivider} />
              <div style={S.footerTitle} className="cg-footer-title">
                Start Demo Download
              </div>

              {/* small inline status */}
              {sessionError ? (
                <div style={{ marginBottom: 10, color: "rgba(255,120,120,0.95)", fontWeight: 700 }}>
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

      {/* ✅ SECOND MODAL */}
      <DemoDownloadOptionsModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        session={session}
        ensureSession={ensureSession}
        sessionLoading={sessionLoading}
        sessionError={sessionError}
      />
    </>
  );
}

/* ---------------------------
   SECOND MODAL (same file)
---------------------------- */
function DemoDownloadOptionsModal({
  open,
  onClose,
  session,
  ensureSession,
  sessionLoading,
  sessionError,
}) {
  if (!open) return null;

  const canDownload = !!session && !sessionLoading;

  const downloadWithSession = async (which) => {
    const s = session || (await ensureSession());
    if (!s) return;

    if (which === "windows") triggerDownload(s.playerWinUrl);
    if (which === "mac") triggerDownload(s.playerMacUrl);
    if (which === "film") triggerDownload(s.filmUrl);
  };

  const handleDownloadWindows = () => downloadWithSession("windows");
  const handleDownloadMac = () => downloadWithSession("mac");
  const handleDownloadFilm = () => downloadWithSession("film");

  return (
    <div style={D.overlay} onClick={onClose} role="presentation">
      <div
        style={D.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ ...D.panelBg, backgroundImage: `url(${whyBg})` }} />
        <div style={D.panelVignette} />

        <div style={D.content}>
          <div style={D.headerRow}>
            <div />
            <div style={D.headerCenter}>
              <h3 id="download-modal-title" style={D.title}>
                Download Required Files
              </h3>
              <p style={D.subtitle}>
                Download the CineGate Player for your device and the Demo Film.
              </p>
            </div>

            <button
              onClick={onClose}
              style={D.closeBtn}
              aria-label="Close modal"
              type="button"
            >
              ✕
            </button>
          </div>


          <div style={D.cards}>
            {/* Windows */}
            <button
              type="button"
              style={{
                ...D.cardBtn,
                opacity: sessionLoading ? 0.75 : 1,
                cursor: sessionLoading ? "progress" : "pointer",
              }}
              onClick={handleDownloadWindows}
              disabled={sessionLoading}
            >
              <div style={D.cardIconWrap}>
                <img src={windowsIcon} alt="" style={D.cardIcon} />
              </div>
              <div>
                <div style={D.cardTitle}>Download CineGate Player (Windows)</div>
                <div style={D.cardText}>
                  Install the secure player required for playback on Windows.
                </div>
              </div>
            </button>

            {/* Mac */}
            <button
              type="button"
              style={{
                ...D.cardBtn,
                opacity: sessionLoading ? 0.75 : 1,
                cursor: sessionLoading ? "progress" : "pointer",
              }}
              onClick={handleDownloadMac}
              disabled={sessionLoading}
            >
              <div style={D.cardIconWrap}>
                <img src={macIcon} alt="" style={D.cardIcon} />
              </div>
              <div>
                <div style={D.cardTitle}>Download CineGate Player (Mac)</div>
                <div style={D.cardText}>
                  Install the secure player required for playback on macOS.
                </div>
              </div>
            </button>

            {/* Demo film */}
            <button
              type="button"
              style={{
                ...D.cardBtn,
                opacity: sessionLoading ? 0.75 : 1,
                cursor: sessionLoading ? "progress" : "pointer",
              }}
              onClick={handleDownloadFilm}
              disabled={sessionLoading}
            >
              <div style={D.cardIconWrap}>
                <img src={videoIcon} alt="" style={D.cardIcon} />
              </div>
              <div>
                <div style={D.cardTitle}>Download Demo Film</div>
                <div style={D.cardText}>
                  Download the secure one-time demo film file.
                </div>
              </div>
            </button>
          </div>

          <div style={D.footerRow}>
            <button type="button" style={D.secondaryBtn} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   ORIGINAL STYLES (UNCHANGED)
---------------------------- */
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
    height: "min(700px, calc(100vh - 32px))",
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

  content: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    padding: "22px 28px",
    color: "#fff",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    rowGap: 14,
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
    minHeight: 0,
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
    minHeight: 0,
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

  stepsCol: { display: "grid", gap: 50, minHeight: 0 },

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
    padding: "6px 14px",
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
    borderRadius: 6,
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
   SECOND MODAL STYLES
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
  .cg-modal-panel { box-sizing: border-box; }

  @media (max-width: 980px) {
    .cg-main { grid-template-columns: 1fr !important; }
    .cg-left { display: none !important; }
    .cg-title { font-size: 36px !important; }
    .cg-subtitle { font-size: 15.5px !important; }
    .cg-footer-title { font-size: 30px !important; }
    .cg-cta { min-width: 0 !important; width: 100% !important; }
  }

  @media (max-height: 760px) {
    .cg-content { padding: 16px !important; row-gap: 10px !important; }
    .cg-title { font-size: 34px !important; }
    .cg-subtitle { margin-top: 6px !important; font-size: 15px !important; }
    .cg-step { padding: 10px 14px !important; }
    .cg-step-title { font-size: 21px !important; }
    .cg-step-text { font-size: 14.5px !important; margin-top: 2px !important; }
    .cg-footer-title { font-size: 28px !important; margin-bottom: 8px !important; }
  }
`;