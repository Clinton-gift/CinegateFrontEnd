import React from "react";

// ✅ Update these paths to match your assets folder structure
import whyBg from "../../../assets/why_section_bg.png";
import iconClapper from "../../../assets/clapper_icon.png";
import iconBolt from "../../../assets/bolt_icon.png";
import iconGlobe from "../../../assets/globe_icon.png";

export default function WhySection({ onOpenDemo }) {
  return (
    <section style={S.section} aria-labelledby="why-cine">
      {/* Background */}
      <div style={{ ...S.bg, backgroundImage: `url(${whyBg})` }} />
      {/* Vignette overlay */}
      <div style={S.vignette} />

      {/* Content */}
      <div style={S.inner}>
        <h2 id="why-cine" style={S.title}>
          Why CineGate
        </h2>
        <p style={S.subtitle}>Public film licensing redesigned for African cinema.</p>

        <div style={S.grid}>
          {/* Card 1 */}
          <div style={S.card}>
            <div style={S.cardTopGlow} />
            <img src={iconClapper} alt="" style={S.cardIcon} />

            <h3 style={S.cardHeading}>
              Public screenings
              <br />
              are complicated
            </h3>

            <div style={S.rule} />

            <ul style={S.list}>
              <li style={S.li}>
                <span style={S.chev}>›</span> Licensing is unclear
              </li>
              <li style={S.li}>
                <span style={S.chev}>›</span> Negotiations are slow
              </li>
              <li style={S.li}>
                <span style={S.chev}>›</span> Many venues screen films informally
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div style={{ ...S.card, ...S.cardHighlight }}>
            <div style={S.cardTopGlow} />
            <img src={iconBolt} alt="" style={S.cardIcon} />

            <h3 style={S.cardHeading}>
              Pay once.
              <br />
              <span style={S.orange}>Screen once.</span>
            </h3>

            <div style={S.rule} />

            <ul style={S.list}>
              <li style={S.li}>
                <span style={S.chev}>›</span> Download licensed film
              </li>
              <li style={S.li}>
                <span style={S.chev}>›</span> Screen it one time
              </li>
              <li style={S.li}>
                <span style={S.chev}>›</span> Access automatically expires
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div style={S.card}>
            <div style={S.cardTopGlow} />
            <img src={iconGlobe} alt="" style={S.cardIcon} />

            <h3 style={S.cardHeading}>
              More African films
              <br />
              on more screens
            </h3>

            <div style={S.rule} />

            <ul style={S.list}>
              <li style={S.li}>
                <span style={S.chev}>›</span> Legal access for venues
              </li>
              <li style={S.li}>
                <span style={S.chev}>›</span> Revenue for filmmakers
              </li>
              <li style={S.li}>
                <span style={S.chev}>›</span> Cultural visibility globally
              </li>
            </ul>
          </div>
        </div>

        <div style={S.ctaWrap}>
          <div style={S.ctaText}>Experience the one-time screening model</div>

          <button
            type="button"
            onClick={onOpenDemo}
            style={S.ctaBtn}
            aria-label="Download Demo Film"
          >
            {/* ✅ NO CIRCLE — triangle only */}
            <span style={S.playTriangle} aria-hidden="true" />
            <span style={S.ctaLabel}>Download Demo Film</span>
          </button>
        </div>
      </div>
    </section>
  );
}

const S = {
  section: {
    position: "relative",
    width: "100%",
    padding: "64px 0 72px",
    overflow: "hidden",
    color: "#fff",
  },

  bg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(1.28) contrast(1.08) saturate(1.12)",
    transform: "scale(1.02)",
  },

  vignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(70% 75% at 50% 28%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.16) 62%, rgba(0,0,0,0.28) 100%)",
    zIndex: 1,
    pointerEvents: "none",
  },

  inner: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 22px",
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: 54,
    lineHeight: 1.06,
    fontWeight: 700,
    letterSpacing: 0.1,
    textShadow: "0 10px 40px rgba(0,0,0,0.32)",
  },

  subtitle: {
    margin: "12px auto 0",
    maxWidth: 760,
    fontSize: 18,
    lineHeight: 1.45,
    color: "rgba(255,255,255,0.72)",
    textShadow: "0 8px 30px rgba(0,0,0,0.32)",
  },

  grid: {
    marginTop: 34,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 22,
    alignItems: "stretch",
  },

  // ✅ Clean transparent card
  card: {
    position: "relative",
    borderRadius: 10,
    padding: "28px 28px 24px",
    background: "transparent",
    border: "1px solid rgba(255,170,80,0.32)",
    boxShadow:
      "0 14px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.10)",
    backdropFilter: "blur(1.5px)",
    WebkitBackdropFilter: "blur(2px)",
    overflow: "hidden",
    minHeight: 320,
  },

  cardHighlight: {
    background: "transparent",
    border: "1px solid rgba(255,170,80,0.40)",
  },

  cardTopGlow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 2,
    background:
      "linear-gradient(to right, rgba(255,170,80,0), rgba(255,170,80,0.65), rgba(255,170,80,0))",
    opacity: 0.85,
    pointerEvents: "none",
  },

  cardIcon: {
    width: 56,
    height: 56,
    objectFit: "contain",
    margin: "0 auto 14px",
    filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.28))",
    opacity: 0.98,
  },

  cardHeading: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.2,
    fontWeight: 700,
    textShadow: "0 10px 30px rgba(0,0,0,0.22)",
  },

  orange: { color: "#F3A12B" },

  rule: {
    height: 1,
    margin: "18px 0 16px",
    background:
      "linear-gradient(to right, rgba(255,170,80,0), rgba(255,170,80,0.20), rgba(255,170,80,0))",
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    textAlign: "left",
    display: "grid",
    gap: 12,
  },

  li: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    fontSize: 18,
    lineHeight: 1.45,
    color: "rgba(255,255,255,0.76)",
  },

  chev: {
    color: "#F3A12B",
    fontWeight: 800,
    transform: "translateY(2px)",
    minWidth: 14,
  },

  ctaWrap: {
    marginTop: 28,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
  },

  ctaText: {
    fontSize: 20,
    color: "rgba(255,255,255,0.66)",
    textShadow: "0 8px 30px rgba(0,0,0,0.30)",
  },

  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: "14px 28px",
    minWidth: 360,
    borderRadius: 6,
    border: "1px solid rgba(255,160,55,0.26)",
    background: "linear-gradient(180deg, #FFAE2B 0%, #CF5A10 100%)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.34)",
    cursor: "pointer",
    color: "#fff",
    fontWeight: 800,
    fontSize: 22,
    lineHeight: 1,
    textShadow: "0 6px 16px rgba(0,0,0,0.34)",
  },

  playTriangle: {
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
