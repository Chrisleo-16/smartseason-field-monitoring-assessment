"use client";
import React, { useState, useEffect } from "react";
import {
  getAllFields,
  createField,
  deleteField,
  Field,
  CreateFieldInput,
  getAllUsers,
} from "@/utils/api";
import WeatherWidget from "@/components/WeatherWidget";

const SIDEBAR_W = 240;

const stageConfig: Record<
  string,
  {
    color: string;
    bg: string;
    icon: string;
  }
> = {
  Planted: { color: "#5A9BE8", bg: "rgba(90,155,232,0.12)", icon: "🌱" },
  Growing: { color: "#5EC47A", bg: "rgba(94,196,122,0.12)", icon: "🌿" },
  Ready: { color: "#E8B84B", bg: "rgba(232,184,75,0.12)", icon: "🌾" },
  Harvested: { color: "#E87A5A", bg: "rgba(232,122,90,0.12)", icon: "✅" },
};

const statusConfig: Record<string, { color: string; bg: string }> = {
  Active: { color: "#5EC47A", bg: "rgba(94,196,122,0.12)" },
  "At Risk": { color: "#E8B84B", bg: "rgba(232,184,75,0.12)" },
  Completed: { color: "#5A9BE8", bg: "rgba(90,155,232,0.12)" },
};

