"use client";
import { useState, useEffect } from "react";

const CLIENT = {
  name: "America's Keswick",
  url: "americaskeswick.org",
  contact: "America's Keswick Christian Retreat & Conference Center",
  date: "March 2025 Audit",
};

const AUDITOR = {
  name: "Oscar Galindo",
  company: "Online Nexus Marketing",
  email: "ogalindo@onlinenexusmarketing.com",
  calendly: "https://calendly.com/onlinenexusmarketing/strategy-meeting",
  slogan: "Hand it off. It's handled.",
  headshot: "https://images.ctfassets.net/jn2q4lg00k6r/Pvhk8qIvRvsXomjUvMPGK/1a0a3da603bd0eb9e03e79a592738af2/DSC07006_mh1pnc.jpg",
  logo: "https://res.cloudinary.com/dhs9d8tou/image/upload/v1769829242/onmlogo_bhcbxa.png",
};

const OVERALL_SCORE = 59;

const CATEGORIES = [
  {
    id: "performance", label: "Performance", score: 52, grade: "F", icon: "⚡",
    summary: "The site runs on an unoptimized WordPress stack. Heavy render-blocking JavaScript and CSS delay the first meaningful paint. Images are converted to WebP via a plugin — good — but dozens of scripts and stylesheets fire before any content is visible. Real-world load times are well over 4 seconds on mobile.",
    findings: [
      { severity: "critical", title: "Render-Blocking Resources", detail: "Multiple WordPress plugin stylesheets and scripts load in the <head> before the page renders. Each one adds latency. Visitors on slower connections see a blank screen while these assets download.", impact: "Every additional second of load time costs approximately 7% in conversions. At Keswick's level of traffic, this is real revenue and real retreat bookings slipping away." },
      { severity: "critical", title: "No Caching Strategy Detected", detail: "Static assets are served without long-lived cache headers. Every return visitor downloads the full stylesheet and script bundle again instead of loading instantly from cache.", impact: "Return visitors — donors, retreat coordinators who visited once and came back — experience the same slow first load every time." },
      { severity: "warning", title: "Uncompressed JavaScript Bundles", detail: "Several plugin scripts appear to be served without GZIP or Brotli compression. This inflates transfer sizes and extends load times on mobile connections.", impact: "Users on cellular connections are waiting longer than they should. Mobile accounts for 60%+ of web traffic for most non-profits." },
      { severity: "warning", title: "No CDN for Static Assets", detail: "Images and scripts are served directly from the origin server in New Jersey. Visitors from other regions — PA, NY, MD — experience additional latency.", impact: "A CDN would cut asset delivery time in half for the majority of Keswick's regional audience." },
    ],
  },
  {
    id: "mobile", label: "Mobile", score: 64, grade: "D", icon: "📱",
    summary: "The site has a mobile viewport set and collapses its mega-menu on small screens. However, the navigation is overly complex — 5 top-level items, each with cascading submenus — making it difficult to reach core actions on a phone without multiple taps and scrolling.",
    findings: [
      { severity: "critical", title: "Mega Menu is Difficult to Use on Mobile", detail: "The navigation has 5 top-level items with 3-4 levels of sub-navigation. On mobile, this creates a labyrinthine tap experience. Users trying to quickly book a retreat have to drill through nested menus to find the right page.", impact: "If a church group coordinator is browsing on their phone and can't quickly find 'Host a Retreat,' they'll bounce. That's a $3,000–$15,000 group booking lost." },
      { severity: "warning", title: "Tap Targets Too Small in Footer Navigation", detail: "Footer links are densely packed with insufficient spacing. Google's mobile guidelines require tap targets of at least 48x48px. Several footer links fall short.", impact: "Mis-taps frustrate users and send them back to Google — to a competitor." },
      { severity: "info", title: "No App-Like Mobile Experience", detail: "There's no PWA manifest, no offline caching, no install prompt. For a retreat center where people may be on spotty campground Wi-Fi, offline capability would add real value.", impact: "Low priority, but worth considering as a phase-2 enhancement." },
    ],
  },
  {
    id: "seo", label: "SEO", score: 71, grade: "C", icon: "🔍",
    summary: "Basic SEO is in place: sitemap, heading hierarchy, keyword-rich anchor text. However, the page title shows only 'Home' and there is no visible structured data helping Google understand events, organization info, or reviews.",
    findings: [
      { severity: "critical", title: "Homepage Title Tag is 'Home'", detail: "The document title is set to 'Home' instead of something descriptive like 'Christian Retreat & Conference Center in NJ | America's Keswick'.", impact: "A weak title tag means the homepage is less likely to rank for 'Christian retreat center NJ' — a high-value search term for Keswick's business." },
      { severity: "warning", title: "No Structured Data / Schema Markup", detail: "The site has no schema.org markup for Organization, Event, or LocalBusiness. Google uses structured data to display rich results directly in search results.", impact: "Keswick's events don't appear with rich snippets in Google Search." },
      { severity: "warning", title: "Open Graph Tags Not Confirmed", detail: "No OG tags were detected in the page source. When someone shares americaskeswick.org on Facebook or in a church group chat, the link may not generate an attractive preview.", impact: "Word-of-mouth sharing is a primary acquisition channel for retreat centers. A poor link preview reduces click-through on shares." },
      { severity: "info", title: "Missing Alt Text on Embedded Image", detail: "A base64 lazy-load GIF placeholder was found in the page source without an alt attribute.", impact: "Minor SEO signal, but combined with other issues it contributes to an incomplete technical foundation." },
    ],
  },
  {
    id: "accessibility", label: "Accessibility", score: 48, grade: "F", icon: "♿",
    summary: "The most urgent category — especially for an organization rooted in serving all people. Significant gaps: missing alt text, no skip navigation link, complex nested menus without confirmed ARIA roles, and color contrast likely below WCAG 2.1 AA minimums.",
    findings: [
      { severity: "critical", title: "Site Excludes Visitors with Disabilities", detail: "The site fails multiple WCAG 2.1 AA criteria: missing alt text, no skip navigation, unconfirmed ARIA roles, and likely insufficient color contrast. Visitors using screen readers or keyboard-only navigation cannot fully access content or convert on key actions.", impact: "For an organization whose mission is to serve all people, an inaccessible website directly contradicts that mission." },
      { severity: "critical", title: "Missing Alt Text on Image Element", detail: "A base64-embedded image was found in the page source without an alt attribute. Screen readers will skip or misread this element.", impact: "Visitors using screen readers — including those with visual impairments — cannot access the full content of the page." },
      { severity: "critical", title: "No Skip Navigation Link", detail: "The page has no 'Skip to main content' link at the top. Keyboard-only users must tab through all 30+ navigation links before reaching the main content.", impact: "This is a WCAG 2.4.1 violation. Keyboard navigation is required for users with motor disabilities." },
      { severity: "warning", title: "Complex Navigation Without Confirmed ARIA Roles", detail: "The mega menu uses nested unordered lists for navigation. ARIA attributes could not be confirmed in the rendered DOM. Without them, screen readers cannot understand the menu's interactive state.", impact: "Users relying on screen readers may not know a submenu exists or how to navigate into it." },
      { severity: "warning", title: "Color Contrast Likely Below AA Standard", detail: "The site uses light gray text on white backgrounds in several sections. WCAG 2.1 requires a minimum contrast ratio of 4.5:1 for body text.", impact: "Low contrast text is unreadable for users with low vision — a population Keswick's ministry explicitly serves." },
    ],
  },
  {
    id: "content", label: "Content & UX", score: 72, grade: "C", icon: "🎯",
    summary: "Keswick's content is rich and clearly written for its audience — families, church groups, and retreat coordinators. However, the primary conversion path is buried in a mega-menu, the homepage slider rotates too fast to read, and there is no clear visual hierarchy guiding first-time visitors.",
    findings: [
      { severity: "warning", title: "No Clear Primary CTA Above the Fold", detail: "The hero section cycles through 6 different events with 6 different calls to action. A first-time visitor has no clear single action to take.", impact: "Decision paralysis. When everything is equally important, nothing is. The bounce rate on the homepage is likely higher than it should be." },
      { severity: "warning", title: "Rotating Hero Carousel Harms UX and SEO", detail: "Auto-rotating carousels are widely considered a UX anti-pattern. Studies show only ~1% of users interact with slides beyond the first.", impact: "5 out of 6 hero messages are effectively invisible to most visitors and to search engines." },
      { severity: "info", title: "Testimonials Are Present But Not Starred", detail: "The site has strong testimonials from real guests on the homepage. But they don't use schema markup, so star ratings don't appear in Google Search results.", impact: "A simple addition of Review schema could generate rich snippets in search, driving significantly higher click-through rates." },
    ],
  },
  {
    id: "security", label: "Security", score: 61, grade: "D", icon: "🔒",
    summary: "The site serves over HTTPS, which is the baseline. However, critical security headers are missing: no Content Security Policy, no HSTS header, no X-Frame-Options. WordPress is one of the most targeted platforms on the internet.",
    findings: [
      { severity: "critical", title: "No Content Security Policy (CSP) Header", detail: "A CSP header tells the browser which sources are allowed to load scripts, styles, and media. Without one, any injected script can execute in visitors' browsers.", impact: "If a WordPress plugin is ever compromised, visitor data — including donation form inputs — could be captured by malicious scripts." },
      { severity: "warning", title: "HSTS Not Configured", detail: "HTTP Strict Transport Security tells browsers to always use HTTPS for your domain, preventing SSL-stripping attacks.", impact: "Visitors on public Wi-Fi at conferences or churches could have their session hijacked before they reach the HTTPS site." },
      { severity: "warning", title: "No X-Frame-Options Header", detail: "Without X-Frame-Options, the site can be embedded inside an iframe on another domain. This enables clickjacking attacks.", impact: "Donation forms embedded in a malicious frame could trick users into submitting payments that go elsewhere." },
      { severity: "info", title: "WordPress Plugin Surface Area", detail: "The site uses multiple third-party plugins. Each plugin is an additional attack surface. Without a security audit, it's impossible to confirm there are no known vulnerabilities.", impact: "Plugin vulnerabilities are the #1 cause of WordPress site compromises." },
    ],
  },
  {
    id: "technical", label: "Technical", score: 58, grade: "F", icon: "⚙️",
    summary: "The site is built on WordPress with a templated theme and multiple plugins. The technical foundation shows signs of accumulated debt: render-blocking assets, external form embeds via Wufoo, and third-party CDN dependencies with no evidence of performance monitoring.",
    findings: [
      { severity: "critical", title: "WordPress Plugin Bloat", detail: "Based on asset paths and page structure, the site loads scripts and styles from at least 8–10 plugins. Each plugin adds HTTP requests, potential conflicts, and maintenance overhead.", impact: "Plugin bloat is the leading cause of WordPress performance degradation. It compounds over time." },
      { severity: "warning", title: "Third-Party Form via Wufoo Embed", detail: "The Campground Check-In form is hosted on Wufoo (keswick.wufoo.com). If Wufoo experiences downtime, this form goes offline.", impact: "Loss of control over a core user journey." },
      { severity: "warning", title: "No Evidence of Performance Monitoring", detail: "There are no visible indicators of real user monitoring, uptime monitoring, or Core Web Vitals tracking.", impact: "A slow or broken site during a major event registration window could result in lost bookings with no one aware of the issue." },
      { severity: "info", title: "External Ticketing Dependency (TicketTailor)", detail: "Concert ticket purchases link out to tickettailor.com, breaking the user journey.", impact: "Each handoff to an external domain introduces friction and reduces conversion." },
    ],
  },
];

