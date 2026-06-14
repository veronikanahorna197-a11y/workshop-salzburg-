import { useState, useEffect } from "react";

const TIMES = ["09:00", "14:00", "16:00", "18:00", "20:00"];
const DAYS = ["Mo", "Mi", "Fr", "Sa", "So"];
const MONTHS = ["April", "Mai"];

const STORAGE_KEY = "workshop-votes-2026";

export default function App() {
  const [screen, setScreen] = useState("vote"); // vote | results
  const [selected, setSelected] = useState({});
  const [votes, setVotes] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVotes();
  }, []);

  async function loadVotes() {
    try {
      const result = await window.storage.get(STORAGE_KEY, true);
      if (result) setVotes(JSON.parse(result.value));
    } catch (e) {}
    setLoading(false);
  }

  function toggle(key) {
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  }

  async function submitVote() {
    const chosen = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
    if (chosen.length === 0) { alert("Bitte wählt mindestens einen Termin aus!"); return; }

    const updated = { ...votes };
    chosen.forEach(k => { updated[k] = (updated[k] || 0) + 1; });

    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(updated), true);
    } catch (e) {}

    setVotes(updated);
    setSubmitted(true);
    setTimeout(() => setScreen("results"), 1800);
  }

  // Sort results by votes
  const sortedResults = Object.entries(votes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  const maxVotes = sortedResults.length ? sortedResults[0][1] : 1;

  function keyLabel(key) {
    const [month, day, time] = key.split("-");
    return `${month === "april" ? "Apr" : "Mai"} ${day} ${time}`;
  }

  return (
    <div style={{ background: "#e8e4df", minHeight: "100vh", padding: "24px 16px 48px", fontFamily: "Georgia, serif" }}>
      <div style={{ maxWidth: 460, margin: "0 auto" }}>

        {/* HEADER FLYER */}
        <div style={{ background: "#1a1a2e", borderRadius: "8px 8px 0 0", overflow: "hidden" }}>
          <div style={{ height: 6, background: "linear-gradient(90deg, #c0392b, #e74c3c, #f39c12)" }} />
          <div style={{ padding: "28px 24px 20px" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f39c12", fontWeight: 600, marginBottom: 10, fontFamily: "sans-serif" }}>
              Einladung · Salzburg 2026
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fdf8f3", lineHeight: 1.15, marginBottom: 6 }}>
              Workshop für<br /><span style={{ color: "#f39c12" }}>alleinerziehende</span><br />Eltern
            </div>
            <div style={{ fontSize: 12, color: "#aaa8c4", lineHeight: 1.6, fontFamily: "sans-serif" }}>
              Ein kostenloser Workshop – speziell für euch.<br />Gemeinsam stark, Schritt für Schritt.
            </div>
          </div>
        </div>

        {/* INFO CARDS */}
        <div style={{ background: "#fdf8f3", padding: "20px 24px", marginTop: 2 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[["Zeitraum", "April – Mai 2026"], ["Rhythmus", "1× pro Woche"], ["Ort", "Salzburg"], ["Kosten", "Kostenlos"]].map(([l, v]) => (
              <div key={l} style={{ background: "#f0ebe4", borderRadius: 4, padding: "10px 12px", borderLeft: "3px solid #c0392b" }}>
                <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#999", marginBottom: 3, fontFamily: "sans-serif" }}>{l}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", fontFamily: "sans-serif" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TIMES.map(t => (
              <span key={t} style={{ background: "#1a1a2e", color: "#fdf8f3", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontFamily: "sans-serif" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* NAV TABS */}
        <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
          {["vote", "results"].map(s => (
            <button key={s} onClick={() => setScreen(s)} style={{
              flex: 1, padding: "12px", border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600,
              background: screen === s ? "#c0392b" : "#ddd4ca",
              color: screen === s ? "#fff" : "#888",
              borderRadius: s === "vote" ? "0" : "0"
            }}>
              {s === "vote" ? "🗳 Abstimmen" : "📊 Ergebnisse"}
            </button>
          ))}
        </div>

        {/* VOTE SCREEN */}
        {screen === "vote" && !submitted && (
          <div style={{ background: "#fdf8f3", padding: "22px 24px", marginTop: 2 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>Jetzt abstimmen</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 18, fontFamily: "sans-serif" }}>Wählt alle Termine aus, die für euch passen!</div>

            {MONTHS.map(month => (
              <div key={month} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c0392b", fontWeight: 600, marginBottom: 10, fontFamily: "sans-serif" }}>{month} 2026</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "sans-serif" }}>
                    <thead>
                      <tr>
                        <th style={{ background: "#1a1a2e", color: "#fdf8f3", padding: "8px 6px", textAlign: "left", paddingLeft: 10 }}>Zeit</th>
                        {DAYS.map(d => <th key={d} style={{ background: "#1a1a2e", color: "#fdf8f3", padding: "8px 6px", textAlign: "center" }}>{d}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {TIMES.map((time, ti) => (
                        <tr key={time} style={{ background: ti % 2 === 1 ? "#f5f0ea" : "#fff" }}>
                          <td style={{ padding: "8px 6px 8px 10px", fontWeight: 600, color: "#c0392b", whiteSpace: "nowrap" }}>{time}</td>
                          {DAYS.map(day => {
                            const key = `${month.toLowerCase()}-${day}-${time}`;
                            const checked = !!selected[key];
                            return (
                              <td key={day} onClick={() => toggle(key)} style={{ padding: "6px", textAlign: "center", cursor: "pointer", borderBottom: "1px solid #e8e2da" }}>
                                <div style={{
                                  width: 22, height: 22, border: `2px solid ${checked ? "#1a1a2e" : "#ccc"}`,
                                  borderRadius: 3, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center",
                                  background: checked ? "#1a1a2e" : "#fff"
                                }}>
                                  {checked && <span style={{ color: "#f39c12", fontSize: 13, fontWeight: 700 }}>✓</span>}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <button onClick={submitVote} style={{
              width: "100%", background: "#c0392b", color: "#fff", border: "none",
              borderRadius: 4, padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif"
            }}>Abstimmen ✓</button>
            <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 8, fontFamily: "sans-serif" }}>Mehrfachauswahl möglich</div>
          </div>
        )}

        {/* THANK YOU */}
        {screen === "vote" && submitted && (
          <div style={{ background: "#1a1a2e", padding: "36px 24px", textAlign: "center", marginTop: 2 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#f39c12", marginBottom: 8 }}>Danke für eure Stimme!</div>
            <div style={{ fontSize: 13, color: "#aaa8c4", fontFamily: "sans-serif" }}>Ergebnisse werden gleich angezeigt…</div>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {screen === "results" && (
          <div style={{ background: "#fdf8f3", padding: "22px 24px", marginTop: 2 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>📊 Ergebnisse</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 20, fontFamily: "sans-serif" }}>
              {sortedResults.length === 0 ? "Noch keine Stimmen abgegeben." : "Die beliebtesten Termine:"}
            </div>

            {loading && <div style={{ textAlign: "center", color: "#aaa", fontFamily: "sans-serif" }}>Laden…</div>}

            {sortedResults.map(([key, count], i) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontFamily: "sans-serif" }}>
                  <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? "#c0392b" : "#333" }}>
                    {i === 0 ? "🏆 " : `${i + 1}. `}{keyLabel(key)}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{count} Stimme{count !== 1 ? "n" : ""}</span>
                </div>
                <div style={{ height: 10, background: "#e8e2da", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 5,
                    width: `${(count / maxVotes) * 100}%`,
                    background: i === 0 ? "linear-gradient(90deg, #c0392b, #f39c12)" : "#1a1a2e",
                    transition: "width 0.6s ease"
                  }} />
                </div>
              </div>
            ))}

            {sortedResults.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#bbb", fontFamily: "sans-serif", fontSize: 13 }}>
                Noch keine Stimmen — sei die Erste! 👆
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 16, fontFamily: "sans-serif" }}>
          Wir freuen uns auf euch · Salzburg 2026
        </div>
      </div>
    </div>
  );
}
