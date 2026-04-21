"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(1);
  const [currentSolution, setCurrentSolution] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroBgY = useTransform(scrollYProgress, [0, 0.4], ["0%", "15%"]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: "🌱",
      title: "Power Farm Productivity",
      body: "Leverage satellite imagery, soil sensors, and AI recommendations to maximise every acre you manage.",
    },
    {
      icon: "🧠",
      title: "Intelligent Crop Optimisation",
      body: "Our intelligent agriculture solutions help farmers grow more with less by optimising resources, improving crop health, and supporting long-term sustainability across every season.",
    },
    {
      icon: "🔗",
      title: "Seamless Farm System Integration",
      body: "Connect your existing farm management tools, irrigation systems, and IoT devices in one unified platform with zero friction.",
    },
    {
      icon: "💧",
      title: "Smart Water & Resource Management",
      body: "Cut water usage by up to 40% with precision irrigation schedules driven by real-time evapotranspiration data.",
    },
  ];

  const tabs = [
    { label: "Overview", sub: "Real-Time Insight" },
    { label: "Smart Planning", sub: "Precision Farming" },
    { label: "Farm Control", sub: "Full Command" },
    { label: "Field Monitor", sub: "Ground Truth" },
  ];

  const solutions = [
    {
      title: "Precision Crop Management",
      desc: "Track crops, soil, and weather to make better decisions and higher yields.",
      img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&q=80",
    },
    {
      title: "Smart Farm Automation",
      desc: "Automate irrigation and operations to save time, cut costs, and boost efficiency.",
      img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80",
    },
    {
      title: "Sustainable Agriculture",
      desc: "Protect the future — conserve resources, and plan for long term success.",
      img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80",
    },
  ];

  const testimonials = [
    {
      quote: "The platform was easy to implement and delivered value fast. Within the first month, we improved irrigation planning and reduced input costs significantly.",
      name: "Michael Thompson",
      role: "Farm Manager",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    },
    {
      quote: "Real-time field data completely changed how we manage our crops. We're making smarter decisions and seeing healthier yields season after season.",
      name: "Sarah Williams",
      role: "Precision Agronomist",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
    },
  ];

  const faqs = [
    {
      q: "Does CropSync support sustainable farming?",
      a: "Absolutely! CropSync is designed with sustainability at its core. Our platform helps you optimize water usage, reduce chemical inputs, and implement precision farming techniques that minimize environmental impact while maximizing yields.",
    },
    {
      q: "Can I monitor multiple fields at once?",
      a: "Yes — CropSync allows you to manage and track multiple fields from a single dashboard for unified control and visibility. You can switch between fields, compare performance, and get comprehensive insights across all your agricultural operations.",
    },
    {
      q: "How do I get started with CropSync?",
      a: "Getting started is simple! Sign up for a free account, complete your farm profile, and start adding your fields. Our onboarding process takes less than 15 minutes, and you'll receive personalized recommendations based on your specific farming needs and location.",
    },
    {
      q: "Is CropSync easy to use for non-technical farmers?",
      a: "Yes! CropSync is built with farmers in mind, not tech experts. Our intuitive interface, clear visualizations, and step-by-step guidance make it easy for anyone to use. We also provide video tutorials, 24/7 support, and on-site training if needed.",
    },
    {
      q: "Can CropSync help reduce farming costs?",
      a: "Definitely! Farmers using CropSync typically reduce costs by 20-30% through optimized irrigation, reduced fertilizer usage, better pest management, and improved resource allocation.",
    },
  ];

  const tabImages = [
    "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=1400&q=80",
    "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1400&q=80",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=80",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&q=80",
  ];

  const featureImages = [
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  };
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", backgroundColor: "#FAFAF8", color: "#1A1A18", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Nunito:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        :root {
          --green: #3D7A2A;
          --green-light: #5A9E40;
          --green-bg: #F0F7EC;
          --text: #1A1A18;
          --muted: #6B6B62;
          --border: #E8E5DC;
        }

        /* ── Base buttons ── */
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--green); color: #fff; border: none;
          border-radius: 8px; padding: 13px 24px; font-size: 14px;
          font-weight: 500; cursor: pointer; text-decoration: none;
          transition: all 0.2s; white-space: nowrap; font-family: 'Nunito', sans-serif;
        }
        .btn-primary:hover { background: var(--green-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(61,122,42,0.3); }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: var(--text);
          border: 1px solid var(--border); border-radius: 8px;
          padding: 12px 24px; font-size: 14px; font-weight: 400;
          cursor: pointer; text-decoration: none; transition: all 0.2s;
          white-space: nowrap; font-family: 'Nunito', sans-serif;
        }
        .btn-outline:hover { border-color: #999; }

        .btn-ghost-hero {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15); color: #fff;
          border: 1px solid rgba(255,255,255,0.35); border-radius: 8px;
          padding: 12px 24px; font-size: 14px; font-weight: 400;
          cursor: pointer; text-decoration: none; transition: all 0.2s;
          backdrop-filter: blur(8px); white-space: nowrap;
          font-family: 'Nunito', sans-serif;
        }
        .btn-ghost-hero:hover { background: rgba(255,255,255,0.25); }

        .nav-cta {
          font-size: 13px; font-weight: 500; background: var(--green);
          color: #fff; border: none; border-radius: 8px; padding: 9px 18px;
          cursor: pointer; text-decoration: none; transition: background 0.2s;
          display: inline-flex; align-items: center; font-family: 'Nunito', sans-serif;
        }
        .nav-cta:hover { background: var(--green-light); }

        /* ── Nav link ── */
        .nav-link { font-size: 14px; font-weight: 400; color: var(--muted); text-decoration: none; transition: color 0.2s; white-space: nowrap; }
        .nav-link:hover { color: var(--text); }
        .nav-link-hero { color: rgba(255,255,255,0.82); }
        .nav-link-hero:hover { color: #fff; }

        /* ── Hamburger ── */
        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; flex-shrink: 0; }
        .hline { display: block; width: 22px; height: 1.5px; }

        /* ── Feature accordion ── */
        .feat-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 18px; border-radius: 12px; cursor: pointer;
          transition: all 0.2s; border: 1px solid transparent; gap: 12px;
        }
        .feat-row:hover { background: #F5F3EE; }
        .feat-row.open { background: #fff; border-color: var(--border); box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

        /* ── Dashboard tab ── */
        .dash-tab {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 11px 16px; border-radius: 10px; cursor: pointer;
          transition: all 0.2s; border: 1px solid transparent;
          flex: 1; min-width: 0; background: none;
        }
        .dash-tab:hover { background: #F5F3EE; }
        .dash-tab.active { background: #fff; border-color: var(--border); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

        /* ── Solution card ── */
        .sol-card { border-radius: 16px; overflow: hidden; background: #fff; border: 1px solid var(--border); transition: all 0.3s; }
        .sol-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }

        /* ── Testimonial card ── */
        .testi-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; transition: all 0.3s; }
        .testi-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-3px); }

        /* ── FAQ ── */
        .faq-row { border-bottom: 1px solid var(--border); }
        .faq-q {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 0; cursor: pointer; transition: color 0.2s; gap: 16px;
        }
        .faq-q:hover { color: var(--green); }

        /* ── Pulse animation for hero dot ── */
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }

        /* ── Section spacing ── */
        .cs-section { padding: 88px 5%; }
        .container { max-width: 1140px; margin: 0 auto; }

        /* ═══════════ RESPONSIVE BREAKPOINTS ═══════════ */

        /* 1024px — hide desktop nav, show hamburger */
        @media (max-width: 1024px) {
          .desktop-nav-links { display: none !important; }
          .desktop-nav-cta  { display: none !important; }
          .hamburger         { display: flex !important; }
        }

        /* 900px — features accordion stacks, features image sits below text */
        @media (max-width: 900px) {
          .feat-layout { flex-direction: column !important; gap: 32px !important; }
          .feat-img-wrap { width: 100% !important; min-width: 0 !important; height: 280px !important; }
          .testi-grid { grid-template-columns: 1fr !important; }
        }

        /* 768px — general tablet/phone */
        @media (max-width: 768px) {
          .cs-section { padding: 60px 20px !important; }
          .hero-cta-row { flex-direction: column !important; align-items: flex-start !important; }
          .hero-cta-row > * { width: 100% !important; justify-content: center !important; max-width: 340px !important; }
          .stats-grid  { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
          .sol-grid    { display: none !important; }
          .mob-carousel { display: block !important; }
          .tabs-desktop { display: none !important; }
          .tabs-mobile-select { display: block !important; }
          .hero-proof  { display: none !important; }
          .brand-strip > *:nth-child(n+5) { display: none !important; }
          .footer-top  { flex-direction: column !important; gap: 40px !important; }
          .footer-links-row { flex-wrap: wrap !important; gap: 32px !important; }
          .footer-bottom { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .contact-row { flex-direction: column !important; align-items: stretch !important; }
          .contact-card { min-width: 0 !important; max-width: 100% !important; }
          .weather-card { display: none !important; }
          .mission-text { font-size: clamp(18px, 5vw, 28px) !important; }
          .hero-title { font-size: clamp(32px, 8vw, 52px) !important; }
        }

        /* 480px — small phones */
        @media (max-width: 480px) {
          .cs-section { padding: 48px 16px !important; }
          .stats-grid  { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .feat-row    { padding: 14px 14px !important; }
          .testi-card  { padding: 20px !important; }
          .faq-q       { padding: 16px 0 !important; }
          .hero-title  { font-size: clamp(28px, 9vw, 46px) !important; }
          .sol-mob-card { max-width: 100% !important; }
          .brand-strip > *:nth-child(n+4) { display: none !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          MOBILE MENU (slide in from right)
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            style={{
              position: "fixed", inset: 0, zIndex: 300,
              background: "#fff", display: "flex", flexDirection: "column",
              padding: "80px 28px 40px", overflowY: "auto",
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{ position: "absolute", top: 18, right: 18, background: "none", border: "none", fontSize: 26, cursor: "pointer", color: "var(--text)" }}
            >✕</button>

            {["Why Us", "Services", "How It Works", "Testimonials", "Contact Us"].map((l, i) => (
              <motion.a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "Instrument Serif, serif", fontSize: 26,
                  color: "var(--text)", textDecoration: "none",
                  padding: "14px 0", borderBottom: "1px solid var(--border)", display: "block",
                }}
              >{l}</motion.a>
            ))}

            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/login"    className="btn-outline"  style={{ justifyContent: "center" }} onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link href="/register" className="btn-primary"  style={{ justifyContent: "center" }} onClick={() => setMenuOpen(false)}>Get Started →</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          NAV
      ═══════════════════════════════════════ */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          transition: "all 0.3s",
        }}
      >
        <div style={{
          maxWidth: 1140, margin: "0 auto", padding: "0 5%",
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#3D7A2A,#5A9E40)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🌿</div>
            <span style={{ fontFamily: "Instrument Serif, serif", fontSize: 18, color: scrolled ? "var(--text)" : "#fff" }}>Crop Sync</span>
          </div>

          {/* Desktop links */}
          <nav className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {["Why Us", "Services", "How It Works", "Testimonials", "Contact Us"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                className={`nav-link ${!scrolled ? "nav-link-hero" : ""}`}>{l}</a>
            ))}
          </nav>

          <div className="desktop-nav-cta" style={{ display: "flex", flexShrink: 0 }}>
            <Link href="/register" className="nav-cta">Contact Us</Link>
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            <span className="hline" style={{ background: scrolled ? "var(--text)" : "#fff" }} />
            <span className="hline" style={{ background: scrolled ? "var(--text)" : "#fff" }} />
            <span className="hline" style={{ background: scrolled ? "var(--text)" : "#fff" }} />
          </button>
        </div>
      </motion.header>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
        {/* Parallax BG */}
        <motion.div style={{ position: "absolute", inset: "-10%", y: heroBgY }}>
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80"
            alt="Farm"
            style={{ width: "100%", height: "110%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(6,18,6,0.6) 0%,rgba(6,18,6,0.72) 60%,rgba(6,18,6,0.88) 100%)" }} />
        </motion.div>

        {/* Crop overlay right — hidden on mobile */}
        <div style={{ position: "absolute", right: 0, bottom: 0, width: "36%", height: "100%", pointerEvents: "none", overflow: "hidden" }}
          className="hero-proof">
          <img src="https://images.unsplash.com/photo-1566754436393-73b9df8ab406?w=800&q=80" alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", opacity: 0.45,
              maskImage: "linear-gradient(to left,rgba(0,0,0,0.6) 0%,transparent 88%)",
              WebkitMaskImage: "linear-gradient(to left,rgba(0,0,0,0.5) 0%,transparent 85%)" }} />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1, padding: "140px 5% 100px" }}>
          <div style={{ maxWidth: 660 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(61,122,42,0.28)", border: "1px solid rgba(90,158,64,0.45)",
                borderRadius: 100, padding: "6px 16px", marginBottom: 26,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6BD44E", flexShrink: 0, animation: "pulse-dot 2s infinite" }} />
              <span style={{ fontFamily: "Nunito", fontSize: 12, color: "#A8E090", letterSpacing: "0.04em" }}>Smart Farming Platform</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(36px,6vw,70px)", lineHeight: 1.06, letterSpacing: "-0.025em", color: "#fff", marginBottom: 18 }}
            >
              Smart Farming for<br />
              Future <em style={{ color: "#6BD44E", fontStyle: "italic" }}>Generations</em>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              style={{ fontFamily: "Nunito", fontSize: "clamp(14px,2vw,16px)", lineHeight: 1.72, color: "rgba(255,255,255,0.72)", maxWidth: 500, marginBottom: 36, fontWeight: 300 }}
            >
              Ready to transform your farm? Our intelligent agriculture platform equips East African farmers and agribusinesses with practical tools for smarter, more sustainable operations.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="hero-cta-row"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.36 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}
            >
              <Link href="/register" className="btn-primary"    style={{ padding: "13px 26px" }}>Start Investing →</Link>
              <Link href="/login"    className="btn-ghost-hero"  style={{ padding: "12px 26px" }}>Know More →</Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.52 }}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div style={{ display: "flex" }}>
                {["🧑‍🌾","👩‍🌾","🧑‍💼"].map((e,i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "2px solid rgba(255,255,255,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, marginLeft: i > 0 ? -10 : 0 }}>{e}</div>
                ))}
              </div>
              <span style={{ fontFamily: "Nunito", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                <strong style={{ color: "#fff" }}>4.8</strong> ·{" "}
                <strong style={{ color: "#fff" }}>12K+</strong> Farmers
              </span>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: 0.55 }}
        >
          <span style={{ fontFamily: "Nunito", fontSize: 10, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom,rgba(255,255,255,0.8),transparent)" }} />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          BRAND LOGOS
      ═══════════════════════════════════════ */}
      <section style={{ padding: "32px 5%", borderBottom: "1px solid var(--border)", background: "#fff" }}>
        <div className="container">
          <div className="brand-strip" style={{ display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap" }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontFamily: "Nunito", fontSize: 11, color: "#aaa", fontStyle: "italic", lineHeight: 1.4 }}>Trusted by Research<br />comparable in the world.</div>
            </div>
            {["CHASE", "JOHN DEERE", "Leader", "Kubota", "GLEANER"].map(b => (
              <div key={b} style={{ fontFamily: "Nunito", fontSize: "clamp(12px,1.6vw,15px)", fontWeight: 600, color: "#9B9B8F", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MISSION STATEMENT
      ═══════════════════════════════════════ */}
      <section className="cs-section">
        <div className="container">
          <motion.p
            className="mission-text"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            style={{ fontFamily: "Nunito", fontSize: "clamp(18px,3vw,36px)", lineHeight: 1.5, fontWeight: 400, color: "var(--text)", maxWidth: 880 }}
          >
            Our platform is built to support farmers, agribusinesses, and agricultural innovators by delivering{" "}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--green-bg)", border: "1px solid rgba(61,122,42,0.18)", borderRadius: 8, padding: "2px 12px 2px 8px", verticalAlign: "middle", margin: "0 4px" }}>
              <span>🌱</span>
              <span style={{ color: "var(--green)", fontWeight: 500, fontSize: "0.88em" }}>practical tools</span>
            </span>{" "}
            that respect the land while improving productivity.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES ACCORDION
      ═══════════════════════════════════════ */}
      <section id="services" className="cs-section" style={{ background: "#F7F5F0", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 11, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Farm Agro Services</div>

            <div className="feat-layout" style={{ display: "flex", gap: 64, alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Left: text + accordion */}
              <div style={{ flex: "1 1 300px", minWidth: 0, maxWidth: 480 }}>
                <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(24px,3vw,40px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 4 }}>
                  Smart Farming Solutions
                </h2>
                <p style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "clamp(18px,2.5vw,30px)", color: "var(--green)", lineHeight: 1.2, marginBottom: 36 }}>
                  That Deliver Real Results
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {features.map((f, i) => (
                    <div key={i}>
                      <div className={`feat-row ${activeFeature === i ? "open" : ""}`} onClick={() => setActiveFeature(activeFeature === i ? -1 : i)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                          <span style={{ fontSize: 17, flexShrink: 0 }}>{f.icon}</span>
                          <span style={{ fontFamily: "Nunito", fontSize: "clamp(13px,1.5vw,15px)", fontWeight: 500, color: activeFeature === i ? "var(--green)" : "var(--text)", overflow: "hidden", textOverflow: "ellipsis" }}>{f.title}</span>
                        </div>
                        <motion.span animate={{ rotate: activeFeature === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                          style={{ fontSize: 20, color: activeFeature === i ? "var(--green)" : "#999", flexShrink: 0, lineHeight: 1 }}>+</motion.span>
                      </div>
                      <AnimatePresence>
                        {activeFeature === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                            <p style={{ padding: "4px 18px 16px 44px", fontFamily: "Nunito", fontSize: "clamp(13px,1.5vw,14px)", color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>{f.body}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: image */}
              <div className="feat-img-wrap" style={{ flex: "1 1 280px", minWidth: 0, borderRadius: 18, overflow: "hidden", height: "clamp(260px,35vw,440px)", position: "relative", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeFeature}
                    src={featureImages[activeFeature >= 0 ? activeFeature : 1]}
                    alt=""
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                  />
                </AnimatePresence>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 55%,rgba(6,18,6,0.45) 100%)" }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SMART FARMING TABS + BIG IMAGE
      ═══════════════════════════════════════ */}
      <section id="how-it-works" className="cs-section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 11, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Smart Farming</div>

            {/* Header row */}
            <div style={{ display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 28 }}>
              <div style={{ flex: "0 0 auto" }}>
                <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(22px,3vw,40px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text)" }}>Smart Farming Made</h2>
                <p style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "clamp(18px,2.5vw,32px)", color: "var(--green)" }}>Simple and Efficient</p>
              </div>
              <p style={{ fontFamily: "Nunito", fontSize: "clamp(13px,1.5vw,15px)", color: "var(--muted)", lineHeight: 1.7, fontWeight: 300, maxWidth: 400, flex: 1, minWidth: 0, paddingTop: 6 }}>
                A smart farming platform that connects crops, data, and operations to help farmers grow more sustainably and confidently.
              </p>
            </div>

            {/* Desktop tabs */}
            <div className="tabs-desktop" style={{ display: "flex", gap: 6, background: "#F0EEE8", borderRadius: 13, padding: 5, marginBottom: 20 }}>
              {tabs.map((t, i) => (
                <button key={i} className={`dash-tab ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>
                  <span style={{ fontFamily: "Nunito", fontSize: 13, fontWeight: 500, color: activeTab === i ? "var(--text)" : "var(--muted)", whiteSpace: "nowrap" }}>{t.label}</span>
                  <span style={{ fontFamily: "Nunito", fontSize: 11, color: activeTab === i ? "var(--green)" : "#bbb", whiteSpace: "nowrap" }}>{t.sub}</span>
                </button>
              ))}
            </div>

            {/* Mobile select */}
            <div className="tabs-mobile-select" style={{ display: "none", marginBottom: 20 }}>
              <select
                value={activeTab}
                onChange={e => setActiveTab(Number(e.target.value))}
                style={{ width: "100%", padding: "12px 16px", background: "#fff", border: "1px solid var(--border)", borderRadius: 10, fontFamily: "Nunito", fontSize: 14, fontWeight: 500, color: "var(--text)", appearance: "none", WebkitAppearance: "none" }}
              >
                {tabs.map((t, i) => <option key={i} value={i}>{t.label} — {t.sub}</option>)}
              </select>
            </div>

            {/* Big image */}
            <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", height: "clamp(240px,42vw,540px)" }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeTab}
                  src={tabImages[activeTab]}
                  alt=""
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                />
              </AnimatePresence>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 45%,rgba(0,0,0,0.38) 100%)" }} />

              {/* Floating weather card — hidden on small screens via .weather-card */}
              <div className="weather-card" style={{ position: "absolute", bottom: 24, right: 24, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)", borderRadius: 14, padding: "16px 20px", boxShadow: "0 8px 28px rgba(0,0,0,0.14)", minWidth: 196, border: "1px solid rgba(255,255,255,0.8)" }}>
                <div style={{ fontFamily: "Nunito", fontSize: 10, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current Weather</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 28 }}>☀️</span>
                  <span style={{ fontFamily: "Instrument Serif, serif", fontSize: 32, color: "var(--text)", lineHeight: 1 }}>24°C</span>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  {[{l:"Rain",v:"0%"},{l:"Humidity",v:"58%"},{l:"Wind",v:"12km"}].map(d => (
                    <div key={d.l}>
                      <div style={{ fontFamily: "Nunito", fontSize: 10, color: "#bbb" }}>{d.l}</div>
                      <div style={{ fontFamily: "Nunito", fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{d.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, padding: "7px 10px", background: "var(--green-bg)", borderRadius: 7, fontFamily: "Nunito", fontSize: 11, color: "var(--green)", fontWeight: 500 }}>🌾 Good conditions for harvest</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS
      ═══════════════════════════════════════ */}
      <section style={{ padding: "56px 5%", background: "#fff", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32, textAlign: "center" }}>
            {[
              {v:"1.5M+",l:"Acres Monitored"},
              {v:"500K+",l:"Farmers Empowered"},
              {v:"2M+",  l:"Farm Decisions Optimised"},
              {v:"750K+",l:"Successful Harvests"},
            ].map(s => (
              <motion.div key={s.l} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(28px,4vw,50px)", color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 7 }}>{s.v}</div>
                <div style={{ fontFamily: "Nunito", fontSize: "clamp(12px,1.5vw,14px)", color: "var(--muted)", fontWeight: 300 }}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SOLUTIONS (desktop 3-col grid + mobile carousel)
      ═══════════════════════════════════════ */}
      <section id="why-us" className="cs-section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 11, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Smart Solutions</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(22px,3vw,40px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text)" }}>Smart Solutions for</h2>
                <p style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "clamp(20px,2.8vw,36px)", color: "var(--green)" }}>Modern Farming</p>
              </div>
              <p style={{ fontFamily: "Nunito", fontSize: "clamp(13px,1.5vw,15px)", color: "var(--muted)", lineHeight: 1.7, maxWidth: 340, fontWeight: 300 }}>
                We empower farmers with intelligent tools and data-driven insights to increase yields, reduce costs, and build a more sustainable future.
              </p>
            </div>
          </motion.div>

          {/* Desktop grid */}
          <motion.div className="sol-grid" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {solutions.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="sol-card">
                <div style={{ height: 230, overflow: "hidden", position: "relative" }}>
                  <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.3) 100%)" }} />
                </div>
                <div style={{ padding: "20px 22px 26px" }}>
                  <h3 style={{ fontFamily: "Instrument Serif, serif", fontSize: 19, color: "var(--text)", marginBottom: 9, letterSpacing: "-0.01em" }}>{s.title}</h3>
                  <p style={{ fontFamily: "Nunito", fontSize: 14, color: "var(--muted)", lineHeight: 1.65, fontWeight: 300, marginBottom: 16 }}>{s.desc}</p>
                  <a href="#" style={{ fontFamily: "Nunito", fontSize: 13, color: "var(--green)", fontWeight: 500, textDecoration: "none" }}>Learn more →</a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile carousel */}
          <div className="mob-carousel" style={{ display: "none" }}>
            <div style={{ position: "relative", padding: "0 32px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSolution}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="sol-card sol-mob-card"
                  style={{ maxWidth: 360, margin: "0 auto" }}
                >
                  <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                    <img src={solutions[currentSolution].img} alt={solutions[currentSolution].title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.3) 100%)" }} />
                  </div>
                  <div style={{ padding: "18px 20px 22px" }}>
                    <h3 style={{ fontFamily: "Instrument Serif, serif", fontSize: 18, color: "var(--text)", marginBottom: 8 }}>{solutions[currentSolution].title}</h3>
                    <p style={{ fontFamily: "Nunito", fontSize: 13, color: "var(--muted)", lineHeight: 1.6, fontWeight: 300, marginBottom: 14 }}>{solutions[currentSolution].desc}</p>
                    <a href="#" style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--green)", fontWeight: 500, textDecoration: "none" }}>Learn more →</a>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Prev */}
              <button
                onClick={() => setCurrentSolution(p => (p === 0 ? solutions.length - 1 : p - 1))}
                style={{ position: "absolute", left: 0, top: "40%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "var(--green)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(61,122,42,0.3)" }}
              ><ArrowLeft size={16} /></button>

              {/* Next */}
              <button
                onClick={() => setCurrentSolution(p => (p === solutions.length - 1 ? 0 : p + 1))}
                style={{ position: "absolute", right: 0, top: "40%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "var(--green)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(61,122,42,0.3)" }}
              ><ArrowRight size={16} /></button>

              {/* Dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 18 }}>
                {solutions.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSolution(i)}
                    style={{ width: i === currentSolution ? 22 : 7, height: 7, borderRadius: 4, background: i === currentSolution ? "var(--green)" : "rgba(61,122,42,0.28)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════ */}
      <section id="testimonials" className="cs-section" style={{ background: "#F7F5F0", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 11, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Testimonials</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(22px,3vw,40px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text)" }}>Real Stories Shared</h2>
                <p style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", fontSize: "clamp(20px,2.8vw,34px)", color: "var(--green)" }}>by Our Farmers</p>
              </div>
              <p style={{ fontFamily: "Nunito", fontSize: "clamp(13px,1.5vw,15px)", color: "var(--muted)", lineHeight: 1.7, maxWidth: 340, fontWeight: 300 }}>
                Hear directly from farmers who use our solution every day and are transforming how they farm.
              </p>
            </div>
          </motion.div>

          {/* 2-col grid — stacks at 900px via media query */}
          <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, alignItems: "start" }}>
            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="testi-card">
                  <div style={{ fontFamily: "Instrument Serif, serif", fontSize: 38, color: "var(--green)", opacity: 0.35, lineHeight: 1, marginBottom: 14 }}>"</div>
                  <p style={{ fontFamily: "Nunito", fontSize: "clamp(13px,1.5vw,15px)", color: "var(--text)", lineHeight: 1.75, fontWeight: 300, marginBottom: 22, fontStyle: "italic" }}>{t.quote}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={t.img} alt={t.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                      <div style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--muted)" }}>{t.role}</div>
                    </div>
                    <a href="#" style={{ marginLeft: "auto", fontFamily: "Nunito", fontSize: 12, color: "var(--green)", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>Read More →</a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Big photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: "clamp(300px,50vw,580px)" }}
            >
              <img
                src="/jamie-street-V6FcCG14q30-unsplash.jpg"
                alt="Farmer"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 48%,rgba(0,0,0,0.5) 100%)" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(14px)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🌾</div>
                  <div>
                    <div style={{ fontFamily: "Nunito", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Harvest Optimised</div>
                    <div style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--muted)" }}>Yield increased by 42% this season</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ
      ═══════════════════════════════════════ */}
      <section id="faq" className="cs-section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: 740 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 11, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>FAQ</div>
            <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(24px,3.5vw,46px)", lineHeight: 1.12, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>
              Common Farmer{" "}
              <em style={{ color: "var(--green)", fontStyle: "italic" }}>Questions</em>
            </h2>
            <p style={{ fontFamily: "Nunito", fontSize: "clamp(13px,1.5vw,15px)", color: "var(--muted)", fontWeight: 300, lineHeight: 1.65 }}>
              Got questions? We've got answers to help you get the most out of Crop Sync.
            </p>
          </motion.div>

          <div>
            {faqs.map((f, i) => (
              <motion.div key={i} className="faq-row"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span style={{ fontFamily: "Nunito", fontSize: "clamp(13px,1.5vw,15px)", fontWeight: 500, color: "var(--text)", flex: 1, paddingRight: 16 }}>{f.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0, background: openFaq === i ? "var(--green)" : "#EEEAE0" }}
                    transition={{ duration: 0.2 }}
                    style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0, color: openFaq === i ? "#fff" : "var(--muted)" }}
                  >+</motion.div>
                </div>
                <AnimatePresence>
                  {openFaq === i && f.a && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                      <p style={{ fontFamily: "Nunito", fontSize: "clamp(13px,1.5vw,14px)", color: "var(--muted)", lineHeight: 1.75, fontWeight: 300, paddingBottom: 18 }}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Link href="/register" className="btn-primary" style={{ padding: "14px 34px" }}>Start your journey →</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════ */}
      <section className="cs-section" style={{ background: "#F7F5F0", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 680 }}>
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(26px,4vw,50px)", lineHeight: 1.1, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 14 }}>
              Make farming smarter,<br />
              <em style={{ color: "var(--green)", fontStyle: "italic" }}>stronger, and simpler</em>
            </h2>
            <p style={{ fontFamily: "Nunito", fontSize: "clamp(14px,1.8vw,16px)", color: "var(--muted)", lineHeight: 1.7, fontWeight: 300, maxWidth: 440, margin: "0 auto 32px" }}>
              Deploy smart tools to help you make confident decisions for your farm.
            </p>
            <Link href="/register" className="btn-primary" style={{ padding: "14px 34px" }}>Get started today →</Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════ */}
      <section id="contact-us" className="cs-section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 11, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Get In Touch</div>
            <h2 style={{ fontFamily: "Instrument Serif, serif", fontSize: "clamp(22px,3.5vw,44px)", lineHeight: 1.12, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 12 }}>
              Ready to transform your<br /><em style={{ color: "var(--green)", fontStyle: "italic" }}>farming operations?</em>
            </h2>
            <p style={{ fontFamily: "Nunito", fontSize: "clamp(13px,1.5vw,15px)", color: "var(--muted)", fontWeight: 300, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Our team is available 24/7 to help you get started, whether you're a small-scale farmer or managing large operations.
            </p>
          </motion.div>

          <div className="contact-row" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "📱", title: "WhatsApp", detail: "+254 748 333 763", best: "Quick questions, immediate support, demo requests", link: "https://wa.me/254748333763" },
              { icon: "✉️", title: "Email", detail: "support@cropsync.com", best: "Detailed inquiries, proposals, documentation", link: "mailto:support@cropsync.com" },
              { icon: "📞", title: "Phone", detail: "+254 748 333 763", best: "Urgent issues, technical support, partnership discussions", link: "tel:+254748333763" },
            ].map(c => (
              <motion.a
                key={c.title}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.42 }}
                style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "24px 28px", borderRadius: 14, border: "1px solid var(--border)", background: "#fff", textDecoration: "none", transition: "all 0.3s", minWidth: 260, maxWidth: 360, flex: 1 }}
                whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(0,0,0,0.07)", borderColor: "rgba(61,122,42,0.28)" }}
              >
                <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{c.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "Nunito", fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>{c.title}</div>
                  <div style={{ fontFamily: "Nunito", fontSize: 13, color: "var(--muted)", marginBottom: 8, wordBreak: "break-all" }}>{c.detail}</div>
                  <div style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--green)", lineHeight: 1.5 }}>
                    <strong>Best for:</strong> {c.best}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer style={{ background: "#0D150A", color: "#B8B5AD", padding: "68px 5% 36px" }}>
        <div className="container">
          <div className="footer-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 56, gap: 40 }}>
            {/* Brand */}
            <div style={{ maxWidth: 270, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#3D7A2A,#5A9E40)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🌱</div>
                <span style={{ fontFamily: "Instrument Serif, serif", fontSize: 18, color: "#fff" }}>Crop Sync</span>
              </div>
              <p style={{ fontFamily: "Nunito", fontSize: 14, color: "#888", lineHeight: 1.65, fontWeight: 300, marginBottom: 18 }}>
                Modern farm intelligence for the next generation of African agriculture. Empowering farmers with data-driven insights.
              </p>
              
            </div>

            {/* Link columns */}
            <div className="footer-links-row" style={{ display: "flex", gap: 52 }}>
              {[
                { title: "Quick Links", links: [{ t:"Home",u:"/" },{ t:"About Us",u:"#about" },{ t:"Blog",u:"/blog" },{ t:"Careers",u:"/careers" },{ t:"Contact",u:"#contact-us" }] },
                { title: "Services",    links: [{ t:"Smart Crop Monitoring",u:"#how-it-works" },{ t:"Precision Weather",u:"#weather" },{ t:"Soil Analysis",u:"#solutions" },{ t:"Support",u:"#contact-us" }] },
                { title: "Company",     links: [{ t:"Customers",u:"#testimonials" },{ t:"Emergency Help",u:"tel:+254748333763" },{ t:"Privacy Policy",u:"/privacy" },{ t:"Terms",u:"/terms" }] },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ fontFamily: "Nunito", fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>{col.title}</div>
                  {col.links.map(l => (
                    <div key={l.t} style={{ marginBottom: 11 }}>
                      <a href={l.u} style={{ fontFamily: "Nunito", fontSize: 13, color: "#888", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#B8B5AD")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#888")}
                      >{l.t}</a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: "Nunito", fontSize: 12, color: "#555" }}>© {new Date().getFullYear()} Crop Sync. All rights reserved.</span>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["Terms of Services","Privacy Policy","Cookie Policy"].map(l => (
                <a key={l} href="#" style={{ fontFamily: "Nunito", fontSize: 12, color: "#555", textDecoration: "none" }}>{l}</a>
              ))}
            </div>
            <div style={{ fontFamily: "Nunito", fontSize: 12, color: "#555" }}>
              Made by{" "}
              <a href="https://leochrisbenevans.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#7AB85A", textDecoration: "none", fontWeight: 500 }}>
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