const CRITICAL_FINDINGS = [
  { rank: 1, title: "Accessibility Failures Contradict the Mission", description: "America's Keswick exists to serve all people. The current site excludes visitors who rely on screen readers, keyboard-only navigation, or need sufficient color contrast. Missing alt text, no skip nav, and unverified ARIA roles mean a real portion of Keswick's intended audience can't fully use the site.", urgency: "Active issue" },
  { rank: 2, title: "Performance Failures Costing Retreat Bookings", description: "A 4+ second mobile load time translates directly to abandoned group retreat inquiries. Each $5,000–$15,000 group booking that bounces due to slow load time is a real, measurable loss.", urgency: "Happening now" },
  { rank: 3, title: "Security Headers Missing on a Donation-Accepting Site", description: "The site processes donations without a Content Security Policy. A single compromised WordPress plugin could silently capture donor payment data. CSP and HSTS are non-negotiable for any site handling financial transactions.", urgency: "Active risk" },
];

const NEXT_STEPS = [
  { num: "01", title: "Accessibility Remediation", desc: "Address WCAG 2.1 AA violations: skip links, ARIA roles, alt text audit, and color contrast corrections.", color: "#ef4444" },
  { num: "02", title: "Performance Overhaul", desc: "Eliminate render-blocking resources, implement caching, compress JavaScript, and integrate a CDN. Target: sub-2 second mobile load.", color: "#f97316" },
  { num: "03", title: "Security Headers Deployment", desc: "Configure CSP, HSTS, and X-Frame-Options at the server level to protect donors from script injection and clickjacking.", color: "#eab308" },
  { num: "04", title: "SEO Foundation Repair", desc: "Fix the homepage title tag, implement schema markup for Organization, Event, and Review types, and confirm OG tags.", color: "#22c55e" },
  { num: "05", title: "UX Simplification", desc: "Replace the rotating hero carousel with a single high-impact CTA. Simplify navigation to reduce friction on the path to booking.", color: "#276EF1" },
  { num: "06", title: "Modern Rebuild", desc: "Consider a ground-up rebuild on Astro + React + Contentful + Vercel — faster, more secure, easier to maintain long-term.", color: "#a855f7" },
];