export default function AdminDashboard() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [users, setUsers] = useState<any[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateFieldInput>({
    field_name: "",
    field_location: "",
    crop_type: "",
    planting_date: "",
    harvesting_date: "",
    user_id: 0,
    insights: "",
    status_description: "",
    current_stage: "Planted",
  });
  const [plantingDateVal, setPlantingDateVal] = useState<string>("");
  const [harvestDateVal, setHarvestDateVal] = useState<string>("");

  useEffect(() => {
    fetchFields();
    fetchUsers();
  }, []);

  const fetchFields = async () => {
    try {
      const data = await getAllFields();
      setFields(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch fields");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        planting_date: plantingDateVal,
        harvesting_date: harvestDateVal,
      };
      await createField(payload);
      setIsOpen(false);
      setFormData({
        field_name: "",
        field_location: "",
        crop_type: "",
        planting_date: "",
        harvesting_date: "",
        user_id: 0,
        insights: "",
        status_description: "",
        current_stage: "Planted",
      });
      setPlantingDateVal("");
      setHarvestDateVal("");
      fetchFields();
    } catch (err: any) {
      setError(err.message || "Failed to create field");
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    if (!window.confirm("Delete this field?")) return;
    try {
      await deleteField(fieldId);
      fetchFields();
    } catch (err: any) {
      setError(err.message || "Failed to delete field");
    }
  };

  const handleEditField = (field: Field) => {
    setEditingFieldId(field.field_id);
    setIsEditMode(true);
    setFormData({
      field_name: field.field_name,
      field_location: field.field_location,
      crop_type: field.crop_type,
      planting_date: field.planting_date,
      harvesting_date: field.harvesting_date,
      user_id: field.user_id,
      insights: field.insights,
      status_description: field.status_description,
      current_stage: field.current_stage,
    });
    setPlantingDateVal(field.planting_date.split('T')[0]);
    setHarvestDateVal(field.harvesting_date.split('T')[0]);
    setIsOpen(true);
  };

  const handleUpdateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFieldId) return;
    
    try {
      const payload = {
        ...formData,
        planting_date: plantingDateVal,
        harvesting_date: harvestDateVal,
      };
      
      // Update field via API
      const response = await fetch(`https://smartseason-field-monitoring-assessment.onrender.com/api/field-management/fields/${editingFieldId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed to update field');
      
      setIsOpen(false);
      setIsEditMode(false);
      setEditingFieldId(null);
      setFormData({
        field_name: "",
        field_location: "",
        crop_type: "",
        planting_date: "",
        harvesting_date: "",
        user_id: 0,
        insights: "",
        status_description: "",
        current_stage: "Planted",
      });
      setPlantingDateVal("");
      setHarvestDateVal("");
      fetchFields();
    } catch (err: any) {
      setError(err.message || "Failed to update field");
    }
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
  const filteredFields = fields.filter((f) => {
    const ms =
      f.field_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.field_location.toLowerCase().includes(searchQuery.toLowerCase());
    const mf = filterStage === "All" || f.current_stage === filterStage;
    return ms && mf;
  });

  const navItems = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "fields", label: "Fields", icon: "🌾" },
    { id: "weather", label: "Weather", icon: "🌦" },
    { id: "agents", label: "Agents", icon: "👥" },
  ];

  const fieldAgents = users.filter((u) => u.users_role === "field_agent");

  const SidebarContent = () => (
    <>
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#4E8B3A,#7AB85A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
          <span style={{ fontFamily: "Instrument Serif", fontSize: 18, color: "#F0EDE4" }}>CropSync</span>
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ background: "rgba(78,139,58,0.1)", border: "1px solid rgba(78,139,58,0.2)", borderRadius: 10, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#4E8B3A,#7AB85A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500, color: "white" }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#E8E4DA" }}>Admin</div>
              <div style={{ fontSize: 11, color: "#7AB85A" }}>Farm Manager</div>
            </div>
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
        <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Quick Stats</div>
        {[
          { l: "Total", v: totalFields, c: "#7AB85A" },
          { l: "Active", v: statusBreakdown["Active"] || 0, c: "#5EC47A" },
          { l: "At Risk", v: statusBreakdown["At Risk"] || 0, c: "#E8B84B" },
        ].map((s) => (
          <div key={s.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#888" }}>{s.l}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: s.c }}>{s.v}</span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#0A0E08", color: "#E8E4DA", display: "flex", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .nav-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; cursor:pointer; font-size:14px; font-weight:400; color:#888; transition:all 0.2s; margin-bottom:2px; }
        .nav-item:hover { background:rgba(255,255,255,0.05); color:#C8C4BB; }
        .nav-item.active { background:rgba(78,139,58,0.15); color:#7AB85A; font-weight:500; }

        .stat-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:24px; transition:border-color 0.2s; }
        .stat-card:hover { border-color:rgba(78,139,58,0.3); }

        .field-row {
  display: grid;
  grid-template-columns: minmax(140px, 1.8fr) minmax(90px, 1.2fr) minmax(80px, 0.8fr) minmax(70px, 0.6fr) minmax(60px, 0.5fr) minmax(80px, auto);
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.15s;
  gap: 6px;
  min-width: 0;
  overflow-x: auto;
}

        .pill { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:100px; font-size:10px; font-weight:500; white-space:nowrap; line-height:1.1; min-width: fit-content; }

        .progress-bg { background:rgba(255,255,255,0.06); border-radius:4px; height:5px; overflow:hidden; margin-top:10px; }
        .progress-fill { height:100%; border-radius:4px; }

        .sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:149; }
        .sidebar-overlay.open { display:block; }

        .sidebar { width:${SIDEBAR_W}px; flex-shrink:0; background:#0C1009; border-right:1px solid rgba(255,255,255,0.06); display:flex; flex-direction:column; position:fixed; top:0; bottom:0; left:0; z-index:150; transition:transform 0.3s ease; }

        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }

        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.mobile-open { transform: translateX(0); }
          .main-content { margin-left: 0 !important; }
          .desktop-header-title { font-size: 18px !important; }
          .field-row { grid-template-columns: 1fr 1fr auto !important; }
          .field-row .hide-mobile { display: none !important; }
          .stats-row { grid-template-columns: repeat(2,1fr) !important; gap: 12px !important; }
          .overview-grid { grid-template-columns: 1fr !important; }
          .fields-toolbar { flex-direction: column !important; align-items: stretch !important; }
          .filter-btns { flex-wrap: wrap !important; }
          .pill { padding: 1px 6px !important; font-size: 9px !important; gap: 2px !important; }
        }

        @media (max-width: 480px) {
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .main-content > div { padding: 16px !important; }
        }
      `}</style>

      <div className={`sidebar-overlay ${mobileSidebarOpen ? "open" : ""}`} onClick={() => setMobileSidebarOpen(false)} />
      <aside className={`sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <SidebarContent />
      </aside>

      <main className="main-content" style={{ marginLeft: SIDEBAR_W, flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,14,8,0.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setMobileSidebarOpen(true)} style={{ display: "none", background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer", padding: 4 }} className="hamburger-trigger">☰</button>
            <div>
              <div className="desktop-header-title" style={{ fontFamily: "Instrument Serif", fontSize: 20, color: "#F0EDE4", lineHeight: 1.2 }}>
                {activeNav === "overview" ? "Farm Overview" : activeNav === "fields" ? "Field Management" : activeNav === "weather" ? "Weather Dashboard" : "Field Agents"}
              </div>
              <div style={{ fontSize: 12, color: "#666", fontWeight: 300 }}>
                {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5EC47A", boxShadow: "0 0 0 3px rgba(94,196,122,0.2)" }} />
            <span style={{ fontSize: 13, color: "#888" }}>System Online</span>
          </div>
        </header>

        <style>{`.hamburger-trigger { display: none !important; } @media (max-width: 768px) { .hamburger-trigger { display: block !important; } }`}</style>

        <div style={{ padding: 28, flex: 1 }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 40 }}>🌿</div>
              <div style={{ fontSize: 14, color: "#666" }}>Loading your fields…</div>
            </div>
          ) : (
            <>
              {activeNav === "overview" && (
                <div>
                  <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                    {[
                      { label: "Total Fields", value: totalFields, sub: "All monitored", color: "#7AB85A", icon: "🌾" },
                      { label: "Active Fields", value: statusBreakdown["Active"] || 0, sub: "Currently growing", color: "#5EC47A", icon: "✅" },
                      { label: "At Risk", value: statusBreakdown["At Risk"] || 0, sub: "Need attention", color: "#E8B84B", icon: "⚠️" },
                      { label: "Completed", value: statusBreakdown["Completed"] || 0, sub: "This season", color: "#5A9BE8", icon: "🎯" },
                    ].map((s) => (
                      <div key={s.label} className="stat-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                          <span style={{ fontSize: 22 }}>{s.icon}</span>
                          <span style={{ fontSize: 10, color: "#555", background: "rgba(255,255,255,0.04)", padding: "3px 8px", borderRadius: 6 }}>this season</span>
                        </div>
                        <div style={{ fontFamily: "Instrument Serif", fontSize: 42, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#C8C4BB", marginBottom: 2 }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: "#666" }}>{s.sub}</div>
                        <div className="progress-bg">
                          <div className="progress-fill" style={{ width: `${totalFields ? (s.value / totalFields) * 100 : 0}%`, background: `linear-gradient(90deg,${s.color}88,${s.color})` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="overview-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
                    <div className="stat-card">
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#C8C4BB", marginBottom: 20 }}>Growth Stages</div>
                      {Object.entries(stageBreakdown).map(([stage, count]) => {
                        const cfg = stageConfig[stage] || { color: "#888", bg: "rgba(255,255,255,0.05)", icon: "●" };
                        return (
                          <div key={stage} style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span>{cfg.icon}</span>
                                <span style={{ fontSize: 13, color: "#A8A49C" }}>{stage}</span>
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 500, color: cfg.color }}>{count}</span>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 3, height: 4 }}>
                              <div style={{ height: "100%", borderRadius: 3, background: cfg.color, width: `${totalFields ? (count / totalFields) * 100 : 0}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="stat-card" style={{ padding: 0 }}>
                      <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", gap:'12px' }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#C8C4BB" }}>Recent Fields</div>
                        <button onClick={() => setActiveNav("fields")} style={{ fontSize: 12, color: "#7AB85A", background: "none", border: "none", cursor: "pointer" }}>View All →</button>
                      </div>
                      {fields.slice(0, 5).map((f) => {
                        const scfg = stageConfig[f.current_stage] || { color: "#888", bg: "rgba(255,255,255,0.05)", icon: "●" };
                        const stcfg = statusConfig[f.computed_status] || { color: "#888", bg: "rgba(255,255,255,0.05)" };
                        return (
                          <div key={f.field_id} className="field-row" style={{ padding: "12px 24px" }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 500, color: "#E8E4DA" }}>{f.field_name}</div>
                              <div style={{ fontSize: 11, color: "#666" }}>📍 {f.field_location}</div>
                            </div>
                            <div style={{ fontSize: 13, color: "#A8A49C" }}>{f.crop_type}</div>
                            <span className="pill" style={{ color: scfg.color, background: scfg.bg, fontSize: 11, gap: "3px" }}>{scfg.icon} {f.current_stage}</span>
                            <span className="pill" style={{ color: stcfg.color, background: stcfg.bg, fontSize: 11 }}>{f.computed_status}</span>
                            <div style={{ fontSize: 12, color: "#666" }}>#{f.user_id}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeNav === "fields" && (
                <div>
                  {error && <div style={{ background: "rgba(220,53,69,0.1)", border: "1px solid rgba(220,53,69,0.25)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#FF8088" }}>{error}</div>}

                  <div className="fields-toolbar" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                    <div style={{ position: "relative", maxWidth: 280, flex: "0 0 auto" }}>
                      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#666" }}>🔍</span>
                      <input
                        type="text"
                        placeholder="Search fields…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "100%", padding: "8px 8px 8px 32px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA", fontSize: 13 }}
                      />
                    </div>
                    <div className="filter-btns" style={{ display: "flex", gap: 8 }}>
                      {["All", "Planted", "Growing", "Ready", "Harvested"].map((s) => (
                        <button key={s} onClick={() => setFilterStage(s)} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${filterStage === s ? "rgba(78,139,58,0.4)" : "rgba(255,255,255,0.08)"}`, background: filterStage === s ? "rgba(78,139,58,0.15)" : "transparent", color: filterStage === s ? "#7AB85A" : "#888", cursor: "pointer", fontFamily: "DM Sans", fontSize: 13, transition: "all 0.15s" }}>{s}</button>
                      ))}
                    </div>
                    <button onClick={() => setIsOpen(true)} style={{ marginLeft: "auto", padding: "8px 16px", background: "rgba(78,139,58,0.15)", border: "1px solid rgba(78,139,58,0.3)", borderRadius: 8, color: "#7AB85A", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>+ Add Field</button>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", overflowX: "auto" }}>
                    <div className="field-row" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 20px" }}>
                      {["Field Name", "Location", "Crop", "Stage", "Status", "User", ""].map((h) => (
                        <div key={h} style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500 }}>{h}</div>
                      ))}
                    </div>
                    {filteredFields.map((f) => {
                      const scfg = stageConfig[f.current_stage] || { color: "#888", bg: "rgba(255,255,255,0.05)", icon: "●" };
                      const stcfg = statusConfig[f.computed_status] || { color: "#888", bg: "rgba(255,255,255,0.05)" };
                      return (
                        <div key={f.field_id} className="field-row">
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#E8E4DA" }}>{f.field_name}</div>
                            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>#{f.field_id}</div>
                          </div>
                          <div style={{ fontSize: 13, color: "#A8A49C" }} className="hide-mobile">📍 {f.field_location}</div>
                          <div style={{ fontSize: 13, color: "#A8A49C" }} className="hide-mobile">{f.crop_type}</div>
                          <span className="pill" style={{ color: scfg.color, background: scfg.bg, fontSize: 11, gap: "3px" }}>{scfg.icon} {f.current_stage}</span>
                          <span className="pill hide-mobile" style={{ color: stcfg.color, background: stcfg.bg, fontSize: 11 }}>{f.computed_status}</span>
                          <div style={{ fontSize: 12, color: "#666" }} className="hide-mobile">#{f.user_id}</div>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => handleEditField(f)} style={{ padding: "4px 8px", background: "rgba(78,139,58,0.15)", border: "1px solid rgba(78,139,58,0.3)", borderRadius: 6, color: "#7AB85A", fontSize: 12, cursor: "pointer" }}>Edit</button>
                            <button onClick={() => handleDeleteField(f.field_id)} style={{ padding: "4px 8px", background: "rgba(220,53,69,0.15)", border: "1px solid rgba(220,53,69,0.3)", borderRadius: 6, color: "#F8727A", fontSize: 12, cursor: "pointer" }}>Delete</button>
                          </div>
                        </div>
                      );
                    })}
                    {filteredFields.length === 0 && (
                      <div style={{ padding: 60, textAlign: "center", color: "#555" }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>🌾</div>
                        <div>No fields found</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeNav === "weather" && (
                <div>
                  <div style={{ fontFamily: "Instrument Serif", fontSize: 24, color: "#F0EDE4", marginBottom: 24 }}>Weather by Location</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
                    {Array.from(new Set(fields.map((f) => f.field_location))).map((loc) => (
                      <WeatherWidget key={loc} location={loc} />
                    ))}
                  </div>
                </div>
              )}

              {activeNav === "agents" && (
                <div>
                  <div style={{ fontFamily: "Instrument Serif", fontSize: 24, color: "#F0EDE4", marginBottom: 24 }}>Field Agents</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
                    {fieldAgents.map((u: any) => {
                      const assigned = fields.filter((f) => f.user_id === u.user_id).length;
                      return (
                        <div key={u.user_id} className="stat-card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#3A7A6A,#5DCAA5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: "white", flexShrink: 0 }}>{u.username.charAt(0).toUpperCase()}</div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#E8E4DA", marginBottom: 3 }}>{u.username}</div>
                            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{u.email}</div>
                            <span className="pill" style={{ background: "rgba(94,196,122,0.15)", color: "#5EC47A", fontSize: 11 }}>{assigned} field{assigned !== 1 ? "s" : ""} assigned</span>
                          </div>
                        </div>
                      );
                    })}
                    {fieldAgents.length === 0 && <div style={{ color: "#666", fontSize: 14 }}>No field agents registered yet.</div>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Custom Modal */}
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }} onClick={() => setIsOpen(false)}>
          <div style={{ background: "#111A0D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, width: "95%", maxWidth: "700px", maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={isEditMode ? handleUpdateField : handleCreateField}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontFamily: "Instrument Serif", fontSize: 24, color: "#F0EDE4" }}>{isEditMode ? "Update Field" : "Add New Field"}</span>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Field Name *</label>
                    <input type="text" placeholder="North Maize Field" value={formData.field_name} onChange={(e) => setFormData({ ...formData, field_name: e.target.value })} required style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Location *</label>
                    <input type="text" placeholder="Nakuru" value={formData.field_location} onChange={(e) => setFormData({ ...formData, field_location: e.target.value })} required style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Crop Type *</label>
                    <input type="text" placeholder="Maize" value={formData.crop_type} onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })} required style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Assign to Field Agent *</label>
                    <select value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) })} required style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA" }}>
                      <option value="">Select agent…</option>
                      {fieldAgents.map((u) => (
                        <option key={u.user_id} value={u.user_id}>{u.username} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Planting Date</label>
                    <input type="date" value={plantingDateVal} onChange={(e) => setPlantingDateVal(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Harvest Date</label>
                    <input type="date" value={harvestDateVal} onChange={(e) => setHarvestDateVal(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Current Stage</label>
                  <select value={formData.current_stage} onChange={(e) => setFormData({ ...formData, current_stage: e.target.value as any })} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA" }}>
                    {["Planted", "Growing", "Ready", "Harvested"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Status Description</label>
                  <textarea placeholder="Describe the current field status…" value={formData.status_description} onChange={(e) => setFormData({ ...formData, status_description: e.target.value })} rows={2} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA", resize: "vertical" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Insights</label>
                  <textarea placeholder="Add any initial insights…" value={formData.insights} onChange={(e) => setFormData({ ...formData, insights: e.target.value })} rows={2} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#E8E4DA", resize: "vertical" }} />
                </div>
              </div>
              <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button type="button" onClick={() => setIsOpen(false)} style={{ padding: "8px 16px", background: "transparent", border: "none", color: "#888", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "8px 20px", background: "rgba(78,139,58,0.2)", border: "1px solid rgba(78,139,58,0.4)", borderRadius: 8, color: "#7AB85A", fontWeight: 500, cursor: "pointer" }}>{isEditMode ? "Update Field" : "Create Field"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}