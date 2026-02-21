import React, { useMemo, useState } from "react";

import posterImg from "../../../assets/poster.jpeg";
import libraryBg from "../../../assets/library_bg.png";

// ✅ added posters (same assets folder)
import ultimateAttackPoster from "../../../assets/the-ultimate-attack.jpg";
import riskWorthTakingPoster from "../../../assets/a-risk-worth-taking.jpg";
import mysteriousIslandPoster from "../../../assets/the-mysterious-island.jpg";
import baaraPoster from "../../../assets/baara.jpg";
import goldenRendezvousPoster from "../../../assets/golden-rendezvous.jpg";
import theMessagePoster from "../../../assets/the-message.jpg";
import cockADoodlePoster from "../../../assets/cock-a-doodle-doo-mr-chicken.jpg";

// ✅ convert Metro assets to usable web URLs
import { assetUri } from "../../lib/assetUri"; // <-- adjust if your path differs

// ✅ same logic as your modal
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

export default function FilmLibrarySection() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Popular");

  // ✅ download state (so we can show feedback if needed)
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState("");

  const filters = ["Drama", "Documentary", "Short", "Country", "Popular"];

  const films = [
    { title: "Congo Killer Gorilla", available: true, poster: posterImg },
    { title: "The Ultimate Attack", available: false, poster: ultimateAttackPoster },
    { title: "A risk worth taking", available: false, poster: riskWorthTakingPoster },
    { title: "The Mysterious Island", available: false, poster: mysteriousIslandPoster },
    { title: "Baara", available: false, poster: baaraPoster },
    { title: "Golden Rendezvous", available: false, poster: goldenRendezvousPoster },
    { title: "The Message", available: false, poster: theMessagePoster },
    { title: "Cock-a-doodle-doo, Mr. Chicken!", available: false, poster: cockADoodlePoster },
    { title: "Touki Bouki", available: false },
    { title: "Soleil Ô", available: false },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return films.filter((f) => (q ? f.title.toLowerCase().includes(q) : true));
  }, [query, films]);

  // 2 rows only (4 x 2 = 8)
  const visible = filtered.slice(0, 8);

  const uris = useMemo(() => {
    return {
      bg: assetUri(libraryBg),
      posters: new Map(
        films
          .filter((f) => f.poster)
          .map((f) => [f.title, assetUri(f.poster)])
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Clicking the active poster downloads the demo film (same as modal "Download Demo Film")
  const handleActiveClick = async () => {
    if (demoLoading) return;

    setDemoError("");
    setDemoLoading(true);

    try {
      const session = await createDemoSession({});
      // expected from your modal usage: session.filmUrl
      if (!session?.filmUrl) {
        throw new Error("Missing filmUrl in session response");
      }
      triggerDownload(session.filmUrl);
    } catch (e) {
      setDemoError(e?.message || "Failed to start demo download");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <section className="filmLib" id="film-library">
      <div
        className="filmLib__bg"
        aria-hidden="true"
        style={{ backgroundImage: `url(${uris.bg})` }}
      />
      <div className="filmLib__vignette" aria-hidden="true" />

      <div className="filmLib__container">
        <header className="filmLib__header">
          <h2 className="filmLib__title">Film Library</h2>
          <p className="filmLib__subtitle">
            Licensed African films for one-time public screening.
          </p>

          {/* ✅ Optional inline feedback (only shows if click fails) */}
          {demoError ? <div className="filmLib__error">{demoError}</div> : null}
        </header>

        {/* Controls */}
        <div className="filmLib__controlsWrap">
          <div className="filmLib__controls">
            <div className="filmLib__search">
              <span className="filmLib__searchIcon">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="filmLib__searchInput"
                placeholder="Search films..."
              />
            </div>

            <div className="filmLib__filters" role="tablist" aria-label="Film filters">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={"filmLib__chip " + (activeFilter === f ? "isActive" : "")}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="filmLib__gridWrap">
          <div className="filmLib__grid">
            {visible.map((film, idx) => {
              const isActive = film.available && idx === 0;

              const posterSrc =
                film.poster && uris.posters.get(film.title)
                  ? uris.posters.get(film.title)
                  : undefined;

              return (
                <div className="filmLib__item" key={`${film.title}-${idx}`}>
                  <button
                    type="button"
                    className={
                      "filmLib__posterBtn " +
                      (isActive ? "isClickable isGlow" : "isDisabled") +
                      (isActive && demoLoading ? " isBusy" : "")
                    }
                    onClick={isActive ? handleActiveClick : undefined}
                    aria-disabled={!isActive || demoLoading}
                    disabled={!isActive || demoLoading}
                    title={
                      isActive
                        ? demoLoading
                          ? "Preparing download..."
                          : "Download demo film"
                        : "Not available"
                    }
                  >
                    {posterSrc ? (
                      <img
                        src={posterSrc}
                        alt={film.title}
                        className="filmLib__posterImg"
                        draggable={false}
                      />
                    ) : (
                      <div className="filmLib__posterFallback" />
                    )}

                    {/* ✅ Small overlay label when active */}
                    {isActive ? (
                      <div className="filmLib__badge">
                        {demoLoading ? "Preparing..." : "Download"}
                      </div>
                    ) : null}
                  </button>

                  <div className="filmLib__filmTitle">{film.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .filmLib{
          position: relative;
          width: 100%;
          min-height: 100vh;
          padding: 46px 0 26px;
          overflow: hidden;
          background: #000;
          display: flex;
          align-items: center;
        }

        .filmLib__bg{
          position:absolute; inset:0;
          background-size: cover;
          background-position: center;
          transform: scale(1.02);
          opacity: 1;
          filter: saturate(1.25) contrast(1.15) brightness(1.18);
        }
        .filmLib__vignette{
          position:absolute; inset:-2px;
          background:
            radial-gradient(900px 520px at 50% 18%, rgba(0,0,0,0.10), rgba(0,0,0,0.40)),
            radial-gradient(900px 520px at 50% 120%, rgba(0,0,0,0.14), rgba(0,0,0,0.52));
          pointer-events:none;
        }

        .filmLib__container{
          position: relative;
          width: 100%;
          margin: 0 auto;
          padding: 0 60px;
          box-sizing: border-box;
        }

        .filmLib__header{
          text-align: center;
          margin-bottom: 10px;
        }
        .filmLib__title{
          margin: 0;
          font-size: 44px;
          line-height: 1.05;
          font-weight: 800;
          color: rgba(255,255,255,0.92);
          text-shadow: 0 10px 40px rgba(0,0,0,0.55);
        }
        .filmLib__subtitle{
          margin: 10px 0 0;
          font-size: 16px;
          color: rgba(255,255,255,0.75);
          text-shadow: 0 10px 30px rgba(0,0,0,0.45);
        }

        .filmLib__error{
          margin: 10px auto 0;
          display: inline-block;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(140,0,0,0.25);
          border: 1px solid rgba(255, 120, 120, 0.35);
          color: rgba(255,160,160,0.95);
          font-weight: 800;
        }

        /* ✅ Controls layout */
        .filmLib__controlsWrap{
          width: 100%;
          display: flex;
          justify-content: center;
          margin: 10px 0 12px;
        }
        .filmLib__controls{
          display:flex;
          align-items:center;
          gap: 10px;
          flex-wrap: nowrap;
          max-width: 980px;
          width: 100%;
          justify-content: center;
        }

        .filmLib__search{
          position: relative;
          display:flex;
          align-items:center;
          padding: 6px 12px 6px 34px;
          border-radius: 10px;
          border: 1px solid rgba(255, 165, 70, 0.28);
          background: rgba(0,0,0,0.30);
          box-shadow: 0 18px 55px rgba(0,0,0,0.32);
          min-width: 320px;
          height: 42px;
          flex: 1;
          max-width: 420px;
        }
        .filmLib__searchIcon{
          position:absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 165, 70, 0.90);
          font-size: 16px;
          user-select: none;
        }
        .filmLib__searchInput{
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: rgba(255,255,255,0.92);
          font-size: 15px;
          line-height: 1;
        }

        /* ✅ Filters - desktop same, mobile becomes scrollable */
        .filmLib__filters{
          display:flex;
          gap: 10px;
          align-items: center;
          padding: 6px;
          height: 42px;
          border-radius: 10px;
          border: 1px solid rgba(255, 165, 70, 0.22);
          background: rgba(0,0,0,0.22);
          box-shadow: 0 18px 55px rgba(0,0,0,0.26);
          flex: 0 0 auto;
          max-width: 520px;
        }
        .filmLib__chip{
          cursor:pointer;
          border-radius: 12px;
          height: 30px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(255,165,70,0.22);
          color: rgba(255,255,255,0.82);
          font-weight: 700;
          font-size: 14px;
          line-height: 1;
          white-space: nowrap;
        }
        .filmLib__chip.isActive{
          border-color: rgba(255,165,70,0.72);
          background: rgba(255,165,70,0.14);
          color: rgba(255,255,255,0.95);
        }

        .filmLib__gridWrap{
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .filmLib__grid{
          --cardW: 160px;
          --cardH: 195px;
          display:grid;
          grid-template-columns: repeat(4, var(--cardW));
          gap: 18px;
        }

        .filmLib__item{ width: var(--cardW); }

        .filmLib__posterBtn{
          width: var(--cardW);
          display:block;
          position: relative;
          border: none;
          padding: 0;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(0,0,0,0.25);
          outline: none;
          box-shadow: 0 18px 55px rgba(0,0,0,0.40);
        }
        .filmLib__posterBtn.isClickable{ cursor: pointer; }
        .filmLib__posterBtn.isDisabled{
          cursor: default;
          opacity: 0.59;
          filter: grayscale(1) contrast(0.9) brightness(0.75);
        }
        .filmLib__posterBtn.isGlow{
          box-shadow:
            0 18px 55px rgba(0,0,0,0.40),
            0 0 0 2px rgba(255, 165, 70, 0.60),
            0 0 34px rgba(255, 140, 0, 0.38);
        }

        .filmLib__posterBtn.isBusy{
          cursor: progress;
        }
        .filmLib__posterBtn.isBusy .filmLib__posterImg{
          filter: blur(0.3px) brightness(0.92);
        }

        .filmLib__badge{
          position: absolute;
          left: 10px;
          bottom: 10px;
          padding: 7px 10px;
          border-radius: 10px;
          background: rgba(0,0,0,0.40);
          border: 1px solid rgba(255, 165, 70, 0.35);
          color: rgba(255,255,255,0.92);
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.4px;
          text-shadow: 0 10px 22px rgba(0,0,0,0.55);
        }

        .filmLib__posterImg{
          width: 100%;
          height: var(--cardH);
          object-fit: cover;
          background: rgba(0,0,0,0.25);
          display: block;
          border-radius: 12px;
        }

        .filmLib__posterFallback{
          width: 100%;
          height: var(--cardH);
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px dashed rgba(255,165,70,0.25);
        }

        .filmLib__filmTitle{
          margin-top: 8px;
          font-size: 16px;
          font-weight: 800;
          color: rgba(255,255,255,0.88);
          text-shadow: 0 10px 24px rgba(0,0,0,0.45);
          padding-left: 2px;
        }

        /* ✅ Responsive */
       @media (max-width: 620px){
          .filmLib{
            padding: 34px 0 18px;
            align-items: flex-start;
          }

          .filmLib__container{ padding: 0 14px; }

          .filmLib__title{
            font-size: 42px;
          }
          .filmLib__subtitle{
            font-size: 16px;
          }

          .filmLib__controls{
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .filmLib__search{
            min-width: 100%;
            max-width: none;
          }

          /* ✅ chips scroll instead of being cut */
          .filmLib__filters{
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            flex-wrap: nowrap;
            justify-content: flex-start;
            -webkit-overflow-scrolling: touch;
          }
          .filmLib__filters::-webkit-scrollbar{ display:none; }

          /* ✅ 3 posters per row on mobile */
          .filmLib__grid{
            --gap: 10px;
            --pad: 14px;

            /* 100vw - left pad - right pad - 2 gaps, divided by 3 */
            --cardW: calc((100vw - (var(--pad) * 2) - (var(--gap) * 2)) / 3);
            --cardH: 135px;

            grid-template-columns: repeat(3, var(--cardW));
            gap: var(--gap);
          }

          /* ✅ smaller, cleaner titles */
          .filmLib__filmTitle{
            font-size: 13px;
            line-height: 1.2;
            margin-top: 8px;
            font-weight: 800;
          }
        }
      `}</style>
    </section>
  );
}