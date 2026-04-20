"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  // Parallax values
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveFeature((p) => (p + 1) % 4), 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🛰️",
      title: "Satellite Field Monitoring",
      desc: "AI-powered crop health analysis. Detect stress, disease, and yield potential before problems escalate.",
      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    },
    {
      icon: "🌦️",
      title: "Hyper-Local Weather",
      desc: "Field-level 14-day forecasts with farming advisories. Know exactly when to plant, irrigate, or harvest.",
      img: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80",
    },
    {
      icon: "📊",
      title: "Yield Intelligence",
      desc: "Predictive harvest analytics combining soil data, weather history, and crop genetics for maximum output.",
      img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    },
    {
      icon: "👥",
      title: "Field Agent Coordination",
      desc: "Real-time task management and field reporting. Keep your entire agri team connected and accountable.",
      img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    },
  ];

  const testimonials = [
    {
      name: "James Mwangi",
      role: "Farm Owner, Nakuru",
      quote:
        "CropSync doubled our maize yield in one season. The weather alerts alone saved us from a major loss during the dry spell.",
      avatar: "JM",
      color: "#4E8B3A",
    },
    {
      name: "Amina Osei",
      role: "Agricultural Manager, Kisumu",
      quote:
        "Managing 8 fields used to be chaos. Now I get everything on one screen with agents reporting in real-time from the ground.",
      avatar: "AO",
      color: "#3A7A6A",
    },
    {
      name: "Peter Kamau",
      role: "Field Agent, Meru",
      quote:
        "The mobile updates are seamless. I log field observations and check forecasts on the go, even with poor connectivity.",
      avatar: "PK",
      color: "#5B6BA0",
    },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: "#060A04",
        color: "#F0EDE4",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .nav-link { font-family:'DM Sans',ss; font-size:14px; font-weight:400; color:#9A968E; text-decoration:none; transition:color 0.2s; }
        .nav-link:hover { color:#F0EDE4; }

        .btn-primary {
          font-family:'DM Sans',ss; font-size:14px; font-weight:500; background:#4E8B3A; color:#fff;
          border:none; border-radius:100px; padding:13px 28px; cursor:pointer;
          transition:all 0.2s; text-decoration:none; display:inline-flex; align-items:center;
          gap:8px; white-space:nowrap;
        }
        .btn-primary:hover { background:#5FA348; transform:translateY(-1px); box-shadow:0 8px 24px rgba(78,139,58,0.3); }

        .btn-ghost {
          font-family:'DM Sans',ss; font-size:14px; font-weight:400; background:transparent;
          color:#F0EDE4; border:1px solid rgba(240,237,228,0.2); border-radius:100px;
          padding:12px 28px; cursor:pointer; transition:all 0.2s; text-decoration:none;
          display:inline-flex; align-items:center; white-space:nowrap;
        }
        .btn-ghost:hover { border-color:rgba(240,237,228,0.5); background:rgba(240,237,228,0.06); }

        .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(78,139,58,0.15); border:1px solid rgba(78,139,58,0.35); border-radius:100px; padding:7px 18px; font-family:'DM Sans',ss; font-size:13px; color:#8BC87A; }
        .green-dot { width:7px; height:7px; border-radius:50%; background:#5FA348; animation:pulse-dot 2s infinite; flex-shrink:0; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }

        .feature-tab {
          padding:18px 20px; border-radius:14px; border:1px solid rgba(255,255,255,0.06);
          background:transparent; cursor:pointer; transition:all 0.25s; text-align:left; width:100%;
        }
        .feature-tab:hover { background:rgba(255,255,255,0.04); border-color:rgba(255,255,255,0.1); }
        .feature-tab.active { background:rgba(78,139,58,0.12); border-color:rgba(78,139,58,0.4); }

        .card-hover { transition:all 0.3s ease; }
        .card-hover:hover { transform:translateY(-4px); }

        .testimonial-card {
          padding:32px; border-radius:20px; border:1px solid rgba(240,237,228,0.08);
          background:rgba(255,255,255,0.025); transition:all 0.3s;
        }
        .testimonial-card:hover { border-color:rgba(78,139,58,0.3); transform:translateY(-3px); }

        .hamburger { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:4px; }
        .hline { display:block; width:22px; height:1.5px; background:#F0EDE4; transition:all 0.3s; }

        /* Layout */
        .cs-container { max-width:1100px; margin:0 auto; }
        .sec-pad { padding:100px 5%; }
        .hero-sec { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:130px 5% 80px; position:relative; text-align:center; }
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        .features-layout { display:grid; grid-template-columns:360px 1fr; gap:44px; align-items:start; }
        .how-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        .test-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .dash-fields { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .dash-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:16px; }
        .hero-cta { display:flex; gap:14px; flex-wrap:wrap; justify-content:center; margin-bottom:72px; }
        .img-trio { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; height:clamp(200px,28vw,360px); }
        .footer-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:60px; gap:40px; }
        .footer-links { display:flex; gap:80px; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .features-layout { grid-template-columns:1fr; gap:28px; }
          .how-grid { grid-template-columns:repeat(2,1fr); }
          .img-trio { grid-template-columns:1fr 1fr; height:auto; }
          .img-trio > *:last-child { display:none; }
          .desktop-links { display:none !important; }
          .desktop-btns { display:none !important; }
          .hamburger { display:flex !important; }
        }

        @media (max-width: 768px) {
          .sec-pad { padding:72px 20px; }
          .hero-sec { padding:110px 20px 60px; }
          .stats-grid { grid-template-columns:repeat(2,1fr); gap:12px; }
          .test-grid { grid-template-columns:1fr; }
          .how-grid { grid-template-columns:repeat(2,1fr); gap:12px; }
          .dash-stats { grid-template-columns:repeat(2,1fr); }
          .dash-fields { grid-template-columns:1fr; }
          .hero-cta { flex-direction:column; align-items:center; }
          .hero-cta > * { width:100%; max-width:300px; justify-content:center; }
          .footer-top { flex-direction:column; }
          .footer-links { gap:40px; }
          .img-trio { grid-template-columns:1fr; height:auto; }
          .img-trio > *:nth-child(2), .img-trio > *:last-child { display:none; }
          .footer-bottom { flex-direction:column; align-items:center; gap:12px; text-align:center; }
        }

        @media (max-width: 480px) {
          .how-grid { grid-template-columns:1fr; }
          .stats-grid { grid-template-columns:1fr 1fr; }
        }
      `}</style>

      {/* ── ANIMATED MOBILE MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(6,10,4,0.98)",
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                background: "none",
                border: "none",
                color: "#F0EDE4",
                fontSize: 28,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, textAlign: "center" }}>
              {["Features", "How It Works", "Testimonials"].map((label, i) => (
                <motion.a
                  key={label}
                  custom={i}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "Instrument Serif, serif",
                    fontSize: 42,
                    color: "#F0EDE4",
                    textDecoration: "none",
                    display: "block",
                  }}
                  whileHover={{ scale: 1.05, color: "#7AB85A" }}
                >
                  {label}
                </motion.a>
              ))}
            </div>
            <motion.div
              variants={menuItemVariants}
              custom={3}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280, marginTop: 48 }}
            >
              <Link
                href="/login"
                className="btn-ghost"
                style={{ justifyContent: "center" }}
                onClick={() => setMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="btn-primary"
                style={{ justifyContent: "center" }}
                onClick={() => setMenuOpen(false)}
              >
                Get Started →
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 5%",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.3s",
          background: scrolled ? "rgba(6,10,4,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(240,237,228,0.07)" : "1px solid transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg,#4E8B3A,#7AB85A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
            }}
          >
            🌿
          </motion.div>
          <span style={{ fontFamily: "Instrument Serif,serif", fontSize: 21, color: "#F0EDE4", letterSpacing: "-0.01em" }}>
            CropSync
          </span>
        </div>
        <div className="desktop-links" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
        </div>
        <div className="desktop-btns" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/login" className="btn-ghost" style={{ padding: "9px 22px" }}>Log In</Link>
          <Link href="/register" className="btn-primary" style={{ padding: "9px 22px" }}>Get Started</Link>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(true)}>
          <span className="hline" />
          <span className="hline" />
          <span className="hline" />
        </button>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.section
        className="hero-sec"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=60"
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.1, filter: "saturate(0.4)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(6,10,4,0.3) 0%,rgba(6,10,4,0.8) 60%,#060A04 100%)" }} />
          <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle,rgba(78,139,58,0.13) 0%,transparent 65%)", pointerEvents: "none" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 920 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-badge"
            style={{ marginBottom: 32 }}
          >
            <span className="green-dot" />
            Now monitoring 3.2M+ acres across East Africa
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: "Instrument Serif,serif",
              fontSize: "clamp(44px,7.5vw,92px)",
              lineHeight: 1.03,
              letterSpacing: "-0.028em",
              color: "#F0EDE4",
              marginBottom: 24,
            }}
          >
            Grow smarter.
            <br />
            <em style={{ color: "#7AB85A", fontStyle: "italic" }}>Harvest better.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontFamily: "DM Sans,ss",
              fontSize: "clamp(15px,2vw,18px)",
              lineHeight: 1.72,
              color: "#9A968E",
              maxWidth: 540,
              marginBottom: 44,
              fontWeight: 300,
            }}
          >
            The complete farm intelligence platform for East African agriculture. Real-time crop monitoring, weather intelligence, and field agent coordination — unified in one powerful dashboard.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-cta"
          >
            <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: "15px 34px" }}>
              Start Free Trial →
            </Link>
            <Link href="/login" className="btn-ghost" style={{ fontSize: 15, padding: "14px 34px" }}>
              View Demo
            </Link>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              width: "100%",
              background: "#0D160A",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              overflow: "hidden",
              padding: 24,
            }}
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.5)", borderColor: "rgba(78,139,58,0.4)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
              <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "#444", marginLeft: 8 }}>
                cropsync.app/dashboard/admin
              </span>
            </div>
            <div className="dash-stats">
              {[
                { l: "Total Fields", v: "24", c: "#7AB85A" },
                { l: "Active", v: "18", c: "#5EC47A" },
                { l: "At Risk", v: "3", c: "#E8B84B" },
                { l: "Harvested", v: "3", c: "#5A9BE8" },
              ].map((s) => (
                <motion.div
                  key={s.l}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: 10,
                      color: "#555",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {s.l}
                  </div>
                  <div style={{ fontFamily: "Instrument Serif", fontSize: 28, color: s.c }}>{s.v}</div>
                </motion.div>
              ))}
            </div>
            <div className="dash-fields">
              {[
                { n: "North Maize Field", loc: "Nakuru", stage: "Growing", sc: "#5EC47A" },
                { n: "East Wheat Block", loc: "Eldoret", stage: "Ready", sc: "#E8B84B" },
                { n: "South Sorghum", loc: "Kisumu", stage: "Planted", sc: "#5A9BE8" },
                { n: "River Valley Farm", loc: "Meru", stage: "Harvested", sc: "#888" },
              ].map((f) => (
                <motion.div
                  key={f.n}
                  whileHover={{ scale: 1.01, background: "rgba(255,255,255,0.05)" }}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "DM Sans", fontWeight: 500, fontSize: 13, color: "#DDD", marginBottom: 3 }}>
                      {f.n}
                    </div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 11, color: "#555" }}>📍 {f.loc}</div>
                  </div>
                  <span
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: 11,
                      fontWeight: 500,
                      background: `${f.sc}20`,
                      color: f.sc,
                      padding: "3px 10px",
                      borderRadius: 100,
                      border: `1px solid ${f.sc}40`,
                    }}
                  >
                    {f.stage}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── STATS ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        style={{ padding: "72px 5%", borderTop: "1px solid rgba(240,237,228,0.06)", borderBottom: "1px solid rgba(240,237,228,0.06)" }}
      >
        <div className="cs-container">
          <div className="stats-grid">
            {[
              { v: "12K+", l: "Active Farms" },
              { v: "98%", l: "Crop Success Rate" },
              { v: "3.2M", l: "Acres Monitored" },
              { v: "40%", l: "Yield Increase" },
            ].map((s) => (
              <motion.div
                key={s.l}
                variants={fadeInUp}
                className="card-hover"
                style={{
                  textAlign: "center",
                  padding: "28px 20px",
                  border: "1px solid rgba(240,237,228,0.07)",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div
                  style={{
                    fontFamily: "Instrument Serif,serif",
                    fontSize: "clamp(38px,5vw,58px)",
                    color: "#7AB85A",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {s.v}
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 14, color: "#9A968E", fontWeight: 300 }}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── HERO IMAGE BAND ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ padding: "80px 5% 0" }}
      >
        <div className="cs-container" style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: "clamp(260px,38vw,480px)" }}>
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&q=80"
            alt="Farm fields aerial"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(6,10,4,0.88) 0%,rgba(6,10,4,0.4) 55%,transparent 100%)" }} />
          <div style={{ position: "absolute", top: "50%", left: "clamp(24px,5%,72px)", transform: "translateY(-50%)", maxWidth: "clamp(240px,38%,460px)" }}>
            <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "#7AB85A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
              Built for Africa
            </div>
            <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(26px,3.5vw,46px)", color: "#F0EDE4", lineHeight: 1.12, letterSpacing: "-0.02em", marginBottom: 18 }}>
              Precision agriculture,
              <br />
              <em style={{ color: "#7AB85A" }}>now within reach</em>
            </h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "clamp(13px,1.5vw,15px)", color: "#9A968E", lineHeight: 1.7, fontWeight: 300 }}>
              From small-holder farmers to large commercial operations — CropSync scales to meet you where you are.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── FEATURES ── */}
      <section id="features" className="sec-pad">
        <div className="cs-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "#7AB85A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
              Features
            </div>
            <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(30px,4vw,54px)", color: "#F0EDE4", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Everything your farm needs,
              <br />
              <em style={{ color: "#7AB85A" }}>in one place</em>
            </h2>
          </motion.div>

          <div className="features-layout">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {features.map((f, i) => (
                <motion.button
                  key={f.title}
                  className={`feature-tab ${activeFeature === i ? "active" : ""}`}
                  onClick={() => setActiveFeature(i)}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: activeFeature === i ? 8 : 0 }}>
                    <span style={{ fontSize: 20 }}>{f.icon}</span>
                    <span
                      style={{
                        fontFamily: "DM Sans",
                        fontSize: 15,
                        fontWeight: 500,
                        color: activeFeature === i ? "#E8E4DA" : "#888",
                      }}
                    >
                      {f.title}
                    </span>
                  </div>
                  <AnimatePresence>
                    {activeFeature === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          fontFamily: "DM Sans",
                          fontSize: 14,
                          color: "#9A968E",
                          lineHeight: 1.65,
                          fontWeight: 300,
                          paddingLeft: 32,
                          overflow: "hidden",
                        }}
                      >
                        {f.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                position: "relative",
                borderRadius: 20,
                overflow: "hidden",
                height: "clamp(260px,38vw,460px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeFeature}
                  src={features[activeFeature].img}
                  alt={features[activeFeature].title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </AnimatePresence>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(6,10,4,0.8) 0%,transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 24, left: 24 }}>
                <span style={{ fontFamily: "DM Sans", fontSize: 13, color: "#7AB85A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {features[activeFeature].icon} {features[activeFeature].title}
                </span>
              </div>
              <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 6 }}>
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    style={{
                      width: activeFeature === i ? 20 : 7,
                      height: 7,
                      borderRadius: 4,
                      background: activeFeature === i ? "#7AB85A" : "rgba(255,255,255,0.3)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3 IMAGE TRIO ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        style={{ padding: "0 5%", marginBottom: 80 }}
      >
        <div className="cs-container">
          <div className="img-trio">
            {[
              { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=700&q=80", l: "Crop Analytics" },
              { src: "/jamie-street-V6FcCG14q30-unsplash.jpg", l: "Field Health" },
              { src: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=700&q=80", l: "Weather Monitoring" },
            ].map((img, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="card-hover"
                style={{ position: "relative", borderRadius: 18, overflow: "hidden", minHeight: 220 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={img.src}
                  alt={img.l}
                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(6,10,4,0.85) 100%)" }} />
                <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                  <span
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#F0EDE4",
                      background: "rgba(6,10,4,0.6)",
                      padding: "5px 12px",
                      borderRadius: 100,
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {img.l}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="sec-pad"
        style={{ borderTop: "1px solid rgba(240,237,228,0.06)", background: "linear-gradient(180deg,rgba(78,139,58,0.03) 0%,transparent 100%)" }}
      >
        <div className="cs-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "#7AB85A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
              Process
            </div>
            <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(30px,4vw,52px)", color: "#F0EDE4", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              From field to harvest,
              <br />
              <em style={{ color: "#7AB85A" }}>we've got you covered</em>
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="how-grid"
          >
            {[
              { step: "01", icon: "📍", title: "Register Your Fields", desc: "Add fields with GPS, crop type, soil data and planting schedule in minutes." },
              { step: "02", icon: "🧑‍🌾", title: "Deploy Field Agents", desc: "Assign agents to specific fields. They get instant mobile access and task lists." },
              { step: "03", icon: "📡", title: "Monitor & Analyse", desc: "Track real-time crop stages, weather events and field health from one dashboard." },
              { step: "04", icon: "🏆", title: "Harvest Smarter", desc: "Use season insights to optimise timing, reduce waste and maximise yield." },
            ].map((s, idx) => (
              <motion.div
                key={s.step}
                variants={fadeInUp}
                className="card-hover"
                style={{ padding: "32px 28px", borderRadius: 18, border: "1px solid rgba(240,237,228,0.07)", background: "rgba(255,255,255,0.02)" }}
                whileHover={{ y: -8, borderColor: "rgba(78,139,58,0.4)" }}
              >
                <div style={{ fontFamily: "Instrument Serif,serif", fontSize: 60, color: "rgba(78,139,58,0.18)", lineHeight: 1, marginBottom: 20, letterSpacing: "-0.03em" }}>
                  {s.step}
                </div>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{s.icon}</div>
                <h4 style={{ fontFamily: "DM Sans", fontSize: 16, fontWeight: 500, color: "#F0EDE4", marginBottom: 10 }}>{s.title}</h4>
                <p style={{ fontFamily: "DM Sans", fontSize: 14, color: "#9A968E", lineHeight: 1.65, fontWeight: 300 }}>{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FULL-BLEED CTA IMAGE ── */}
      <motion.section
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", height: "clamp(320px,48vw,580px)", overflow: "hidden" }}
      >
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80"
          alt="Harvest"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(6,10,4,0.9) 0%,rgba(6,10,4,0.55) 50%,rgba(6,10,4,0.4) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px", textAlign: "center" }}>
          <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "#7AB85A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
            Trusted by 12,000+ farmers
          </div>
          <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(30px,5vw,62px)", color: "#F0EDE4", lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 28, maxWidth: 680 }}>
            The future of farming
            <br />
            <em style={{ color: "#7AB85A" }}>starts today</em>
          </h2>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: "15px 36px" }}>
              Create Free Account →
            </Link>
            <Link href="/login" className="btn-ghost" style={{ fontSize: 15, padding: "14px 36px" }}>
              Sign In
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="sec-pad">
        <div className="cs-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "#7AB85A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
              Testimonials
            </div>
            <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(30px,4vw,52px)", color: "#F0EDE4", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Trusted by farmers
              <br />
              <em style={{ color: "#7AB85A" }}>across East Africa</em>
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="test-grid"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeInUp} className="testimonial-card" whileHover={{ y: -6 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "#E8B84B", fontSize: 14 }}>
                      ★
                    </span>
                  ))}
                </div>
                <p style={{ fontFamily: "DM Sans", fontSize: 15, color: "#C8C4BB", lineHeight: 1.75, fontWeight: 300, marginBottom: 28, fontStyle: "italic" }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg,${t.color},${t.color}aa)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "DM Sans",
                      fontWeight: 600,
                      fontSize: 13,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 14, fontWeight: 500, color: "#F0EDE4" }}>{t.name}</div>
                    <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "#666" }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="sec-pad">
        <div className="cs-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "#7AB85A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
              Get In Touch
            </div>
            <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(30px,4vw,52px)", color: "#F0EDE4", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Ready to transform your
              <br />
              <em style={{ color: "#7AB85A" }}>farming operations?</em>
            </h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "clamp(15px,1.8vw,17px)", color: "#9A968E", lineHeight: 1.7, fontWeight: 300, maxWidth: 600, margin: "0 auto" }}>
              Our team is available 24/7 to help you get started. Whether you're a small-scale farmer or managing large agricultural operations, 
              we're here to provide personalized guidance and answer all your questions about implementing SmartSeason monitoring solutions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}
          >
            <a
              href="https://wa.me/254748333763"
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: "28px 32px",
                borderRadius: 16,
                border: "1px solid rgba(240,237,228,0.07)",
                background: "rgba(255,255,255,0.02)",
                textDecoration: "none",
                transition: "all 0.3s",
                minWidth: "280px",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(78,139,58,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(240,237,228,0.07)";
              }}
            >
              <div style={{ fontSize: 32, flexShrink: 0 }}>📱</div>
              <div>
                <div style={{ fontFamily: "DM Sans", fontSize: 16, fontWeight: 500, color: "#F0EDE4", marginBottom: 4 }}>
                  WhatsApp
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 14, color: "#9A968E", marginBottom: 8 }}>
                  +254 748 333 763
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 13, color: "#7AB85A", fontWeight: 400, lineHeight: 1.4 }}>
                  <strong>Best for:</strong> Quick questions, immediate support, demo requests
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "#666", marginTop: 4, lineHeight: 1.3 }}>
                  Mention your farm size and specific needs for faster assistance
                </div>
              </div>
            </a>
            
            <a
              href="mailto:chrisbenevansleo@gmail.com"
              className="card-hover"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: "28px 32px",
                borderRadius: 16,
                border: "1px solid rgba(240,237,228,0.07)",
                background: "rgba(255,255,255,0.02)",
                textDecoration: "none",
                transition: "all 0.3s",
                minWidth: "280px",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(78,139,58,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(240,237,228,0.07)";
              }}
            >
              <div style={{ fontSize: 32, flexShrink: 0 }}>✉️</div>
              <div>
                <div style={{ fontFamily: "DM Sans", fontSize: 16, fontWeight: 500, color: "#F0EDE4", marginBottom: 4 }}>
                  Email
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 14, color: "#9A968E", marginBottom: 8 }}>
                  chrisbenevansleo@gmail.com
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 13, color: "#7AB85A", fontWeight: 400, lineHeight: 1.4 }}>
                  <strong>Best for:</strong> Detailed inquiries, proposals, documentation
                </div>
                <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "#666", marginTop: 4, lineHeight: 1.3 }}>
                  Include farm details, crop types, and expected timeline for response
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "72px 5% 40px", borderTop: "1px solid rgba(240,237,228,0.06)" }}>
        <div className="cs-container">
          <div className="footer-top">
            <div style={{ maxWidth: 320 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(135deg,#4E8B3A,#7AB85A)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  🌿
                </div>
                <span style={{ fontFamily: "Instrument Serif", fontSize: 20, color: "#F0EDE4" }}>CropSync</span>
              </div>
              <p style={{ fontFamily: "DM Sans", fontSize: 14, color: "#666", lineHeight: 1.65, fontWeight: 300, marginBottom: 20 }}>
                Modern farm intelligence for next generation of African agriculture. Empowering farmers with data-driven insights for sustainable growth.
              </p>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <a
                  href="https://wa.me/254748333763"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(78,139,58,0.1)",
                    border: "1px solid rgba(78,139,58,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(78,139,58,0.2)";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(78,139,58,0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  📱
                </a>
                <a
                  href="mailto:chrisbenevansleo@gmail.com"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(78,139,58,0.1)",
                    border: "1px solid rgba(78,139,58,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(78,139,58,0.2)";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(78,139,58,0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  ✉️
                </a>
              </div>
              <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "#7AB85A", fontWeight: 500 }}>
                🌱 Serving farmers across East Africa
              </div>
            </div>
            
            <div className="footer-links" style={{ display: "flex", gap: 60 }}>
              <div>
                <div style={{ fontFamily: "DM Sans", fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>
                  Services
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", marginBottom: 8 }}>
                    🛰️ Satellite Monitoring
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", marginBottom: 8 }}>
                    🌦️ Weather Analytics
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", marginBottom: 8 }}>
                    📊 Yield Prediction
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888" }}>
                    👥 Field Management
                  </div>
                </div>
              </div>
              
              <div>
                <div style={{ fontFamily: "DM Sans", fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>
                  Contact
                </div>
                <div style={{ marginBottom: 12 }}>
                  <a
                    href="https://wa.me/254748333763"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span>📱</span> +254 748 333 763
                  </a>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <a
                    href="mailto:chrisbenevansleo@gmail.com"
                    style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span>✉️</span> chrisbenevansleo@gmail.com
                  </a>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>📍</span> Nairobi, Kenya
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>🕐</span> Mon-Sat: 6AM-6PM
                  </div>
                </div>
              </div>
              
              <div>
                <div style={{ fontFamily: "DM Sans", fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>
                  Company
                </div>
                <div style={{ marginBottom: 12 }}>
                  <a href="#features" style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", textDecoration: "none" }}>
                    Features
                  </a>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <a href="#how-it-works" style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", textDecoration: "none" }}>
                    How It Works
                  </a>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <a href="#testimonials" style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", textDecoration: "none" }}>
                    Testimonials
                  </a>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <a href="#contact" style={{ fontFamily: "DM Sans", fontSize: 14, color: "#888", textDecoration: "none" }}>
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            className="footer-bottom"
            style={{
              borderTop: "1px solid rgba(240,237,228,0.06)",
              paddingTop: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span style={{ fontFamily: "DM Sans", fontSize: 13, color: "#555" }}>© {new Date().getFullYear()} CropSync. All rights reserved.</span>
            <div style={{ fontFamily: "DM Sans", fontSize: 13, color: "#555" }}>
              Made by{" "}
              <a
                href="https://leochrisbenevans.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#7AB85A", textDecoration: "none", fontWeight: 500 }}
              >
                Leo Chrisben Evans
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;