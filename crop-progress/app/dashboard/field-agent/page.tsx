"use client";
import React, { useState, useEffect } from "react";
import {
  getFieldsByUser,
  agentUpdateField,
  Field,
  AgentUpdateInput,
  getAllUsers,
} from "@/utils/api";
import WeatherWidget from "@/components/WeatherWidget";

const SIDEBAR_W = 240;

const stageConfig: Record<
  string,
  { color: string; bg: string; icon: string; border: string }
> = {
  Planted: { color: "#5A9BE8", bg: "rgba(90,155,232,0.10)", icon: "🌱", border: "rgba(90,155,232,0.25)" },
  Growing: { color: "#5EC47A", bg: "rgba(94,196,122,0.10)", icon: "🌿", border: "rgba(94,196,122,0.25)" },
  Ready: { color: "#E8B84B", bg: "rgba(232,184,75,0.10)", icon: "🌾", border: "rgba(232,184,75,0.25)" },
  Harvested: { color: "#E87A5A", bg: "rgba(232,122,90,0.10)", icon: "✅", border: "rgba(232,122,90,0.25)" },
};

const statusConfig: Record<string, { color: string; bg: string; dot: string }> = {
  Active: { color: "#5EC47A", bg: "rgba(94,196,122,0.10)", dot: "#5EC47A" },
  "At Risk": { color: "#E8B84B", bg: "rgba(232,184,75,0.10)", dot: "#E8B84B" },
  Completed: { color: "#5A9BE8", bg: "rgba(90,155,232,0.10)", dot: "#5A9BE8" },
};

const stages = ["Planted", "Growing", "Ready", "Harvested"];