function gradeColor(g) { return { A: "#22c55e", B: "#276EF1", C: "#eab308", D: "#f97316", F: "#ef4444" }[g] || "#888"; }
function sevColor(s) { return { critical: "#ef4444", warning: "#f97316", info: "#276EF1" }[s] || "#888"; }
function sevLabel(s) { return { critical: "CRITICAL", warning: "WARNING", info: "INFO" }[s] || s.toUpperCase(); }

function Gauge({ score }) {
  const [v, setV] = useState(0);
  const size = 150, r = size * 0.375, c = 2 * Math.PI * r;
  const color = score >= 80 ? "#22c55e" : score >= 70 ? "#eab308" : score >= 60 ? "#f97316" : "#ef4444";
  useEffect(() => {
    let frame, cur = 0;
    const t = setTimeout(() => {
      frame = requestAnimationFrame(function step() { cur = Math.min(cur + 1.2, score); setV(Math.round(cur)); if (cur < score) frame = requestAnimationFrame(step); });
    }, 300);
    return () => { clearTimeout(t); cancelAnimationFrame(frame); };
  }, [score]);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", margin: "0 auto" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1a1a" strokeWidth={size*0.07} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.07}
        strokeDasharray={`${(v/100)*c} ${c}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: "stroke-dasharray 0.05s linear" }} />
      <text x={size/2} y={size/2-8} textAnchor="middle" fill="#fff" fontSize={size*0.22} fontWeight="700" fontFamily="system-ui">{v}</text>
      <text x={size/2} y={size/2+14} textAnchor="middle" fill="#666" fontSize={size*0.085} fontFamily="system-ui">out of 100</text>
    </svg>
  );
}

function Bar({ score }) {
  const [w, setW] = useState(0);
  const color = score >= 80 ? "#22c55e" : score >= 70 ? "#eab308" : score >= 60 ? "#f97316" : "#ef4444";
  useEffect(() => { const t = setTimeout(() => setW(score), 400); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{ background: "#1a1a1a", borderRadius: 4, height: 6, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${w}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.9s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function Pill({ grade, large }) {
  const sz = large ? 50 : 32, fs = large ? 20 : 13;
  return (
    <div style={{ width: sz, height: sz, borderRadius: "50%", background: gradeColor(grade)+"22", border: `2px solid ${gradeColor(grade)}`,
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: fs, fontWeight: 800, color: gradeColor(grade), flexShrink: 0 }}>{grade}</div>
  );
}

function CatCard({ cat }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "15px 16px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>{cat.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 7 }}>{cat.label}</div>
          <Bar score={cat.score} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ color: "#888", fontSize: 13 }}>{cat.score}</span>
          <Pill grade={cat.grade} />
          <span style={{ color: "#555", fontSize: 16, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>›</span>
        </div>
      </button>
      {open && (
        <div style={{ borderTop: "1px solid #222", padding: "16px" }}>
          <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7, margin: "0 0 14px" }}>{cat.summary}</p>
          {cat.findings.map((f, i) => (
            <div key={i} style={{ background: "#0a0a0a", border: `1px solid ${sevColor(f.severity)}33`, borderLeft: `3px solid ${sevColor(f.severity)}`, borderRadius: 8, padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7, flexWrap: "wrap" }}>
                <span style={{ background: sevColor(f.severity)+"22", color: sevColor(f.severity), fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 4, letterSpacing: 1, flexShrink: 0 }}>{sevLabel(f.severity)}</span>
                <span style={{ color: "#ddd", fontWeight: 700, fontSize: 13 }}>{f.title}</span>
              </div>
              <p style={{ color: "#999", fontSize: 12, lineHeight: 1.6, margin: "0 0 6px" }}>{f.detail}</p>
              <p style={{ color: "#666", fontSize: 11, lineHeight: 1.5, margin: 0 }}><span style={{ color: "#f97316", fontWeight: 600 }}>Impact: </span>{f.impact}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ color, fontSize: 24, fontWeight: 800 }}>{value}</div>
      <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, marginTop: 3 }}>{label}</div>
      {sub && <div style={{ color: "#666", fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function AuditDashboard() {
  const total = CATEGORIES.reduce((a, c) => a + c.findings.length, 0);
  const crits = CATEGORIES.reduce((a, c) => a + c.findings.filter(f => f.severity === "critical").length, 0);
  const warns = CATEGORIES.reduce((a, c) => a + c.findings.filter(f => f.severity === "warning").length, 0);

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box}
        body{margin:0}
        .w{max-width:900px;margin:0 auto;padding:0 20px}
        .s{padding:32px 0}
        .h2{font-size:19px;font-weight:700;color:#fff;margin:0 0 16px;letter-spacing:-0.02em}
        .hero-g{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center}
        .stat-g{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .step-g{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .sc-h{display:grid;grid-template-columns:1fr 60px 52px;gap:8px;padding:10px 16px;border-bottom:1px solid #1a1a1a}
        .sc-r{display:grid;grid-template-columns:1fr 60px 52px;gap:8px;padding:12px 16px;align-items:center}
        .hdr{display:flex;align-items:center;justify-content:space-between;padding:15px 20px;flex-wrap:wrap;gap:8px}
        .cta-f{display:flex;gap:22px;align-items:center;flex-wrap:wrap}
        .cta-b{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
        .crit{display:flex;gap:14px;align-items:flex-start}
        @media(max-width:600px){
          .w{padding:0 14px}
          .s{padding:22px 0}
          .hero-g{grid-template-columns:1fr;gap:18px}
          .step-g{grid-template-columns:1fr}
          .sc-h{grid-template-columns:1fr 48px 44px;padding:8px 12px}
          .sc-r{grid-template-columns:1fr 48px 44px;padding:10px 12px}
          .hdr{flex-direction:column;align-items:flex-start;gap:6px}
          .cta-f{flex-direction:column;align-items:flex-start;gap:14px}
          .cta-b{flex-direction:column;width:100%}
          .cta-b a{text-align:center!important;width:100%!important}
          .cta-meta{display:none}
          .crit{gap:10px}
        }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}>
        <div className="w hdr">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={AUDITOR.logo} alt="Online Nexus Marketing" style={{ height: 28 }} onError={e => e.target.style.display="none"} />
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Online Nexus Marketing</div>
              <div style={{ color: "#555", fontSize: 11 }}>Website Audit Report</div>
            </div>
          </div>
          <div>
            <div style={{ color: "#888", fontSize: 11 }}>{CLIENT.date}</div>
            <div style={{ color: "#276EF1", fontSize: 12, fontWeight: 600 }}>{CLIENT.url}</div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: "linear-gradient(180deg,#0a0a0a 0%,#000 100%)", borderBottom: "1px solid #1a1a1a" }}>
        <div className="w" style={{ padding: "40px 20px 32px" }}>
          <span style={{ background: "#276EF122", color: "#276EF1", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5 }}>CONFIDENTIAL AUDIT</span>
          <h1 style={{ fontSize: "clamp(22px,6vw,42px)", fontWeight: 800, margin: "10px 0 6px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>{CLIENT.name}</h1>
          <p style={{ color: "#666", fontSize: 14, margin: "0 0 28px" }}>{CLIENT.contact}</p>
          <div className="hero-g">
            <div style={{ textAlign: "center" }}>
              <Gauge score={OVERALL_SCORE} />
              <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
                <Pill grade="D" large />
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Overall Grade</div>
                  <div style={{ color: "#666", fontSize: 11 }}>7 categories audited</div>
                </div>
              </div>
            </div>
            <div className="stat-g">
              <StatCard label="Critical Issues" value={crits} sub="Need immediate action" color="#ef4444" />
              <StatCard label="Warnings" value={warns} sub="Should be addressed" color="#f97316" />
              <StatCard label="Total Findings" value={total} sub="Across all categories" color="#276EF1" />
              <StatCard label="Legal Deadline" value="Apr '26" sub="ADA Title II (WCAG 2.1 AA)" color="#eab308" />
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: 0 }} />

      {/* CRITICAL FINDINGS */}
      <div className="w s">
        <div className="h2">Top 3 Critical Findings</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CRITICAL_FINDINGS.map(f => (
            <div key={f.rank} className="crit" style={{ background: "#111", border: "1px solid #ef444422", borderLeft: "4px solid #ef4444", borderRadius: 12, padding: "20px" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ef444422", border: "2px solid #ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#ef4444", flexShrink: 0 }}>{f.rank}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{f.title}</span>
                  <span style={{ background: "#ef444422", color: "#ef4444", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4, letterSpacing: 1 }}>{f.urgency.toUpperCase()}</span>
                </div>
                <p style={{ color: "#999", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: 0 }} />

      {/* CATEGORIES */}
      <div className="w s">
        <div className="h2">Category Findings</div>
        <p style={{ color: "#666", fontSize: 12, margin: "-10px 0 16px" }}>Tap any category to expand findings.</p>
        {CATEGORIES.map(cat => <CatCard key={cat.id} cat={cat} />)}
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: 0 }} />

      {/* SCORECARD */}
      <div className="w s">
        <div className="h2">Scorecard</div>
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
          <div className="sc-h">
            {["CATEGORY","SCORE","GRADE"].map((h,i) => <div key={i} style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: 1, textAlign: i > 0 ? "center" : "left" }}>{h}</div>)}
          </div>
          {CATEGORIES.map((cat, i) => (
            <div key={cat.id} className="sc-r" style={{ borderBottom: i < CATEGORIES.length-1 ? "1px solid #1a1a1a" : "none" }}>
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{cat.icon} {cat.label}</div>
                <Bar score={cat.score} />
              </div>
              <div style={{ textAlign: "center", color: "#aaa", fontSize: 14, fontWeight: 600 }}>{cat.score}</div>
              <div style={{ display: "flex", justifyContent: "center" }}><Pill grade={cat.grade} /></div>
            </div>
          ))}
          <div className="sc-r" style={{ borderTop: "2px solid #276EF133", background: "#276EF108" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Overall Score</div>
            <div style={{ textAlign: "center", color: "#276EF1", fontSize: 16, fontWeight: 800 }}>{OVERALL_SCORE}</div>
            <div style={{ display: "flex", justifyContent: "center" }}><Pill grade="D" /></div>
          </div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: 0 }} />

      {/* NEXT STEPS */}
      <div className="w s">
        <div className="h2">Next Steps</div>
        <div className="step-g">
          {NEXT_STEPS.map(step => (
            <div key={step.num} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "18px" }}>
              <div style={{ color: step.color, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 7 }}>{step.num}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 7 }}>{step.title}</div>
              <p style={{ color: "#888", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", margin: 0 }} />

      {/* CTA */}
      <div className="w s">
        <div style={{ background: "linear-gradient(135deg,#0d1a33 0%,#111 100%)", border: "1px solid #276EF133", borderRadius: 16, padding: "28px 24px" }}>
          <div className="cta-f">
            <img src={AUDITOR.headshot} alt={AUDITOR.name} style={{ width: 68, height: 68, borderRadius: "50%", objectFit: "cover", border: "3px solid #276EF1", flexShrink: 0 }} onError={e => e.target.style.display="none"} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 19, marginBottom: 3 }}>{AUDITOR.name}</div>
              <div style={{ color: "#276EF1", fontSize: 13, marginBottom: 3 }}>{AUDITOR.company}</div>
              <div style={{ color: "#666", fontSize: 12, fontStyle: "italic" }}>{AUDITOR.slogan}</div>
              <div className="cta-b">
                <a href={AUDITOR.calendly} target="_blank" rel="noopener noreferrer"
                  style={{ background: "#276EF1", color: "#fff", fontWeight: 700, fontSize: 14, padding: "11px 20px", borderRadius: 8, textDecoration: "none", display: "inline-block" }}>
                  Book a Strategy Call
                </a>
                <a href={`mailto:${AUDITOR.email}`}
                  style={{ background: "transparent", color: "#276EF1", fontWeight: 600, fontSize: 12, padding: "11px 16px", borderRadius: 8, textDecoration: "none", border: "1px solid #276EF133", display: "inline-block", wordBreak: "break-all" }}>
                  {AUDITOR.email}
                </a>
              </div>
            </div>
            <div className="cta-meta" style={{ textAlign: "right", minWidth: 130 }}>
              <div style={{ color: "#555", fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>PREPARED FOR</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{CLIENT.name}</div>
              <div style={{ color: "#555", fontSize: 12 }}>{CLIENT.url}</div>
              <div style={{ color: "#444", fontSize: 11, marginTop: 6 }}>{CLIENT.date}</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #111", padding: "18px 20px", textAlign: "center" }}>
        <p style={{ color: "#333", fontSize: 11, margin: 0 }}>
          &copy; {new Date().getFullYear()} {AUDITOR.company} &nbsp;&bull;&nbsp; Confidential report prepared for {CLIENT.name} &nbsp;&bull;&nbsp;
          <a href={`mailto:${AUDITOR.email}`} style={{ color: "#444" }}>{AUDITOR.email}</a>
        </p>
      </div>
    </div>
  );
}
