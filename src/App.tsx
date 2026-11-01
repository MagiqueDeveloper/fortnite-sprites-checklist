import { useRef, useState, type CSSProperties } from "react";
import { Sheet } from "./components/Sheet";
import { Tick } from "./components/Tick";
import { useTicks } from "./hooks/useTicks";
import {
  FAMILIES,
  SINGLES,
  TIERS,
  RARITY_COLOURS,
  variantName,
  type Rarity,
} from "./data/sprites";
import { ALL_IDS, variantImage } from "./lib/layout";
import { asset } from "./lib/asset";

const ROSTER = [...FAMILIES, ...SINGLES];
const SOURCE = "https://spritecatch.com/news/treasure-hunters-new-sprites/";

export default function App() {
  const { ticks, toggle, reset, restore, saved } = useTicks();
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("all");
  const [status, setStatus] = useState("all");
  const [style, setStyle] = useState("all");
  const [notice, setNotice] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const found = ALL_IDS.filter((id) => ticks[id]?.f).length;
  const mastered = ALL_IDS.filter((id) => ticks[id]?.m).length;
  const percent = Math.round((found / ALL_IDS.length) * 100);
  const visible = ROSTER.map((family) => ({
    family,
    variants: family.variants.filter((variant) => {
      const row = ticks[`${family.id}__${variant}`];
      return (
        (style === "all" || variant === style) &&
        (status === "all" ||
          (status === "missing" && !row?.f) ||
          (status === "found" && row?.f) ||
          (status === "mastered" && row?.m)) &&
        `${variantName(variant, family.name)} ${family.ability}`
          .toLowerCase()
          .includes(search.toLowerCase().trim())
      );
    }),
  })).filter(
    ({ family, variants }) =>
      variants.length && (rarity === "all" || family.rarity === rarity),
  );
  const shown = visible.reduce((count, row) => count + row.variants.length, 0);

  function backup() {
    const blob = new Blob(
      [
        JSON.stringify(
          { season: "treasure-hunters", version: 1, ticks },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "treasure-hunters-progress.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Progress backup downloaded.");
  }

  return (
    <>
      <div className="web-view">
        <a className="skip-link" href="#collection">
          Skip to collection
        </a>
        <header className="site-header">
          <a href="#" className="site-brand">
            <span className="brand-mark" aria-hidden="true">
              ✦
            </span>
            <span>
              SPRITE<span className="brand-light"> FIELD GUIDE</span>
            </span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#collection">Collection</a>
            <a href="#field-notes">Field notes</a>
            <a href="https://github.com/MagiqueDeveloper/fortnite-sprites-checklist">
              GitHub →
            </a>
          </nav>
          <button className="print-button" onClick={() => window.print()}>
            Print checklist <span aria-hidden="true">→</span>
          </button>
        </header>
        <main className="site-main">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="live-dot" /> CHAPTER 7 · MINI SEASON · v43.00
              </div>
              <h1 id="hero-title">
                A little luck.
                <br />A lot of <em>treasure.</em>
              </h1>
              <p>
                Your companion for the hunt. Find every Sprite, collect every
                form, and chart your way to mastery.
              </p>
              <a className="primary-link" href="#collection">
                Explore the collection <span aria-hidden="true">↓</span>
              </a>
              <div className="hero-meta">
                <span>{ALL_IDS.length} collectible forms</span>
                <i /> <span>{ROSTER.length} Sprite families</span>
                <i /> <span>Yours to discover</span>
              </div>
            </div>
            <div className="hero-art">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <span className="compass-n">N</span>
              <span className="art-spark spark-one">✧</span>
              <span className="art-spark spark-two">✦</span>
              <img
                className="hero-sprite"
                src={asset("sprites/chester/base.png")}
                alt="Chester, a cat Sprite sitting in a treasure chest"
              />
              <div className="specimen-label">
                <span>MEET YOUR NEW CREWMATE</span>
                <b>Chester</b>
                <small>A little extra loot. A softer landing.</small>
              </div>
              <span className="art-coordinate">CROSSBONES ISLE / 01</span>
            </div>
          </section>
          <section
            className="progress-panel"
            aria-label="Your collection progress"
          >
            <div className="progress-intro">
              <span className="eyebrow">YOUR EXPEDITION</span>
              <h2>Every find counts.</h2>
              <span
                className={saved ? "save-state" : "save-state save-warning"}
              >
                {saved
                  ? "● Saved on this device"
                  : "Storage unavailable — export a backup"}
              </span>
            </div>
            <div className="progress-stat">
              <b>
                {found}
                <small> / {ALL_IDS.length}</small>
              </b>
              <span>Found</span>
              <progress
                value={found}
                max={ALL_IDS.length}
                aria-label="Sprites found"
              />
            </div>
            <div className="progress-stat">
              <b>
                {mastered}
                <small> / {ALL_IDS.length}</small>
              </b>
              <span>Mastered</span>
              <progress
                value={mastered}
                max={ALL_IDS.length}
                aria-label="Sprites mastered"
              />
            </div>
            <div
              className="progress-circle"
              style={{ "--progress": `${percent}%` } as CSSProperties}
            >
              <span>
                <b>{percent}%</b>
                <small>COLLECTED</small>
              </span>
            </div>
          </section>
          <section
            id="collection"
            className="collection"
            aria-labelledby="collection-title"
          >
            <div className="section-heading">
              <div>
                <span className="eyebrow">THE TREASURE HUNTERS COLLECTION</span>
                <h2 id="collection-title">
                  Meet the crew<span>.</span>
                </h2>
              </div>
              <p>
                Tick Found when you collect it.
                <br />
                Tick Mastered when you finish the journey.
              </p>
            </div>
            <div className="collection-controls">
              <label className="search-field">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Find a Sprite or ability…"
                  aria-label="Search Sprites or abilities"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <label className="select-field">
                Rarity
                <select
                  aria-label="Rarity"
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                >
                  <option value="all">All rarities</option>
                  {Object.keys(RARITY_COLOURS).map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label className="select-field">
                Form
                <select
                  aria-label="Form"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  <option value="all">All forms</option>
                  {TIERS.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="collection-subbar">
              <div
                className="status-tabs"
                role="group"
                aria-label="Collection status"
              >
                {[
                  ["all", "All Sprites"],
                  ["missing", "Missing"],
                  ["found", "Found"],
                  ["mastered", "Mastered"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    aria-pressed={status === value}
                    onClick={() => setStatus(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span role="status">
                {shown} of {ALL_IDS.length} forms
              </span>
            </div>
            <div className="sprite-grid">
              {visible.map(({ family, variants }) => (
                <article
                  className="sprite-card"
                  key={family.id}
                  style={
                    {
                      "--rarity": RARITY_COLOURS[family.rarity as Rarity],
                    } as CSSProperties
                  }
                >
                  <div className="card-topline">
                    <span className="rarity-badge">{family.rarity}</span>
                    <span>
                      {
                        family.variants.filter(
                          (v) => ticks[`${family.id}__${v}`]?.f,
                        ).length
                      }{" "}
                      / {family.variants.length} found
                    </span>
                  </div>
                  <h3>{family.name}</h3>
                  <p className="ability">{family.ability}</p>
                  <div className="variant-grid">
                    {variants.map((variant) => {
                      const id = `${family.id}__${variant}`;
                      const name = variantName(variant, family.name);
                      return (
                        <div
                          key={variant}
                          className={`variant-tile form-${variant}${ticks[id]?.m ? " is-mastered" : ""}`}
                        >
                          <div className="variant-art">
                            <img
                              src={asset(variantImage(family, variant))}
                              alt={name}
                              loading="lazy"
                              width="150"
                              height="150"
                            />
                          </div>
                          <h4>{TIERS.find((t) => t.key === variant)?.label}</h4>
                          <div className="variant-checks">
                            <Tick
                              id={id}
                              kind="f"
                              label="Found"
                              sprite={name}
                              on={Boolean(ticks[id]?.f)}
                              onToggle={toggle}
                            />
                            <Tick
                              id={id}
                              kind="m"
                              label="Mastered"
                              sprite={name}
                              on={Boolean(ticks[id]?.m)}
                              onToggle={toggle}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
            {!visible.length && (
              <div className="empty-state">
                <h3>No Sprites on this part of the map.</h3>
                <p>Try a different name, rarity, form, or collection status.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setRarity("all");
                    setStyle("all");
                    setStatus("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
            <div className="collection-tools">
              <span>Keep your expedition safe.</span>
              <button onClick={backup}>Export progress ↓</button>
              <button onClick={() => file.current?.click()}>
                Import backup ↑
              </button>
              <button
                className="reset-link"
                disabled={!found}
                onClick={() => {
                  if (
                    window.confirm(
                      "Clear your Treasure Hunters progress? Your Override progress will be kept.",
                    )
                  ) {
                    reset();
                    setNotice("Treasure Hunters progress cleared.");
                  }
                }}
              >
                Reset progress
              </button>
              <input
                ref={file}
                hidden
                type="file"
                accept="application/json,.json"
                onChange={async (e) => {
                  const selected = e.target.files?.[0];
                  e.target.value = "";
                  if (!selected) return;
                  try {
                    if (selected.size > 1_000_000) throw new Error("large");
                    const data = JSON.parse(await selected.text());
                    if (
                      data?.season !== "treasure-hunters" ||
                      data?.version !== 1 ||
                      !data.ticks ||
                      typeof data.ticks !== "object" ||
                      Array.isArray(data.ticks)
                    )
                      throw new Error("invalid");
                    if (
                      window.confirm(
                        "Replace current Treasure Hunters progress with this backup?",
                      )
                    ) {
                      restore(data.ticks);
                      setNotice("Progress restored from backup.");
                    }
                  } catch {
                    setNotice(
                      "Could not import this file. Choose a Treasure Hunters progress backup.",
                    );
                  }
                }}
              />
            </div>
            <p className="notice" role="status">
              {notice}
            </p>
          </section>
          <section
            className="field-notes"
            id="field-notes"
            aria-labelledby="notes-title"
          >
            <div>
              <span className="eyebrow">A FEW NOTES FROM THE FIELD</span>
              <h2 id="notes-title">Know your treasure.</h2>
              <p>
                Rarities are provisional, based on Sprite Catch’s spawn-tier
                research. Launch roster checked 1 November 2026.
              </p>
              <a href={SOURCE}>View the roster source →</a>
            </div>
            <article>
              <span className="note-symbol">✧</span>
              <h3>Fortune favours the curious.</h3>
              <p>
                Fortune forms reveal nearby Chests. The same Sprite power, with
                a little help finding your next haul.
              </p>
              <a href="https://spritecatch.com/variants/fortune/">
                About Fortune →
              </a>
            </article>
            <article>
              <span className="note-symbol">☾</span>
              <h3>A curse with a catch.</h3>
              <p>
                Cursed forms improve your odds of rare variants, but water
                damages you. Choose your route wisely.
              </p>
              <a href="https://spritecatch.com/variants/cursed/">
                About Cursed →
              </a>
            </article>
          </section>
          <aside className="coming-next">
            <span className="eyebrow">ON THE HORIZON</span>
            <p>
              <b>Gold returns November 12.</b> Future forms stay out of your
              collection totals until the source confirms their release.
            </p>
            <span className="outline-pill">NOT YET COLLECTIBLE</span>
          </aside>
        </main>
        <footer className="site-footer">
          <div className="footer-brand">
            ✦ SPRITE FIELD GUIDE <span>Made for the joy of the hunt.</span>
          </div>
          <p>
            Unofficial Fortnite fan project. Sprite artwork © Epic Games. Not
            affiliated with or endorsed by Epic Games.
          </p>
          <p>
            AI tools assisted with the design, code, and documentation of this
            application. AI output can contain errors.{" "}
            <a href="https://github.com/MagiqueDeveloper/fortnite-sprites-checklist/blob/main/AI_DISCLOSURE.md">
              AI use disclosure →
            </a>
          </p>
          <div className="footer-links">
            <a href="https://github.com/MagiqueDeveloper/fortnite-sprites-checklist">
              Source & contributions →
            </a>
            <span>
              No account. No tracking. Progress stays in your browser.
            </span>
          </div>
        </footer>
      </div>
      <div className="print-view">
        <Sheet ticks={ticks} onToggle={toggle} />
      </div>
    </>
  );
}