export default function FieldAgentDashboard() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [updateData, setUpdateData] = useState<AgentUpdateInput>({ current_stage: "Planted", insights: "" });
  const [userId, setUserId] = useState<number | null>(null);
  const [activeNav, setActiveNav] = useState("fields");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const u = JSON.parse(saved);
      console.log('Field Agent - User data from localStorage:', u);
      setCurrentUser(u);
      setUserId(u.user_id);
    } else {
      console.log('Field Agent - No user data found in localStorage');
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchAssignedFields();
  }, [userId]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {}
  };

  const fetchAssignedFields = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await getFieldsByUser(userId);
      setFields(data);
      setError('');
    } catch (err: any) {
      setError(err.message || "Failed to fetch fields");
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField) return;
    setSubmitting(true);
    try {
      await agentUpdateField(selectedField.field_id, updateData);
      setIsOpen(false);
      setSelectedField(null);
      setUpdateData({ current_stage: "Planted", insights: "" });
      fetchAssignedFields();
    } catch (err: any) {
      setError(err.message || "Failed to update field");
    } finally {
      setSubmitting(false);
    }
  };

  const openUpdate = (f: Field) => {
    setSelectedField(f);
    setUpdateData({ current_stage: f.current_stage, insights: f.insights || "" });
    setIsOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const totalFields = fields.length;
  const statusBreakdown = fields.reduce((a, f) => {
    a[f.computed_status] = (a[f.computed_status] || 0) + 1;
    return a;
  }, {} as Record<string, number>);
  const stageBreakdown = fields.reduce((a, f) => {
    a[f.current_stage] = (a[f.current_stage] || 0) + 1;
    return a;
  }, {} as Record<string, number>);
  const readyForHarvest = stageBreakdown["Ready"] || 0;

  const fieldAgents = users.filter((u) => u.users_role === "field_agent");

  const navItems = [
    { id: "fields", label: "My Fields", icon: "🌾" },
    { id: "weather", label: "Weather", icon: "🌦" },
    { id: "updates", label: "Updates", icon: "📝" },
  ];

  const SidebarContent = () => (
    <>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#4E8B3A,#7AB85A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
          <span style={{ fontFamily: "Instrument Serif", fontSize: 18, color: "#F0EDE4" }}>CropSync</span>
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ background: "rgba(78,139,58,0.08)", border: "1px solid rgba(78,139,58,0.18)", borderRadius: 10, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#3A7A6A,#5DCAA5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500, color: "white" }}>{currentUser?.username?.charAt(0).toUpperCase() || "F"}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#E8E4DA" }}>{currentUser?.username || "Field Agent"}</div>
              <div style={{ fontSize: 11, color: "#5DCAA5" }}>Active • Online</div>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 6 }}>Viewing as:</span>
            <select value={userId || ''} onChange={(e) => setUserId(parseInt(e.target.value))} style={{ width: "100%", padding: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#C8C4BB", fontSize: 12 }}>
              {fieldAgents.map((u) => (
                <option key={u.user_id} value={u.user_id}>{u.username}</option>
              ))}
            </select>
          </div>

          <button onClick={handleLogout} style={{ width: "100%", padding: "8px", background: "rgba(220,53,69,0.15)", border: "1px solid rgba(220,53,69,0.3)", borderRadius: 8, color: "#F8727A", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Logout</button>
        </div>
      </div>

      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>Navigation</div>
        {navItems.map((item) => (
          <div key={item.id} className={`nav-item ${activeNav === item.id ? "active" : ""}`} onClick={() => { setActiveNav(item.id); setMobileSidebarOpen(false); }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{ padding: 16, margin: "0 12px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>My Fields</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { l: "Total", v: totalFields, c: "#7AB85A" },
            { l: "Active", v: statusBreakdown["Active"] || 0, c: "#5EC47A" },
            { l: "At Risk", v: statusBreakdown["At Risk"] || 0, c: "#E8B84B" },
            { l: "Ready", v: readyForHarvest, c: "#E8B84B" },
          ].map((s) => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 8, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: s.c, fontFamily: "Instrument Serif" }}>{s.v}</div>
              <div style={{ fontSize: 10, color: "#666", marginTop: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "#0A0E08", color: "#E8E4DA", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .nav-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; cursor:pointer; font-size:14px; font-weight:400; color:#888; transition:all 0.2s; margin-bottom:2px; }
        .nav-item:hover { background:rgba(255,255,255,0.05); color:#C8C4BB; }
        .nav-item.active { background:rgba(78,139,58,0.15); color:#7AB85A; font-weight:500; }

        .field-card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:18px; overflow:hidden; transition:all 0.25s; }
        .field-card:hover { border-color:rgba(78,139,58,0.3); transform:translateY(-2px); background:rgba(255,255,255,0.04); }

        .list-row {
  display: grid;
  grid-template-columns: minmax(150px, 2fr) minmax(80px, 1.2fr) minmax(90px, auto) minmax(90px, auto) minmax(80px, auto) 70px;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  gap: 8px;
}
        .pill { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; font-size:11px; font-weight:500; white-space:nowrap; line-height:1.2; }

        .update-btn { width:100%; background:rgba(78,139,58,0.15); border:1px solid rgba(78,139,58,0.3); color:#7AB85A; border-radius:10px; padding:11px; font-family:'Nunito',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; }
        .update-btn:hover { background:rgba(78,139,58,0.25); border-color:rgba(78,139,58,0.5); }

        .stat-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:22px; transition:border-color 0.2s; }

        .stage-step { display:flex; flex-direction:column; align-items:center; flex:1; position:relative; }
        .stage-step::after { content:''; position:absolute; top:14px; left:calc(50% + 16px); width:calc(100% - 32px); height:1px; background:rgba(255,255,255,0.08); }
        .stage-step:last-child::after { display:none; }

        .sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:149; }
        .sidebar-overlay.open { display:block; }
        .sidebar { width:${SIDEBAR_W}px; flex-shrink:0; background:#0C1009; border-right:1px solid rgba(255,255,255,0.06); display:flex; flex-direction:column; position:fixed; top:0; bottom:0; left:0; z-index:150; transition:transform 0.3s ease; }

        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }

        .field-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }

        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.mobile-open { transform: translateX(0); }
          .main-content { margin-left: 0 !important; }
          .field-grid { grid-template-columns: 1fr !important; }
          .stage-progress { padding: 16px !important; }
          .list-row { grid-template-columns: 1fr auto auto !important; }
          .list-row .hide-m { display: none !important; }
          .header-actions { gap: 6px !important; }
          .header-actions button { font-size: 11px !important; padding: 6px 10px !important; }
          .main-pad { padding: 16px !important; }
        }

        @media (max-width: 480px) {
          .stage-steps { flex-direction: column !important; gap: 12px !important; }
          .stage-step::after { display: none !important; }
        }
      `}</style>

      <div className={`sidebar-overlay ${mobileSidebarOpen ? "open" : ""}`} onClick={() => setMobileSidebarOpen(false)} />
      <aside className={`sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <SidebarContent />
      </aside>

      <main className="main-content" style={{ marginLeft: SIDEBAR_W, flex: 1, minHeight: "100vh" }}>
        <header style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,14,8,0.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setMobileSidebarOpen(true)} style={{ display: "none", background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer", padding: 4 }} className="mob-ham">☰</button>
            <div>
              <div style={{ fontFamily: "Instrument Serif", fontSize: 20, color: "#F0EDE4" }}>
                {activeNav === "fields" ? "My Assigned Fields" : activeNav === "weather" ? "Field Weather" : "Field Updates"}
              </div>
              <div style={{ fontSize: 12, color: "#666", fontWeight: 300 }}>{fields.length} field{fields.length !== 1 ? "s" : ""} assigned</div>
            </div>
          </div>
          {activeNav === "fields" && (
            <div className="header-actions" style={{ display: "flex", gap: 8 }}>
              {(["grid", "list"] as const).map((m) => (
                <button key={m} onClick={() => setViewMode(m)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: viewMode === m ? "rgba(78,139,58,0.15)" : "transparent", color: viewMode === m ? "#7AB85A" : "#888", cursor: "pointer", fontSize: 13, fontFamily: "Nunito" }}>
                  {m === "grid" ? "⊞ Grid" : "☰ List"}
                </button>
              ))}
            </div>
          )}
        </header>
        <style>{`.mob-ham { display: none !important; } @media (max-width: 768px) { .mob-ham { display: block !important; } }`}</style>

        <div className="main-pad" style={{ padding: 28 }}>
          {error && <div style={{ background: "rgba(220,53,69,0.1)", border: "1px solid rgba(220,53,69,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#FF8088" }}>{error}</div>}

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 40 }}>🌿</div>
              <div style={{ fontSize: 14, color: "#666" }}>Loading your fields…</div>
            </div>
          ) : (
            <>
              {activeNav === "fields" && (
                <>
                  <div className="stat-card stage-progress" style={{ marginBottom: 24, padding: "24px 28px" }}>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 18, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em" }}>Growth Stage Distribution</div>
                    <div className="stage-steps" style={{ display: "flex" }}>
                      {stages.map((stage, i) => {
                        const cfg = stageConfig[stage];
                        const count = stageBreakdown[stage] || 0;
                        const pct = totalFields ? Math.round((count / totalFields) * 100) : 0;
                        return (
                          <div key={stage} className="stage-step">
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: count > 0 ? cfg.bg : "rgba(255,255,255,0.04)", border: `1px solid ${count > 0 ? cfg.border : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginBottom: 8 }}>
                              {count > 0 ? cfg.icon : <span style={{ fontSize: 10, color: "#555" }}>{i + 1}</span>}
                            </div>
                            <div style={{ fontSize: 11, color: count > 0 ? cfg.color : "#555", fontWeight: 500 }}>{stage}</div>
                            <div style={{ fontSize: 18, fontFamily: "Instrument Serif", color: count > 0 ? cfg.color : "#444", marginTop: 2 }}>{count}</div>
                            <div style={{ fontSize: 10, color: "#555" }}>{pct}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {viewMode === "grid" ? (
                    <div className="field-grid">
                      {fields.map((f) => {
                        const scfg = stageConfig[f.current_stage] || { color: "#888", bg: "rgba(255,255,255,0.05)", icon: "●", border: "rgba(255,255,255,0.1)" };
                        const stcfg = statusConfig[f.computed_status] || { color: "#888", bg: "rgba(255,255,255,0.05)", dot: "#888" };
                        const stageIdx = stages.indexOf(f.current_stage);
                        const progress = ((stageIdx + 1) / stages.length) * 100;
                        return (
                          <div key={f.field_id} className="field-card">
                            <div style={{ height: 4, background: `linear-gradient(90deg,${scfg.color}66,${scfg.color})` }} />
                            <div style={{ padding: 20 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 15, fontWeight: 500, color: "#E8E4DA", marginBottom: 3 }}>{f.field_name}</div>
                                  <div style={{ fontSize: 12, color: "#666" }}>📍 {f.field_location}</div>
                                </div>
                                <span className="pill" style={{ background: stcfg.bg, color: stcfg.color, fontSize: 11, padding: "4px 10px", whiteSpace: "nowrap" }}>{f.computed_status}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}>
                                <span style={{ fontSize: 20, flexShrink: 0 }}>{scfg.icon}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 11, color: "#666" }}>Crop</div>
                                  <div style={{ fontSize: 14, fontWeight: 500, color: "#C8C4BB" }}>{f.crop_type}</div>
                                </div>
                                <span className="pill" style={{ background: scfg.bg, color: scfg.color, fontSize: 11, padding: "4px 10px", whiteSpace: "nowrap", flexShrink: 0 }}>{scfg.icon} {f.current_stage}</span>
                              </div>
                              <div style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                  <span style={{ fontSize: 11, color: "#666" }}>Growth Progress</span>
                                  <span style={{ fontSize: 11, color: scfg.color }}>{Math.round(progress)}%</span>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 3, height: 4 }}>
                                  <div style={{ height: "100%", borderRadius: 3, background: scfg.color, width: `${progress}%`, transition: "width 0.5s ease" }} />
                                </div>
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px" }}>
                                  <div style={{ fontSize: 10, color: "#666", marginBottom: 2 }}>Planted</div>
                                  <div style={{ fontSize: 12, color: "#A8A49C" }}>{new Date(f.planting_date).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</div>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px" }}>
                                  <div style={{ fontSize: 10, color: "#666", marginBottom: 2 }}>Harvest</div>
                                  <div style={{ fontSize: 12, color: "#A8A49C" }}>{new Date(f.harvesting_date).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}</div>
                                </div>
                              </div>
                              {f.insights && (
                                <div style={{ background: "rgba(78,139,58,0.06)", border: "1px solid rgba(78,139,58,0.15)", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}>
                                  <div style={{ fontSize: 10, color: "#7AB85A", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Latest Insight</div>
                                  <div style={{ fontSize: 12, color: "#A8A49C", lineHeight: 1.5, fontStyle: "italic" }}>{f.insights.substring(0, 100)}{f.insights.length > 100 ? "…" : ""}</div>
                                </div>
                              )}
                              <div style={{ marginBottom: 16 }}>
                                <WeatherWidget location={f.field_location} compact={true} />
                              </div>
                              <button className="update-btn" onClick={() => openUpdate(f)}>📝 Update Field Status</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", overflowX: "auto" }}>
                      <div className="list-row" style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr 1fr 1fr", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
                        {["Field", "Crop", "Stage", "Status", "Harvest", ""].map((h) => (
                          <div key={h} style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
                        ))}
                      </div>
                      {fields.map((f) => {
                        const scfg = stageConfig[f.current_stage] || { color: "#888", bg: "rgba(255,255,255,0.05)", icon: "●", border: "" };
                        const stcfg = statusConfig[f.computed_status] || { color: "#888", bg: "rgba(255,255,255,0.05)", dot: "#888" };
                        return (
                          <div key={f.field_id} className="list-row" style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 500, color: "#E8E4DA" }}>{f.field_name}</div>
                              <div style={{ fontSize: 11, color: "#666" }}>📍 {f.field_location}</div>
                            </div>
                            <div style={{ fontSize: 13, color: "#A8A49C" }} className="hide-m">{f.crop_type}</div>
                            <span className="pill" style={{ background: scfg.bg, color: scfg.color, fontSize: 11 }}>{scfg.icon} {f.current_stage}</span>
                            <span className="pill hide-m" style={{ background: stcfg.bg, color: stcfg.color, fontSize: 11 }}>{f.computed_status}</span>
                            <div style={{ fontSize: 12, color: "#888" }} className="hide-m">{new Date(f.harvesting_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "2-digit" })}</div>
                            <button onClick={() => openUpdate(f)} style={{ padding: "6px 12px", background: "rgba(78,139,58,0.15)", border: "1px solid rgba(78,139,58,0.3)", borderRadius: 6, color: "#7AB85A", fontSize: 12, cursor: "pointer" }}>Update</button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {fields.length === 0 && (
                    <div style={{ textAlign: "center", padding: "80px 20px" }}>
                      <div style={{ fontSize: 52, marginBottom: 16 }}>🌾</div>
                      <div style={{ fontFamily: "Instrument Serif", fontSize: 24, color: "#F0EDE4", marginBottom: 8 }}>No fields assigned</div>
                      <div style={{ fontSize: 14, color: "#666", fontWeight: 300 }}>Contact your admin to get fields assigned to your account.</div>
                    </div>
                  )}
                </>
              )}

              {activeNav === "weather" && (
                <div>
                  <div style={{ fontFamily: "Instrument Serif", fontSize: 22, color: "#F0EDE4", marginBottom: 24 }}>Weather for My Fields</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
                    {Array.from(new Set(fields.map((f) => f.field_location))).map((loc) => (
                      <WeatherWidget key={loc} location={loc} />
                    ))}
                  </div>
                </div>
              )}

              {activeNav === "updates" && (
                <div>
                  <div style={{ fontFamily: "Instrument Serif", fontSize: 22, color: "#F0EDE4", marginBottom: 24 }}>Recent Field Updates</div>
                  {fields.filter((f) => f.insights).map((f) => {
                    const scfg = stageConfig[f.current_stage] || { color: "#888", bg: "rgba(255,255,255,0.05)", icon: "●", border: "" };
                    return (
                      <div key={f.field_id} className="stat-card" style={{ marginBottom: 16, display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div style={{ fontSize: 28, flexShrink: 0 }}>{scfg.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#E8E4DA" }}>{f.field_name}</div>
                            <span className="pill" style={{ background: scfg.bg, color: scfg.color, fontSize: 11 , gap:2}}>{f.current_stage}</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#A8A49C", lineHeight: 1.6, fontStyle: "italic" }}>"{f.insights}"</div>
                          <div style={{ fontSize: 11, color: "#666", marginTop: 8 }}>📍 {f.field_location} • {f.crop_type}</div>
                        </div>
                      </div>
                    );
                  })}
                  {fields.filter((f) => f.insights).length === 0 && (
                    <div style={{ textAlign: "center", padding: 60, color: "#555" }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
                      <div>No updates logged yet</div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Custom Update Modal */}
      {isOpen && selectedField && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }} onClick={() => setIsOpen(false)}>
          <div style={{ background: "#111A0D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleUpdateField}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontFamily: "Instrument Serif", fontSize: 22, color: "#F0EDE4" }}>Update Field</div>
                <div style={{ fontSize: 13, color: "#888", fontWeight: 300 }}>{selectedField.field_name} · {selectedField.field_location}</div>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Stage</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                    {stages.map((s) => {
                      const cfg = stageConfig[s];
                      const isActive = updateData.current_stage === s;
                      return (
                        <button key={s} type="button" onClick={() => setUpdateData({ ...updateData, current_stage: s as any })} style={{ padding: "12px 8px", borderRadius: 12, cursor: "pointer", border: isActive ? `1px solid ${cfg.border}` : "1px solid rgba(255,255,255,0.08)", background: isActive ? cfg.bg : "rgba(255,255,255,0.03)", transition: "all 0.2s", textAlign: "center" }}>
                          <div style={{ fontSize: 18, marginBottom: 4 }}>{cfg.icon}</div>
                          <div style={{ fontSize: 11, color: isActive ? cfg.color : "#666", fontFamily: "Nunito", fontWeight: isActive ? 500 : 400 }}>{s}</div>
                          {isActive && <div style={{ width: 20, height: 2, background: cfg.color, borderRadius: 1, margin: "4px auto 0" }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Field Observations & Insights *</label>
                  <textarea placeholder={`Share observations about:\n• Crop health and growth progress\n• Weather conditions and impact\n• Pest or disease observations\n• Soil and irrigation status`} value={updateData.insights} onChange={(e) => setUpdateData({ ...updateData, insights: e.target.value })} required rows={5} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA", resize: "vertical" }} />
                </div>
              </div>
              <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button type="button" onClick={() => setIsOpen(false)} style={{ padding: "8px 16px", background: "transparent", border: "none", color: "#888", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: "8px 20px", background: "rgba(78,139,58,0.2)", border: "1px solid rgba(78,139,58,0.4)", borderRadius: 8, color: "#7AB85A", fontWeight: 500, cursor: "pointer", opacity: submitting ? 0.6 : 1 }}>{submitting ? "Saving…" : "Save Update"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}