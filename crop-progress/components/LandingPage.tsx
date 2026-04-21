"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
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
  const heroBgY = useTransform(scrollYProgress, [0, 0.4], ["0%", "20%"]);

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
      quote:
        "The platform was easy to implement and delivered value fast. Within the first month, we improved irrigation planning and reduced input costs significantly.",
      name: "Michael Thompson",
      role: "Farm Manager",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    },
    {
      quote:
        "Real-time field data completely changed how we manage our crops. We're making smarter decisions and seeing healthier yields season after season.",
      name: "Sarah Williams",
      role: "Precision Agronomist",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
    },
  ];

  const faqs = [
    { 
      q: "Does CropSync support sustainable farming?", 
      a: "Absolutely! CropSync is designed with sustainability at its core. Our platform helps you optimize water usage, reduce chemical inputs, and implement precision farming techniques that minimize environmental impact while maximizing yields."
    },
    {
      q: "Can I monitor multiple fields at once?",
      a: "Yes - CropSync allows you to manage and track multiple fields from a single dashboard for unified control and visibility. You can switch between fields, compare performance, and get comprehensive insights across all your agricultural operations."
    },
    { 
      q: "How do I get started with CropSync?", 
      a: "Getting started is simple! Sign up for a free account, complete your farm profile, and start adding your fields. Our onboarding process takes less than 15 minutes, and you'll receive personalized recommendations based on your specific farming needs and location."
    },
    { 
      q: "Is CropSync easy to use for non-technical farmers?", 
      a: "Yes! CropSync is built with farmers in mind, not tech experts. Our intuitive interface, clear visualizations, and step-by-step guidance make it easy for anyone to use. We also provide video tutorials, 24/7 support, and on-site training if needed."
    },
    { 
      q: "Can CropSync help reduce farming costs?", 
      a: "Definitely! Farmers using CropSync typically reduce costs by 20-30% through optimized irrigation, reduced fertilizer usage, better pest management, and improved resource allocation. Our ROI calculator can show you potential savings based on your farm size and current practices."
    },
  ];

  const brands = [
    { name: "Trusted by Research", label: "comparable in the world." },
    { name: "CHASE", label: "" },
    { name: "JOHN DEERE", label: "" },
    { name: "Leader", label: "" },
    { name: "Kubota", label: "" },
    { name: "GLEANER", label: "" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", backgroundColor: "#FAFAF8", color: "#1A1A18", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Nunito:ital,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        :root {
          --green: #3D7A2A;
          --green-light: #5A9E40;
          --green-bg: #F0F7EC;
          --green-pill: #4A8C35;
          --text: #1A1A18;
          --muted: #6B6B62;
          --border: #E8E5DC;
          --card: #FFFFFF;
          --hero-bg: #0D2010;
        }

        /* Nav */
        .nav-link { font-size:14px; font-weight:400; color:var(--muted); text-decoration:none; transition:color 0.2s; }
        .nav-link:hover { color:var(--text); }
        .nav-cta { font-size:13px; font-weight:500; background:var(--green); color:#fff; border:none; border-radius:8px; padding:10px 20px; cursor:pointer; text-decoration:none; transition:background 0.2s; white-space:nowrap; display:inline-flex; align-items:center; }
        .nav-cta:hover { background:var(--green-light); }

        /* Buttons */
        .btn-primary { display:inline-flex; align-items:center; gap:8px; background:var(--green); color:#fff; border:none; border-radius:8px; padding:14px 26px; font-size:14px; font-weight:500; cursor:pointer; text-decoration:none; transition:all 0.2s; }
        .btn-primary:hover { background:var(--green-light); transform:translateY(-1px); box-shadow:0 6px 20px rgba(61,122,42,0.3); }
        .btn-outline { display:inline-flex; align-items:center; gap:8px; background:transparent; color:var(--text); border:1px solid var(--border); border-radius:8px; padding:13px 26px; font-size:14px; font-weight:400; cursor:pointer; text-decoration:none; transition:all 0.2s; }
        .btn-outline:hover { border-color:#999; background:rgba(0,0,0,0.03); }
        .btn-ghost-light { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.15); color:#fff; border:1px solid rgba(255,255,255,0.3); border-radius:8px; padding:13px 26px; font-size:14px; font-weight:400; cursor:pointer; text-decoration:none; transition:all 0.2s; backdrop-filter:blur(8px); }
        .btn-ghost-light:hover { background:rgba(255,255,255,0.25); border-color:rgba(255,255,255,0.5); }

        /* Feature accordion */
        .feat-row { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; border-radius:12px; cursor:pointer; transition:all 0.2s; border:1px solid transparent; }
        .feat-row:hover { background:#F5F3EE; }
        .feat-row.open { background:#fff; border-color:var(--border); box-shadow:0 2px 12px rgba(0,0,0,0.06); }

        /* Tab */
        .dash-tab { display:flex; flex-direction:column; align-items:center; gap:4px; padding:12px 20px; border-radius:10px; cursor:pointer; transition:all 0.2s; border:1px solid transparent; flex:1; min-width:0; }
        .dash-tab:hover { background:#F5F3EE; }
        .dash-tab.active { background:#fff; border-color:var(--border); box-shadow:0 2px 8px rgba(0,0,0,0.06); }

        /* Solution card */
        .sol-card { border-radius:16px; overflow:hidden; background:#fff; border:1px solid var(--border); transition:all 0.3s; }
        .sol-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(0,0,0,0.1); }

        /* Mobile carousel responsiveness */
        @media (max-width: 768px) {
          .sol-grid { display: none !important; }
          .mobile-carousel { display: block !important; }
        }

        /* Testimonial */
        .testi-card { background:#fff; border:1px solid var(--border); border-radius:16px; padding:32px; transition:all 0.3s; }
        .testi-card:hover { box-shadow:0 8px 24px rgba(0,0,0,0.08); transform:translateY(-3px); }

        /* FAQ */
        .faq-row { border-bottom:1px solid var(--border); }
        .faq-q { display:flex; align-items:center; justify-content:space-between; padding:22px 0; cursor:pointer; transition:color 0.2s; gap:16px; }
        .faq-q:hover { color:var(--green); }

        /* Hamburger */
        .hamburger { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:4px; }
        .hline { display:block; width:22px; height:1.5px; background:var(--text); }

        /* Layout helpers */
        .container { max-width:1140px; margin:0 auto; padding:0 5%; }
        .section { padding:96px 5%; }
        .section-sm { padding:72px 5%; }

        /* Responsive */
        @media (max-width: 1024px) {
          .desktop-nav { display:none !important; }
          .hamburger { display:flex !important; }
          .feat-grid { grid-template-columns:1fr !important; }
          .brand-strip { gap:24px !important; }
          .brand-strip > *:nth-child(n+5) { display:none; }
        }
        @media (max-width: 768px) {
          .section { padding:64px 20px; }
          .section-sm { padding:48px 20px; }
          .hero-content h1 { font-size:clamp(32px,8vw,56px) !important; }
          .stats-strip { grid-template-columns:repeat(2,1fr) !important; gap:20px !important; }
          .sol-grid { grid-template-columns:1fr !important; }
          .testi-grid { grid-template-columns:1fr !important; }
          .tabs-row { overflow-x:auto; flex-wrap:nowrap !important; padding-bottom:4px; }
          .brand-strip > *:nth-child(n+4) { display:none; }
          .footer-top { flex-direction:column !important; gap:40px !important; }
          .footer-links { flex-wrap:wrap !important; gap:32px !important; }
          .mission-text { font-size:clamp(22px,4.5vw,36px) !important; }
          .hero-h { font-size:clamp(30px,7vw,56px) !important; }
        }
        @media (max-width: 480px) {
          .stats-strip { grid-template-columns:1fr 1fr !important; }
          .tabs-row .dash-tab { padding:10px 12px !important; }
          .contact-cards { flex-direction:column !important; }
        }
      `}</style>

      {/* ════════════════════ NAV ════════════════════ */}
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
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 5%", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#3D7A2A,#5A9E40)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🌿</div>
            <span style={{ fontFamily: "Instrument Serif,serif", fontSize: 19, color: scrolled ? "var(--text)" : "#fff", fontWeight: 400 }}>Crop Sync</span>
          </div>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {["Why Us", "Services", "How It Works", "Testimonials", "Contact Us"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} className="nav-link" style={{ color: scrolled ? "var(--muted)" : "rgba(255,255,255,0.8)" }}>{l}</a>
            ))}
          </nav>

          <div className="desktop-nav" style={{ display: "flex" }}>
            <Link href="/register" className="nav-cta">Contact Us</Link>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            <span className="hline" style={{ background: scrolled ? "var(--text)" : "#fff" }} />
            <span className="hline" style={{ background: scrolled ? "var(--text)" : "#fff" }} />
            <span className="hline" style={{ background: scrolled ? "var(--text)" : "#fff" }} />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "#fff", display: "flex", flexDirection: "column", padding: "80px 32px 40px" }}>
            <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--text)" }}>✕</button>
            {["Why Us", "Services", "How It Works", "Testimonials", "Contact Us"].map((l, i) => (
              <motion.a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "Instrument Serif,serif", fontSize: 28, color: "var(--text)", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid var(--border)", display: "block" }}>
                {l}
              </motion.a>
            ))}
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/login" className="btn-outline" style={{ justifyContent: "center" }} onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link href="/register" className="btn-primary" style={{ justifyContent: "center" }} onClick={() => setMenuOpen(false)}>Get Started →</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════ HERO ════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", overflow: "hidden", display: "flex", alignItems: "flex-start", paddingTop: "80px" }}>
        {/* BG image with parallax */}
        <motion.div style={{ position: "absolute", inset: "-10%", y: heroBgY }}>
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80"
            alt="Farm"
            style={{ width: "100%", height: "110%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(6,18,6,0.55) 0%,rgba(6,18,6,0.65) 50%,rgba(6,18,6,0.85) 100%)" }} />
        </motion.div>

        {/* Tall wheat/crop overlay on right */}
        <div style={{ position: "absolute", right: 0, bottom: 0, width: "38%", height: "100%", pointerEvents: "none", overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1566754436393-73b9df8ab406?w=800&q=80" alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", maskImage: "linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 90%)", WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 85%)", opacity: 0.5 }} />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1, paddingBottom: 0, paddingTop: 140 }}>
          <div style={{ maxWidth: 680 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(61,122,42,0.3)", border: "1px solid rgba(90,158,64,0.5)", borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6BD44E", flexShrink: 0, animation: "pulse-dot 2s infinite" }} />
              <span style={{ fontFamily: "var(--font-nunito)", fontSize: 12, color: "#A8E090", letterSpacing: "0.04em" }}>Smart Farming Platform</span>
            </motion.div>

            <motion.h1
              className="hero-h"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(38px,6vw,72px)", lineHeight: 1.06, letterSpacing: "-0.025em", color: "#fff", marginBottom: 20 }}
            >
              Smart Farming for<br />
              Future{" "}
              <em style={{ color: "#6BD44E", fontStyle: "italic" }}>Generations</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              style={{ fontFamily: "Nunito", fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.72)", maxWidth: 520, marginBottom: 40, fontWeight: 300 }}
            >
              Ready to transform your farm? Our intelligent agriculture platform equips East African farmers and agribusinesses with practical tools for smarter, more sustainable operations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.38 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link href="/register" className="btn-primary" style={{ padding: "14px 28px", fontSize: 14 }}>Start Investing →</Link>
              <Link href="/login" className="btn-ghost-light" style={{ padding: "13px 28px", fontSize: 14 }}>Know More →</Link>
            </motion.div>

            
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.6 }}
        >
          <span style={{ fontFamily: "Nunito", fontSize: 11, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom,rgba(255,255,255,0.8),transparent)" }} />
        </motion.div>
      </section>


      {/* ════════════════════ MISSION STATEMENT ════════════════════ */}
      <section className="section">
        <div className="container">
          <motion.p
            className="mission-text"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            style={{ fontFamily: "Nunito", fontSize: "clamp(22px,3.5vw,40px)", lineHeight: 1.45, fontWeight: 400, color: "var(--text)", maxWidth: 900 }}
          >
            Our platform is built to support farmers, agribusinesses, and agricultural innovators by delivering{" "}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--green-bg)", border: "1px solid rgba(61,122,42,0.2)", borderRadius: 8, padding: "2px 12px 2px 8px", verticalAlign: "middle", margin: "0 4px" }}>
              <span>🌱</span>
              <span style={{ color: "var(--green)", fontWeight: 500, fontSize: "0.9em" }}>practical tools</span>
            </span>{" "}
            that respect the land while improving productivity.
          </motion.p>
        </div>
      </section>

      {/* ════════════════════ FEATURES ACCORDION ════════════════════ */}
      <section id="services" className="section" style={{ background: "#F7F5F0", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Farm Agro Services</div>
            <div style={{ display: "flex", gap: 80, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 auto", maxWidth: 480 }}>
                <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(28px,3vw,42px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 6 }}>
                  Smart Farming Solutions
                </h2>
                <p style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: "clamp(20px,2.5vw,32px)", color: "var(--green)", lineHeight: 1.2, marginBottom: 40 }}>
                  That Deliver Real Results
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {features.map((f, i) => (
                    <div key={i}>
                      <div className={`feat-row ${activeFeature === i ? "open" : ""}`} onClick={() => setActiveFeature(activeFeature === i ? -1 : i)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 18 }}>{f.icon}</span>
                          <span style={{ fontFamily: "Nunito", fontSize: 15, fontWeight: 500, color: activeFeature === i ? "var(--green)" : "var(--text)" }}>{f.title}</span>
                        </div>
                        <motion.span
                          animate={{ rotate: activeFeature === i ? 45 : 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ fontSize: 20, color: activeFeature === i ? "var(--green)" : "#999", flexShrink: 0 }}
                        >+</motion.span>
                      </div>
                      <AnimatePresence>
                        {activeFeature === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div style={{ padding: "4px 22px 18px 50px", fontFamily: "Nunito", fontSize: 14, color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>
                              {f.body}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature image */}
              <div style={{ flex: 1, minWidth: 280, borderRadius: 20, overflow: "hidden", height: "clamp(280px,35vw,460px)", position: "relative", boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeFeature}
                    src={activeFeature === 0
                      ? "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80"
                      : activeFeature === 1
                      ? "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                      : activeFeature === 2
                      ? "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80"
                      : "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80"}
                    alt=""
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                  />
                </AnimatePresence>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 60%,rgba(6,18,6,0.5) 100%)" }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ TABS + BIG IMAGE ════════════════════ */}
      <section id="how-it-works" className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Smart Farming</div>
            <div style={{ display: "flex", gap: 60, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 32 }}>
              <div style={{ flex: "0 0 auto" }}>
                <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(26px,3vw,42px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text)" }}>
                  Smart Farming Made
                </h2>
                <p style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: "clamp(20px,2.5vw,34px)", color: "var(--green)" }}>
                  Simple and Efficient
                </p>
              </div>
              <p style={{ fontFamily: "Nunito", fontSize: 15, color: "var(--muted)", lineHeight: 1.7, fontWeight: 300, maxWidth: 420, flex: 1, minWidth: 260, paddingTop: 8 }}>
                A smart farming platform that connects crops, data, and operations to help farmers grow more sustainably and confidently.
              </p>
            </div>

            {/* Tabs */}
            <div className="tabs-row" style={{ display: "flex", gap: 8, background: "#F0EEE8", borderRadius: 14, padding: 6, marginBottom: 24 }}>
              {tabs.map((t, i) => (
                <button key={i} className={`dash-tab ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>
                  <span style={{ fontFamily: "Nunito", fontSize: 13, fontWeight: 500, color: activeTab === i ? "var(--text)" : "var(--muted)", whiteSpace: "nowrap" }}>{t.label}</span>
                  <span style={{ fontFamily: "Nunito", fontSize: 11, color: activeTab === i ? "var(--green)" : "#aaa", whiteSpace: "nowrap" }}>{t.sub}</span>
                </button>
              ))}
            </div>

            {/* Big farm image with overlay card */}
            <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: "clamp(300px,42vw,560px)" }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeTab}
                  src={[
                    "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=1400&q=80",
                    "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1400&q=80",
                    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=80",
                    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&q=80",
                  ][activeTab]}
                  alt=""
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                />
              </AnimatePresence>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.4) 100%)" }} />

              {/* Floating weather card */}
              <div style={{ position: "absolute", bottom: 28, right: 28, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderRadius: 14, padding: "18px 22px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", minWidth: 200, border: "1px solid rgba(255,255,255,0.8)" }}>
                <div style={{ fontFamily: "Nunito", fontSize: 11, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current Weather</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 32 }}>☀️</span>
                  <span style={{ fontFamily: "Instrument Serif,serif", fontSize: 36, color: "var(--text)", lineHeight: 1 }}>24°C</span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[{ l: "Rain", v: "0%" }, { l: "Humidity", v: "58%" }, { l: "Wind", v: "12km" }].map(d => (
                    <div key={d.l}>
                      <div style={{ fontFamily: "Nunito", fontSize: 10, color: "#aaa" }}>{d.l}</div>
                      <div style={{ fontFamily: "Nunito", fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{d.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--green-bg)", borderRadius: 8, fontFamily: "Nunito", fontSize: 12, color: "var(--green)", fontWeight: 500 }}>
                  🌾 Good conditions for harvest
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ STATS STRIP ════════════════════ */}
      <section style={{ padding: "60px 5%", background: "#fff", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div className="stats-strip" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40, textAlign: "center" }}>
            {[
              { v: "1.5M+", l: "Acres Monitored" },
              { v: "500K+", l: "Farmers Empowered" },
              { v: "2M+", l: "Farm Decisions Optimised" },
              { v: "750K+", l: "Successful Harvests" },
            ].map(s => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(32px,4vw,52px)", color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>{s.v}</div>
                <div style={{ fontFamily: "Nunito", fontSize: 14, color: "var(--muted)", fontWeight: 300 }}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ SOLUTIONS 3-CARD GRID ════════════════════ */}
      <section id="why-us" className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Smart Solutions</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
              <div>
                <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(26px,3vw,42px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text)" }}>Smart Solutions for</h2>
                <p style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: "clamp(22px,2.8vw,38px)", color: "var(--green)" }}>Modern Farming</p>
              </div>
              <p style={{ fontFamily: "Nunito", fontSize: 15, color: "var(--muted)", lineHeight: 1.7, maxWidth: 360, fontWeight: 300 }}>
                We empower farmers with intelligent tools and data-driven insights to increase yields, reduce costs, and build a more sustainable agricultural future.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="sol-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}
          >
            {solutions.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="sol-card">
                <div style={{ height: 240, overflow: "hidden", position: "relative" }}>
                  <img src={s.img} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", display: "block" }} className="sol-img" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.35) 100%)" }} />
                </div>
                <div style={{ padding: "22px 24px 28px" }}>
                  <h3 style={{ fontFamily: "Instrument Serif,serif", fontSize: 20, color: "var(--text)", marginBottom: 10, letterSpacing: "-0.01em" }}>{s.title}</h3>
                  <p style={{ fontFamily: "Nunito", fontSize: 14, color: "var(--muted)", lineHeight: 1.65, fontWeight: 300, marginBottom: 20 }}>{s.desc}</p>
                  <a href="#" style={{ fontFamily: "Nunito", fontSize: 13, color: "var(--green)", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Learn more →
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Carousel */}
          <div className="mobile-carousel" style={{ display: "none", marginTop: 32 }}>
            <div style={{ position: "relative" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSolution}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="sol-card"
                  style={{ 
                    maxWidth: "320px", 
                    margin: "0 auto"
                  }}
                >
                  <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                    <img src={solutions[currentSolution].img} alt={solutions[currentSolution].title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", display: "block" }} className="sol-img" />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.35) 100%)" }} />
                  </div>
                  <div style={{ padding: "18px 20px 24px" }}>
                    <h3 style={{ fontFamily: "Instrument Serif,serif", fontSize: 18, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.01em" }}>{solutions[currentSolution].title}</h3>
                    <p style={{ fontFamily: "Nunito", fontSize: 13, color: "var(--muted)", lineHeight: 1.6, fontWeight: 300, marginBottom: 16 }}>{solutions[currentSolution].desc}</p>
                    <a href="#" style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--green)", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      Learn more
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button
                onClick={() => setCurrentSolution(currentSolution === 0 ? solutions.length - 1 : currentSolution - 1)}
                style={{
                  position: "absolute",
                  left: "-20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--green)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  boxShadow: "0 4px 12px rgba(61,122,42,0.3)",
                  transition: "all 0.2s",
                  zIndex: 10
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
              >
                <span style={{ marginLeft: -2 }}><ArrowLeft/></span>
              </button>

              <button
                onClick={() => setCurrentSolution(currentSolution === solutions.length - 1 ? 0 : currentSolution + 1)}
                style={{
                  position: "absolute",
                  right: "-20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--green)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  boxShadow: "0 4px 12px rgba(61,122,42,0.3)",
                  transition: "all 0.2s",
                  zIndex: 10
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
              >
                <span style={{ marginLeft: 2 }}><ArrowRight/></span>
              </button>

              {/* Carousel indicators */}
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
                {solutions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSolution(i)}
                    style={{
                      width: i === currentSolution ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: i === currentSolution ? "var(--green)" : "rgba(61,122,42,0.3)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ TESTIMONIALS ════════════════════ */}
      <section id="testimonials" className="section" style={{ background: "#F7F5F0", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Testimonials</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
              <div>
                <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(26px,3vw,42px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text)" }}>Real Stories Shared</h2>
                <p style={{ fontFamily: "Instrument Serif,serif", fontStyle: "italic", fontSize: "clamp(22px,2.8vw,36px)", color: "var(--green)" }}>by Our Farmers</p>
              </div>
              <p style={{ fontFamily: "Nunito", fontSize: 15, color: "var(--muted)", lineHeight: 1.7, maxWidth: 360, fontWeight: 300 }}>
                Hear directly from farmers who use our solution every day and are transforming how they farm.
              </p>
            </div>
          </motion.div>

          <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
            {/* Left testimonial cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="testi-card">
                  <div style={{ fontFamily: "Instrument Serif,serif", fontSize: 40, color: "var(--green)", opacity: 0.4, lineHeight: 1, marginBottom: 16 }}>"</div>
                  <p style={{ fontFamily: "Nunito", fontSize: 15, color: "var(--text)", lineHeight: 1.75, fontWeight: 300, marginBottom: 24, fontStyle: "italic" }}>{t.quote}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={t.img} alt={t.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{t.name}</div>
                      <div style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--muted)" }}>{t.role}</div>
                    </div>
                    <a href="#" style={{ marginLeft: "auto", fontFamily: "Nunito", fontSize: 12, color: "var(--green)", fontWeight: 500, textDecoration: "none" }}>Read More →</a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: big image with floating stat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: "clamp(340px,50vw,600px)" }}
            >
              <img src="/jamie-street-V6FcCG14q30-unsplash.jpg" alt="Farmer"
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.5) 100%)" }} />
              <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🌾</div>
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

      {/* ════════════════════ FAQ ════════════════════ */}
      <section id="faq" className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>FAQ</div>
            <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.12, letterSpacing: "-0.02em", color: "var(--text)" }}>
              Common Farmer <em style={{ color: "var(--green)", fontStyle: "italic" }}>Questions</em>
            </h2>
            <p style={{ fontFamily: "Nunito", fontSize: 15, color: "var(--muted)", fontWeight: 300, marginTop: 14, lineHeight: 1.6 }}>
              Got questions? We've got answers to help you get the most out of Crop Sync.
            </p>
          </motion.div>

          <div>
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                className="faq-row"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span style={{ fontFamily: "Nunito", fontSize: 15, fontWeight: 500, color: "var(--text)", flex: 1 }}>{f.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0, background: openFaq === i ? "var(--green)" : "#F0EEE8" }}
                    transition={{ duration: 0.2 }}
                    style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, color: openFaq === i ? "#fff" : "var(--muted)" }}
                  >+</motion.div>
                </div>
                <AnimatePresence>
                  {openFaq === i && f.a && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{ fontFamily: "Nunito", fontSize: 14, color: "var(--muted)", lineHeight: 1.75, fontWeight: 300, paddingBottom: 20 }}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/register" className="btn-primary" style={{ padding: "15px 36px", fontSize: 15 }}>
              Start your journey →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA BANNER ════════════════════ */}
      <section className="section" style={{ background: "#F7F5F0", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(30px,4vw,52px)", lineHeight: 1.1, letterSpacing: "-0.025em", color: "var(--text)", marginBottom: 16 }}>
              Make farming smarter,<br />
              <em style={{ color: "var(--green)", fontStyle: "italic" }}>stronger, and simpler</em>
            </h2>
            <p style={{ fontFamily: "Nunito", fontSize: 16, color: "var(--muted)", lineHeight: 1.7, fontWeight: 300, maxWidth: 480, margin: "0 auto 36px" }}>
              Deploy smart tools to help you make confident decisions for your farm.
            </p>
            <Link href="/register" className="btn-primary" style={{ padding: "15px 36px", fontSize: 15 }}>
              Get started today →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════ CONTACT ════════════════════ */}
      <section id="contact-us" className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontFamily: "Nunito", fontSize: 12, color: "var(--green)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Get In Touch</div>
            <h2 style={{ fontFamily: "Instrument Serif,serif", fontSize: "clamp(26px,3.5vw,46px)", lineHeight: 1.12, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 14 }}>
              Ready to transform your<br /><em style={{ color: "var(--green)", fontStyle: "italic" }}>farming operations?</em>
            </h2>
            <p style={{ fontFamily: "Nunito", fontSize: 15, color: "var(--muted)", fontWeight: 300, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Our team is available 24/7 to help you get started. Whether you're a small-scale farmer or managing large agricultural operations, we're here to provide personalized guidance.
            </p>
          </motion.div>

          <div className="contact-cards" style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "📱", title: "WhatsApp", detail: "+254 748 333 763", best: "Quick questions, immediate support, demo requests", link: "https://wa.me/254748333763" },
              { icon: "✉️", title: "Email", detail: "support@cropsync.com", best: "Detailed inquiries, proposals, documentation", link: "mailto:support@cropsync.com" },
              { icon: "📞", title: "Phone", detail: "+254 748 333 763", best: "Urgent issues, technical support, partnership discussions", link: "tel:+254712345678" },
            ].map(c => (
              <motion.a key={c.title} href={c.link} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}
                style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "28px 32px", borderRadius: 16, border: "1px solid var(--border)", background: "#fff", textDecoration: "none", transition: "all 0.3s", minWidth: 280, maxWidth: 380, flex: 1 }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)", borderColor: "rgba(61,122,42,0.3)" }}
              >
                <div style={{ fontSize: 32, flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontFamily: "Nunito", fontSize: 16, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontFamily: "Nunito", fontSize: 14, color: "var(--muted)", marginBottom: 10 }}>{c.detail}</div>
                  <div style={{ fontFamily: "Nunito", fontSize: 13, color: "var(--green)", lineHeight: 1.5 }}>
                    <strong>Best for:</strong> {c.best}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer style={{ background: "#0D150A", color: "#B8B5AD", padding: "72px 5% 40px" }}>
        <div className="container">
          <div className="footer-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 60, gap: 40 }}>
            {/* Brand */}
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg,#3D7A2A,#5A9E40)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🌱</div>
                <span style={{ fontFamily: "Instrument Serif,serif", fontSize: 19, color: "#fff" }}>Crop Sync</span>
              </div>
              <p style={{ fontFamily: "Nunito", fontSize: 14, color: "#888", lineHeight: 1.65, fontWeight: 300, marginBottom: 20 }}>
                Modern farm intelligence for the next generation of African agriculture. Empowering farmers with data-driven insights for sustainable growth.
              </p>
              
            </div>

            {/* Links */}
            <div className="footer-links" style={{ display: "flex", gap: 60 }}>
              {[
                { title: "Quick Links", links: [
                  { text: "Home", url: "/" },
                  { text: "About Us", url: "#about" },
                  { text: "Blog", url: "/blog" },
                  { text: "Careers", url: "/careers" },
                  { text: "Contact", url: "#contact-us" }
                ]},
                { title: "Services", links: [
                  { text: "Smart Crop Monitoring", url: "#how-it-works" },
                  { text: "Precision Weather Systems", url: "#weather" },
                  { text: "Soil & Fertilizer Analysis", url: "#solutions" },
                  { text: "Maintenance & Support", url: "#contact-us" }
                ]},
                { title: "Company", links: [
                  { text: "Our Customers", url: "#testimonials" },
                  { text: "Emergency Support", url: "tel:+254712345678" },
                  { text: "Privacy Policy", url: "/privacy" },
                  { text: "Terms of Service", url: "/terms" }
                ]},
              ].map(col => (
                <div key={col.title}>
                  <div style={{ fontFamily: "Nunito", fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>{col.title}</div>
                  {col.links.map(link => (
                    <div key={link.text} style={{ marginBottom: 12 }}>
                      <a href={link.url} style={{ fontFamily: "Nunito", fontSize: 14, color: "#888", textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#B8B5AD")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                        {link.text}
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontFamily: "Nunito", fontSize: 13, color: "#555" }}> {new Date().getFullYear()} Crop Sync. All rights reserved.</span>
            <div style={{ display: "flex", gap: 24 }}>
              <a href="/terms" style={{ fontFamily: "Nunito", fontSize: 13, color: "#555", textDecoration: "none" }}>Terms of Service</a>
              <a href="/privacy" style={{ fontFamily: "Nunito", fontSize: 13, color: "#555", textDecoration: "none" }}>Privacy Policy</a>
              <a href="/cookies" style={{ fontFamily: "Nunito", fontSize: 13, color: "#555", textDecoration: "none" }}>Cookie Policy</a>
            </div>
            <div style={{ fontFamily: "Nunito", fontSize: 13, color: "#555" }}>
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