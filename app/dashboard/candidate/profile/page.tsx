"use client";

import { useEffect, useState } from "react";

// ─── Design tokens (matching the old profile's aesthetic) ───────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #F8FAFC;
    color: #1A202C;
  }

  .card {
    background: #fff;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 24px 28px;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    background: #F1F5F9;
    color: #475569;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
  }
  .badge-green { background: #DCFCE7; color: #15803D; }
  .badge-gray  { background: #F1F5F9; color: #475569; }
  .badge-blue  { background: #DBEAFE; color: #1D4ED8; }

  .btn-primary {
    background: #0A2540;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }
  .btn-primary:hover { background: #1E3A5F; }

  .btn-outline {
    background: transparent;
    color: #0A2540;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    padding: 8px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }
  .btn-outline:hover { border-color: #0A2540; background: #F8FAFC; }

  .btn-ghost {
    background: transparent;
    color: #64748B;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 6px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    cursor: pointer;
  }
  .btn-ghost:hover { border-color: #94A3B8; }

  .input {
    width: 100%;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    padding: 9px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1A202C;
    outline: none;
    transition: border-color 0.15s;
  }
  .input:focus { border-color: #1E6FD9; box-shadow: 0 0 0 3px rgba(30,111,217,0.1); }

  .textarea {
    width: 100%;
    border: 1px solid #CBD5E1;
    border-radius: 8px;
    padding: 9px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1A202C;
    outline: none;
    resize: vertical;
    min-height: 80px;
    transition: border-color 0.15s;
  }
  .textarea:focus { border-color: #1E6FD9; box-shadow: 0 0 0 3px rgba(30,111,217,0.1); }

  .label {
    font-size: 12px;
    font-weight: 500;
    color: #64748B;
    margin-bottom: 6px;
    display: block;
  }

  .divider {
    border: none;
    border-top: 1px solid #E2E8F0;
    margin: 16px 0;
  }

  .tab-btn {
    background: transparent;
    border: none;
    padding: 12px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    text-transform: capitalize;
    transition: color 0.15s;
  }

  .skill-bar-track {
    height: 6px;
    background: #E2E8F0;
    border-radius: 99px;
    overflow: hidden;
  }

  .skill-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
  }

  .project-metric-box {
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    gap: 20px;
  }

  .anon-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #EFF6FF;
    color: #1E6FD9;
    border: 1px solid #BFDBFE;
    border-radius: 99px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 500;
  }

  .fairness-box {
    background: #F0FDF4;
    border: 1px solid #A7F3D0;
    border-radius: 10px;
    padding: 14px 16px;
  }

  .loading-shimmer {
    background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .score-ring {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
  }
`;

// ─── Sub-components ──────────────────────────────────────────────────────────

function AnonPill() {
  return (
    <span className="anon-pill">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="4" stroke="#1E6FD9" strokeWidth="1.5" />
        <path
          d="M5 3v2.5l1.5 1"
          stroke="#1E6FD9"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      Anonymised
    </span>
  );
}

function ScoreBadge({ score, size = 52 }: { score: number; size?: number }) {
  const color = score >= 85 ? "#1E6FD9" : score >= 70 ? "#0F6E56" : "#BA7517";
  return (
    <div
      className="score-ring"
      style={{
        width: size,
        height: size,
        border: `3px solid ${color}`,
        fontSize: size >= 64 ? 20 : 15,
        color,
      }}
    >
      {score}
    </div>
  );
}

function SkillBar({ name, level }: { name: string; level: number }) {
  const color = level >= 85 ? "#1E6FD9" : level >= 75 ? "#0F6E56" : "#BA7517";
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: 13, color: "#64748B" }}>{level}/100</span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{ width: `${level}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ─── Field wrapper for edit/view toggle ─────────────────────────────────────

function EditableField({
  editMode,
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  editMode: boolean;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      {editMode ? (
        multiline ? (
          <textarea
            className="textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <input
            className="input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        )
      ) : (
        <p style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.7 }}>
          {value || <span style={{ color: "#CBD5E1" }}>{placeholder}</span>}
        </p>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

const TABS = ["portfolio", "skills", "experience", "assessments"];

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [saving, setSaving] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setUser(data);
      if (!data.isProfileComplete) setEditMode(true);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.skills) {
      setSkillsInput(user.skills.join(", "));
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <style>{css}</style>
        <div
          style={{
            maxWidth: 1100,
            margin: "40px auto",
            padding: "0 32px",
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[120, 200, 160].map((h, i) => (
              <div key={i} className="loading-shimmer" style={{ height: h }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[100, 180].map((h, i) => (
              <div key={i} className="loading-shimmer" style={{ height: h }} />
            ))}
          </div>
        </div>
      </>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/user/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    setUser(data);
    setEditMode(false);
    setSaving(false);
  };

  const handleClear = async () => {
    const res = await fetch("/api/user/profile/clear", { method: "POST" });
    const data = await res.json();
    setUser(data);
    setEditMode(true);
  };

  const handleResumeUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Only PDF files allowed");
      return;
    }
    if (file.size > 1024 * 1024) {
      alert("Max file size is 1MB");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    await fetch("/api/user/profile/upload", { method: "POST", body: formData });
  };

  const initials = (user.name || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const skills: { name: string; level: number }[] = (user.skills || []).map(
    (s: string, i: number) => ({
      name: s,
      level: user.skillLevels?.[i] ?? 75,
    }),
  );

  const projects = user.projects || [];
  const experience = user.experience || [];
  const assessments = user.assessments || [];

  return (
    <>
      <style>{css}</style>

      {/* ── Profile header ─────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 0" }}
        >
          {/* Top row */}
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
              marginBottom: 28,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#0A2540",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: 26,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 4,
                }}
              >
                <h1
                  style={{
                    fontSize: 22,
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {user.name}
                </h1>
                <AnonPill />
                {user.openToWork && (
                  <span className="badge badge-green">Open to work</span>
                )}
              </div>

              {/* Headline */}
              {editMode ? (
                <input
                  className="input"
                  value={user.headline || ""}
                  onChange={(e) =>
                    setUser({ ...user, headline: e.target.value })
                  }
                  placeholder="e.g. Product Designer & Frontend Developer · Singapore"
                  style={{ marginBottom: 10, fontSize: 13 }}
                />
              ) : (
                <div
                  style={{ fontSize: 14, color: "#64748B", marginBottom: 10 }}
                >
                  {user.headline || (
                    <span style={{ color: "#CBD5E1" }}>
                      Add your headline...
                    </span>
                  )}
                </div>
              )}

              {/* Skill tags */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(user.skills || []).slice(0, 4).map((s: string) => (
                  <span key={s} className="tag" style={{ fontSize: 12 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions + credential shield */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn-outline"
                  onClick={handleClear}
                  style={{ fontSize: 13 }}
                >
                  Clear all
                </button>
                {editMode ? (
                  <button
                    className="btn-primary"
                    onClick={handleSave}
                    style={{ fontSize: 13 }}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save & Preview"}
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => setEditMode(true)}
                    style={{ fontSize: 13 }}
                  >
                    Edit profile
                  </button>
                )}
              </div>

              {/* Credential shield */}
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  padding: "10px 14px",
                  textAlign: "right",
                }}
              >
                <div
                  style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}
                >
                  Credential visibility
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}
                >
                  {user.degreeYear
                    ? `Degree holder · ${user.degreeYear}`
                    : "Degree not added"}
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>
                  University name hidden for fairness
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 32,
              borderTop: "1px solid #E2E8F0",
              paddingTop: 16,
            }}
          >
            {[
              [projects.length, "Projects"],
              [assessments.length, "Assessments"],
              [
                user.avgMatchScore ? `${user.avgMatchScore}%` : "—",
                "Avg match score",
              ],
              [(user.skills || []).length, "Skills"],
            ].map(([n, l]) => (
              <div key={String(l)} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#0A2540",
                  }}
                >
                  {n}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 16 }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                className="tab-btn"
                onClick={() => setActiveTab(tab)}
                style={{
                  fontWeight: activeTab === tab ? 500 : 400,
                  color: activeTab === tab ? "#1E6FD9" : "#64748B",
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #1E6FD9"
                      : "2px solid transparent",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "32px",
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 24,
        }}
      >
        {/* ── Main content ── */}
        <div>
          {/* PORTFOLIO TAB */}
          {activeTab === "portfolio" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {projects.length === 0 && (
                <div
                  className="card"
                  style={{
                    textAlign: "center",
                    padding: "40px 24px",
                    color: "#94A3B8",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📁</div>
                  <div style={{ fontSize: 14 }}>
                    No projects yet. Switch to Edit mode to add your first
                    project.
                  </div>
                </div>
              )}

              {projects.map((p: any, i: number) => (
                <div key={i} className="card">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <span
                        className="badge badge-gray"
                        style={{ marginBottom: 8, display: "inline-block" }}
                      >
                        {p.type || "Project"}
                      </span>
                      {editMode ? (
                        <input
                          className="input"
                          value={p.title}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[i] = {
                              ...updated[i],
                              title: e.target.value,
                            };
                            setUser({ ...user, projects: updated });
                          }}
                          style={{ marginBottom: 4 }}
                          placeholder="Project title"
                        />
                      ) : (
                        <h3
                          style={{
                            fontSize: 17,
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          {p.title}
                        </h3>
                      )}
                    </div>
                    {!editMode && (
                      <button
                        className="btn-outline"
                        style={{ fontSize: 12, padding: "6px 12px" }}
                      >
                        View project →
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <textarea
                      className="textarea"
                      value={p.description}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[i] = {
                          ...updated[i],
                          description: e.target.value,
                        };
                        setUser({ ...user, projects: updated });
                      }}
                      placeholder="Describe the project, your role, and impact..."
                      style={{ marginBottom: 12 }}
                    />
                  ) : (
                    <p
                      style={{
                        fontSize: 14,
                        color: "#4A5568",
                        lineHeight: 1.7,
                        marginBottom: 16,
                      }}
                    >
                      {p.description}
                    </p>
                  )}

                  {/* Metrics */}
                  {(p.metrics || []).length > 0 && (
                    <div
                      className="project-metric-box"
                      style={{
                        background: p.color || "#F1F5F9",
                        marginBottom: 16,
                      }}
                    >
                      {p.metrics.map((m: any) => (
                        <div key={m.label}>
                          <div
                            style={{
                              fontFamily: "'Sora', sans-serif",
                              fontSize: 18,
                              fontWeight: 700,
                              color: "#0A2540",
                            }}
                          >
                            {m.val}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748B" }}>
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(p.tags || []).length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.tags.map((t: string) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {editMode && (
                    <button
                      className="btn-ghost"
                      style={{
                        marginTop: 12,
                        color: "#EF4444",
                        borderColor: "#FECACA",
                      }}
                      onClick={() => {
                        const updated = projects.filter(
                          (_: any, j: number) => j !== i,
                        );
                        setUser({ ...user, projects: updated });
                      }}
                    >
                      Remove project
                    </button>
                  )}
                </div>
              ))}

              {editMode && (
                <button
                  className="btn-outline"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderStyle: "dashed",
                  }}
                  onClick={() => {
                    setUser({
                      ...user,
                      projects: [
                        ...(user.projects || []),
                        {
                          title: "",
                          description: "",
                          type: "Project",
                          tags: [],
                          metrics: [],
                          color: "#F1F5F9",
                        },
                      ],
                    });
                  }}
                >
                  + Add project
                </button>
              )}
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === "skills" && (
            <div className="card">
              <h3
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 16,
                  marginBottom: 20,
                }}
              >
                Verified skills
              </h3>

              {editMode && (
                <div style={{ marginBottom: 20 }}>
                  <label className="label">Skills (comma-separated)</label>
                  <input
                    className="input"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    onBlur={() => {
                      setUser({
                        ...user,
                        skills: skillsInput
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      });
                    }}
                    placeholder="React, Python, SQL, Figma"
                  />
                </div>
              )}

              {skills.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px 0",
                    color: "#94A3B8",
                    fontSize: 14,
                  }}
                >
                  No skills added yet.
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {skills.map((s) => (
                    <SkillBar key={s.name} name={s.name} level={s.level} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === "experience" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {experience.length === 0 && (
                <div
                  className="card"
                  style={{
                    textAlign: "center",
                    padding: "40px 24px",
                    color: "#94A3B8",
                    fontSize: 14,
                  }}
                >
                  No experience added yet.
                </div>
              )}

              {experience.map((e: any, i: number) => (
                <div key={i} className="card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {editMode ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <input
                            className="input"
                            value={e.role}
                            onChange={(ev) => {
                              const upd = [...experience];
                              upd[i] = { ...upd[i], role: ev.target.value };
                              setUser({ ...user, experience: upd });
                            }}
                            placeholder="Role title"
                          />
                          <input
                            className="input"
                            value={e.company}
                            onChange={(ev) => {
                              const upd = [...experience];
                              upd[i] = { ...upd[i], company: ev.target.value };
                              setUser({ ...user, experience: upd });
                            }}
                            placeholder="Company name"
                          />
                          <input
                            className="input"
                            value={e.period}
                            onChange={(ev) => {
                              const upd = [...experience];
                              upd[i] = { ...upd[i], period: ev.target.value };
                              setUser({ ...user, experience: upd });
                            }}
                            placeholder="e.g. May – Aug 2024"
                          />
                          <textarea
                            className="textarea"
                            value={e.desc}
                            onChange={(ev) => {
                              const upd = [...experience];
                              upd[i] = { ...upd[i], desc: ev.target.value };
                              setUser({ ...user, experience: upd });
                            }}
                            placeholder="Describe your responsibilities and impact..."
                          />
                          <button
                            className="btn-ghost"
                            style={{
                              color: "#EF4444",
                              borderColor: "#FECACA",
                              width: "fit-content",
                            }}
                            onClick={() =>
                              setUser({
                                ...user,
                                experience: experience.filter(
                                  (_: any, j: number) => j !== i,
                                ),
                              })
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <div
                            style={{
                              fontFamily: "'Sora', sans-serif",
                              fontSize: 15,
                              fontWeight: 600,
                              marginBottom: 3,
                            }}
                          >
                            {e.role}
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              color: "#1E6FD9",
                              marginBottom: 2,
                            }}
                          >
                            {e.company}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#94A3B8",
                              marginBottom: 10,
                            }}
                          >
                            {e.period}
                          </div>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#4A5568",
                              lineHeight: 1.6,
                            }}
                          >
                            {e.desc}
                          </p>
                        </>
                      )}
                    </div>
                    {!editMode && e.hidden && <AnonPill />}
                  </div>
                </div>
              ))}

              {editMode && (
                <button
                  className="btn-outline"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderStyle: "dashed",
                  }}
                  onClick={() =>
                    setUser({
                      ...user,
                      experience: [
                        ...(user.experience || []),
                        {
                          role: "",
                          company: "",
                          period: "",
                          desc: "",
                          hidden: false,
                        },
                      ],
                    })
                  }
                >
                  + Add experience
                </button>
              )}
            </div>
          )}

          {/* ASSESSMENTS TAB */}
          {activeTab === "assessments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {assessments.length === 0 && (
                <div
                  className="card"
                  style={{
                    textAlign: "center",
                    padding: "40px 24px",
                    color: "#94A3B8",
                    fontSize: 14,
                  }}
                >
                  No assessments completed yet.
                </div>
              )}

              {assessments.map((a: any, i: number) => (
                <div
                  key={i}
                  className="card"
                  style={{ display: "flex", alignItems: "center", gap: 16 }}
                >
                  <ScoreBadge score={a.score} size={52} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      {a.role}
                    </div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>
                      {a.company} · {a.date}
                    </div>
                  </div>
                  <span
                    className={`badge ${a.status === "Shortlisted" ? "badge-green" : "badge-gray"}`}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Suitability score */}
          {user.suitabilityScore && (
            <div
              className="card"
              style={{ textAlign: "center", padding: "24px" }}
            >
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 12 }}>
                Overall suitability score
              </div>
              <ScoreBadge score={user.suitabilityScore} size={72} />
              <div
                style={{
                  fontSize: 13,
                  color: "#64748B",
                  marginTop: 12,
                  lineHeight: 1.5,
                }}
              >
                Based on portfolio quality,
                <br />
                assessment results, and skill match
              </div>
            </div>
          )}

          {/* About */}
          <div className="card">
            <h4
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              About
            </h4>

            {editMode ? (
              <textarea
                className="textarea"
                value={user.bio || ""}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                placeholder="Tell employers about yourself..."
                style={{ marginBottom: 12 }}
              />
            ) : (
              <p
                style={{
                  fontSize: 13,
                  color: "#4A5568",
                  lineHeight: 1.7,
                  marginBottom: 12,
                }}
              >
                {user.bio || (
                  <span style={{ color: "#CBD5E1" }}>Add a short bio...</span>
                )}
              </p>
            )}

            <hr className="divider" />

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["Location", user.location],
                ["Availability", user.availability],
                ["Preferred role", user.preferredRole],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#94A3B8" }}>{k}</span>
                  {editMode ? (
                    <input
                      className="input"
                      value={v || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          [k === "Location"
                            ? "location"
                            : k === "Availability"
                              ? "availability"
                              : "preferredRole"]: e.target.value,
                        })
                      }
                      style={{ width: 140, fontSize: 12, padding: "4px 8px" }}
                      placeholder={`Add ${k?.toLowerCase()}`}
                    />
                  ) : (
                    <span style={{ fontWeight: 500 }}>
                      {v || <span style={{ color: "#CBD5E1" }}>—</span>}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resume */}
          <div className="card">
            <h4
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              Resume
            </h4>

            {user.resumeUrl ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 13,
                    color: "#1E6FD9",
                    textDecoration: "none",
                  }}
                >
                  View uploaded resume ↗
                </a>
                {editMode && (
                  <label style={{ cursor: "pointer" }}>
                    <span className="btn-ghost" style={{ fontSize: 12 }}>
                      Replace
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files?.[0])
                          handleResumeUpload(e.target.files[0]);
                      }}
                    />
                  </label>
                )}
              </div>
            ) : editMode ? (
              <label style={{ cursor: "pointer", display: "block" }}>
                <div
                  style={{
                    border: "1px dashed #CBD5E1",
                    borderRadius: 8,
                    padding: "16px",
                    textAlign: "center",
                    fontSize: 13,
                    color: "#94A3B8",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>📄</div>
                  Click to upload PDF (max 1MB)
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0])
                      handleResumeUpload(e.target.files[0]);
                  }}
                />
              </label>
            ) : (
              <div style={{ fontSize: 13, color: "#94A3B8" }}>
                No resume uploaded yet.
              </div>
            )}
          </div>

          {/* Fairness note */}
          <div className="fairness-box">
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#065F46",
                marginBottom: 6,
              }}
            >
              Aptly fairness active
            </div>
            <div style={{ fontSize: 12, color: "#064E3B", lineHeight: 1.6 }}>
              School name, graduation year, and network connections are
              anonymised. Employers evaluate work quality first.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
