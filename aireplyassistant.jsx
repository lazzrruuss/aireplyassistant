import { useState, useRef } from "react";

const TONES = [
  { id: "friendly", label: "Friendly", emoji: "😊", desc: "Warm & approachable" },
  { id: "formal", label: "Formal", emoji: "💼", desc: "Professional & polished" },
  { id: "empathetic", label: "Empathetic", emoji: "🤝", desc: "Understanding & caring" },
  { id: "concise", label: "Concise", emoji: "⚡", desc: "Short & to the point" },
];

const LANGUAGES = [
  { code: "English", flag: "🇺🇸" },
  { code: "Spanish", flag: "🇪🇸" },
  { code: "French", flag: "🇫🇷" },
  { code: "German", flag: "🇩🇪" },
  { code: "Portuguese", flag: "🇧🇷" },
  { code: "Arabic", flag: "🇸🇦" },
  { code: "Chinese", flag: "🇨🇳" },
  { code: "Japanese", flag: "🇯🇵" },
];

export default function App() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("friendly");
  const [language, setLanguage] = useState("English");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedReply, setEditedReply] = useState("");
  const [error, setError] = useState("");
  const replyRef = useRef(null);

  const generateReply = async (customMessage) => {
    const inputMsg = customMessage || message;
    if (!inputMsg.trim()) return;

    setLoading(true);
    setError("");
    setReply("");
    setEditMode(false);

    const selectedTone = TONES.find((t) => t.id === tone);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a customer support specialist. Write a reply to the following customer message.

Tone: ${selectedTone.label} — ${selectedTone.desc}
Language: ${language}
Customer message: "${inputMsg}"

Write ONLY the reply text. No subject line, no "Dear..." unless natural. No explanations. Just the reply itself, ready to send.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      setReply(text);
      setEditedReply(text);
      setTimeout(() => replyRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyReply = () => {
    navigator.clipboard.writeText(editMode ? editedReply : reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'DM Mono', monospace",
      color: "#e8e4d9",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@700;900&display=swap');

        * { box-sizing: border-box; }

        .header-glow {
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,180,50,0.15), transparent);
        }

        .tone-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #a09880;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          text-align: left;
        }
        .tone-btn:hover {
          border-color: rgba(255,180,50,0.4);
          color: #e8e4d9;
          background: rgba(255,180,50,0.05);
        }
        .tone-btn.active {
          background: rgba(255,180,50,0.1);
          border-color: #ffb432;
          color: #ffb432;
        }

        .lang-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #a09880;
          padding: 7px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
        }
        .lang-btn:hover { border-color: rgba(255,180,50,0.3); color: #e8e4d9; }
        .lang-btn.active { border-color: #ffb432; color: #ffb432; background: rgba(255,180,50,0.08); }

        textarea {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #e8e4d9;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          padding: 16px;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
          line-height: 1.7;
        }
        textarea:focus { border-color: rgba(255,180,50,0.5); }
        textarea::placeholder { color: #504a3a; }

        .generate-btn {
          background: #ffb432;
          color: #0a0a0f;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }
        .generate-btn:hover { background: #ffc55a; transform: translateY(-1px); }
        .generate-btn:disabled { background: #3a3020; color: #5a5040; cursor: not-allowed; transform: none; }

        .action-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #a09880;
          padding: 8px 16px;
          border-radius: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn:hover { border-color: rgba(255,180,50,0.4); color: #ffb432; }
        .action-btn.copy { color: #5dba7c; border-color: rgba(93,186,124,0.3); }
        .action-btn.copy:hover { background: rgba(93,186,124,0.08); }

        .reply-box {
          background: rgba(255,180,50,0.04);
          border: 1px solid rgba(255,180,50,0.2);
          border-radius: 10px;
          padding: 20px;
          line-height: 1.8;
          font-size: 14px;
          color: #e8e4d9;
          white-space: pre-wrap;
          min-height: 120px;
        }

        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,180,50,0.3);
          border-top-color: #ffb432;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .fade-in {
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .section-label {
          font-size: 11px;
          letter-spacing: 0.12em;
          color: #5a5040;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 28px 0;
        }
      `}</style>

      {/* Header */}
      <div className="header-glow" style={{ padding: "48px 24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#ffb432", marginBottom: 12, textTransform: "uppercase" }}>
          ◈ AI-Powered
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(32px, 6vw, 52px)",
          fontWeight: 900,
          margin: 0,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: "#e8e4d9",
        }}>
          Reply Assistant
        </h1>
        <p style={{ color: "#5a5040", marginTop: 12, fontSize: 14, letterSpacing: "0.03em" }}>
          Turn customer messages into perfect replies — instantly.
        </p>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* Tone selector */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label">Brand Tone</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {TONES.map((t) => (
              <button key={t.id} className={`tone-btn ${tone === t.id ? "active" : ""}`} onClick={() => setTone(t.id)}>
                <span style={{ marginRight: 8 }}>{t.emoji}</span>
                <strong>{t.label}</strong>
                <span style={{ display: "block", fontSize: 11, marginTop: 2, opacity: 0.6 }}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language selector */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label">Reply Language</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {LANGUAGES.map((l) => (
              <button key={l.code} className={`lang-btn ${language === l.code ? "active" : ""}`} onClick={() => setLanguage(l.code)}>
                {l.flag} {l.code}
              </button>
            ))}
          </div>
        </div>

        <hr className="divider" />

        {/* Input */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Customer Message</div>
          <textarea
            rows={5}
            placeholder="Paste the customer's message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Generate */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 32 }}>
          <button className="generate-btn" onClick={() => generateReply()} disabled={loading || !message.trim()}>
            {loading ? <><span className="spinner" />Generating...</> : "✦ Generate Reply"}
          </button>
          {reply && (
            <button className="action-btn" onClick={() => generateReply()} disabled={loading}>
              ↻ Regenerate
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ color: "#e05555", fontSize: 13, marginBottom: 16, padding: "12px 16px", background: "rgba(224,85,85,0.08)", borderRadius: 8, border: "1px solid rgba(224,85,85,0.2)" }}>
            {error}
          </div>
        )}

        {/* Reply output */}
        {reply && (
          <div className="fade-in" ref={replyRef}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div className="section-label" style={{ margin: 0 }}>Generated Reply</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="action-btn" onClick={() => { setEditMode(!editMode); setEditedReply(reply); }}>
                  {editMode ? "✓ Done" : "✎ Edit"}
                </button>
                <button className={`action-btn copy`} onClick={copyReply}>
                  {copied ? "✓ Copied!" : "⧉ Copy"}
                </button>
              </div>
            </div>

            {editMode ? (
              <textarea
                rows={8}
                value={editedReply}
                onChange={(e) => setEditedReply(e.target.value)}
                style={{ background: "rgba(255,180,50,0.04)", borderColor: "rgba(255,180,50,0.3)" }}
              />
            ) : (
              <div className="reply-box">{reply}</div>
            )}

            <div style={{ marginTop: 12, fontSize: 11, color: "#3a3428", display: "flex", gap: 16 }}>
              <span>Tone: {TONES.find(t => t.id === tone)?.label}</span>
              <span>Language: {language}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
