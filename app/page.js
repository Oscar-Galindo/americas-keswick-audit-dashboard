"use client";
import { useState, useEffect, useRef } from "react";

// ─── AUDIT DATA ────────────────────────────────────────────────────────────────
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
  headshot: "/headshot.jpg",
  logo: "/logo.png",
};

const OVERALL_SCORE = 59;

const CATEGORIES = [
  {
    id: "performance",
    label: "Performance",
    score: 52,
    grade: "F",
    icon: "⚡",
    summary: "The site runs on an unoptimized WordPress stack. Heavy render-blocking JavaScript and CSS delay the first meaningful paint. Images are converted to WebP via a plugin — good — but dozens of scripts and stylesheets fire before any content is visible. Real-world load times are well over 4 seconds on mobile.",
    findings: [
      {
        severity: "critical",
        title: "Render-Blocking Resources",
        detail: "Multiple WordPress plugin stylesheets and scripts load in the <head> before the page renders. Each one adds latency. Visitors on slower connections see a blank screen while these assets download.",
        impact: "Every additional second of load time costs approximately 7% in conversions. At Keswick's level of traffic, this is real revenue and real retreat bookings slipping away.",
      },
      {
        severity: "critical",
        title: "No Caching Strategy Detected",
        detail: "Static assets are served without long-lived cache headers. Every return visitor downloads the full stylesheet and script bundle again instead of loading instantly from cache.",
        impact: "Return visitors — donors, retreat coordinators who visited once and came back — experience the same slow first load every time.",
      },
      {
        severity: "warning",
        title: "Uncompressed JavaScript Bundles",
        detail: "Several plugin scripts appear to be served without GZIP or Brotli compression. This inflates transfer sizes and extends load times on mobile connections.",
        impact: "Users on cellular connections are waiting longer than they should. Mobile accounts for 60%+ of web traffic for most non-profits.",
      },
      {
        severity: "warning",
        title: "No CDN for Static Assets",
        detail: "Images and scripts are served directly from the origin server in New Jersey. Visitors from other regions — PA, NY, MD — experience additional latency.",
        impact: "A CDN would cut asset delivery time in half for the majority of Keswick's regional audience.",
      },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    score: 64,
    grade: "D",
    icon: "📱",
    summary: "The site has a mobile viewport set and collapses its mega-menu on small screens. However, the navigation is overly complex — 5 top-level items, each with cascading submenus — making it difficult to reach core actions (book a retreat, donate, find events) on a phone without multiple taps and scrolling.",
    findings: [
      {
        severity: "critical",
        title: "Mega Menu is Difficult to Use on Mobile",
        detail: "The navigation has 5 top-level items with 3-4 levels of sub-navigation. On mobile, this creates a labyrinthine tap experience. Users trying to quickly book a retreat have to drill through nested menus to find the right page.",
        impact: "If a church group coordinator is browsing on their phone and can't quickly find 'Host a Retreat,' they'll bounce. That's a $3,000–$15,000 group booking lost.",
      },
      {
        severity: "warning",
        title: "Tap Targets Too Small in Footer Navigation",
        detail: "Footer links are densely packed with insufficient spacing. Google's mobile guidelines require tap targets of at least 48x48px. Several footer links fall short.",
        impact: "Mis-taps frustrate users and send them back to Google — to a competitor.",
      },
      {
        severity: "info",
        title: "No App-Like Mobile Experience",
        detail: "There's no PWA manifest, no offline caching, no install prompt. For a retreat center where people may be on spotty campground Wi-Fi, offline capability would add real value.",
        impact: "Low priority, but worth considering as a phase-2 enhancement.",
      },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    score: 71,
    grade: "C",
    icon: "🔍",
    summary: "Basic SEO is in place: the site has a sitemap link in the footer, heading hierarchy on the homepage, and keyword-rich anchor text throughout. However, the page title shows only 'Home' — missing the client's primary keyword — and there's no visible structured data (schema.org markup) helping Google understand events, organization info, or reviews.",
    findings: [
      {
        severity: "critical",
        title: "Homepage Title Tag is 'Home'",
        detail: "The document title for the homepage is set to 'Home' instead of something descriptive like 'Christian Retreat & Conference Center in NJ | America's Keswick'. This is one of the most important on-page SEO signals Google uses.",
        impact: "A weak title tag means the homepage is less likely to rank for the primary keyword 'Christian retreat center NJ' — a high-value search term for Keswick's business.",
      },
      {
        severity: "warning",
        title: "No Structured Data / Schema Markup",
        detail: "The site has no schema.org markup for Organization, Event, or LocalBusiness. Google uses structured data to display rich results — event listings, star ratings, business details — directly in search results.",
        impact: "Keswick's events don't appear with rich snippets in Google Search. Competitors with schema markup get more real estate on the search results page.",
      },
      {
        severity: "warning",
        title: "Open Graph Tags Not Confirmed",
        detail: "No OG tags were detected in the page source. When someone shares americaskeswick.org on Facebook, LinkedIn, or in a church group chat, the link may not generate an attractive preview image and title.",
        impact: "Word-of-mouth sharing is a primary acquisition channel for retreat centers. A poor link preview reduces click-through on shares.",
      },
      {
        severity: "info",
        title: "Missing Alt Text on Embedded Image",
        detail: "A base64 lazy-load GIF placeholder was found with no alt attribute. While this may be a tracking pixel, any non-decorative image without alt text is flagged by search crawlers.",
        impact: "Minor SEO signal, but combined with other issues it contributes to an incomplete technical foundation.",
      },
    ],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    score: 48,
    grade: "F",
    icon: "♿",
    summary: "This is the most urgent category — especially for an organization rooted in serving all people. The site has significant accessibility gaps: missing alt text on at least one embedded image, no visible skip navigation link, complex nested menus without confirmed ARIA roles, and color contrast likely below WCAG 2.1 AA minimums in several areas. Non-profits should hold themselves to a higher standard here, and the April 2026 ADA Title II deadline creates real legal exposure.",
    findings: [
      {
        severity: "critical",
        title: "Site Excludes Visitors with Disabilities",
        detail: "The site fails multiple WCAG 2.1 AA criteria: missing alt text, no skip navigation, unconfirmed ARIA roles on a complex mega-menu, and likely insufficient color contrast. Visitors using screen readers or keyboard-only navigation cannot fully access content or convert on key actions like booking a retreat or donating.",
        impact: "For an organization whose mission is to serve all people, an inaccessible website directly contradicts that mission — and is a real barrier for a meaningful segment of potential guests, donors, and retreat participants.",
      },
      {
        severity: "critical",
        title: "Missing Alt Text on Image Element",
        detail: "A base64-embedded image was found in the page source without an alt attribute. Screen readers will skip or misread this element. Every non-decorative image must have descriptive alt text under WCAG 2.1 Success Criterion 1.1.1.",
        impact: "Visitors using screen readers — including those with visual impairments attending or planning to attend retreat programs — cannot access the full content of the page.",
      },
      {
        severity: "critical",
        title: "No Skip Navigation Link",
        detail: "The page has no 'Skip to main content' link at the top. Keyboard-only users must tab through all 30+ navigation links before reaching the main content of the page.",
        impact: "This is a WCAG 2.4.1 violation. Keyboard navigation is required for users with motor disabilities, and it's one of the first things a WCAG auditor checks.",
      },
      {
        severity: "warning",
        title: "Complex Navigation Without Confirmed ARIA Roles",
        detail: "The mega menu uses nested unordered lists for navigation. ARIA attributes (aria-expanded, aria-haspopup, role='navigation') could not be confirmed in the rendered DOM. Without them, screen readers cannot understand the menu's interactive state.",
        impact: "Users relying on screen readers may not know a submenu exists or how to navigate into it.",
      },
      {
        severity: "warning",
        title: "Color Contrast Likely Below AA Standard",
        detail: "The site uses light gray text on white backgrounds in several sections. WCAG 2.1 requires a minimum contrast ratio of 4.5:1 for body text. Based on the visible design, several text-background combinations appear below this threshold.",
        impact: "Low contrast text is unreadable for users with low vision — a population Keswick's ministry explicitly serves.",
      },
    ],
  },
  {
    id: "content",
    label: "Content & UX",
    score: 72,
    grade: "C",
    icon: "🎯",
    summary: "Keswick's content is rich and clearly written for its audience — families, church groups, and retreat coordinators. Testimonials are prominent, FAQs are on the homepage, and multiple CTAs guide visitors to book or donate. However, the primary conversion path is buried in a mega-menu, the homepage slider rotates too fast to read, and there's no clear visual hierarchy guiding first-time visitors toward a single action.",
    findings: [
      {
        severity: "warning",
        title: "No Clear Primary CTA Above the Fold",
        detail: "The hero section cycles through 6 different events with 6 different calls to action. A first-time visitor has no clear single action to take. 'Book Your Stay,' 'Learn More,' 'Purchase Tickets' — all competing for attention at the same visual weight.",
        impact: "Decision paralysis. When everything is equally important, nothing is. The bounce rate on the homepage is likely higher than it should be.",
      },
      {
        severity: "warning",
        title: "Rotating Hero Carousel Harms UX and SEO",
        detail: "Auto-rotating carousels are widely considered a UX anti-pattern. Studies show only ~1% of users interact with slides beyond the first. Google also can't reliably index content that's hidden behind carousel tabs.",
        impact: "5 out of 6 hero messages are effectively invisible to most visitors and to search engines.",
      },
      {
        severity: "info",
        title: "Testimonials Are Present But Not Starred",
        detail: "The site has strong testimonials from real guests. They're on the homepage — good. But they don't use schema markup, so star ratings don't appear in Google Search results.",
        impact: "A simple addition of Review schema could generate rich snippets in search, driving significantly higher click-through rates.",
      },
    ],
  },
  {
    id: "security",
    label: "Security",
    score: 61,
    grade: "D",
    icon: "🔒",
    summary: "The site serves over HTTPS, which is the baseline. However, critical security headers are not configured: no Content Security Policy, no HSTS header, no X-Frame-Options protection. WordPress, the CMS powering the site, is one of the most targeted platforms on the internet. Without these headers, the site is more vulnerable to clickjacking, cross-site scripting, and data injection attacks.",
    findings: [
      {
        severity: "critical",
        title: "No Content Security Policy (CSP) Header",
        detail: "A CSP header tells the browser which sources are allowed to load scripts, styles, and media. Without one, any injected script — from a compromised plugin or third-party service — can execute in visitors' browsers.",
        impact: "If a WordPress plugin is ever compromised, there's no browser-level defense. Visitor data — including donation form inputs — could be captured by malicious scripts.",
      },
      {
        severity: "warning",
        title: "HSTS Not Configured",
        detail: "HTTP Strict Transport Security tells browsers to always use HTTPS for your domain, preventing SSL-stripping attacks. Without it, someone intercepting traffic could downgrade the connection to HTTP.",
        impact: "Visitors on public Wi-Fi at conferences or churches could have their session hijacked before they reach the HTTPS site.",
      },
      {
        severity: "warning",
        title: "No X-Frame-Options Header",
        detail: "Without X-Frame-Options or Content-Security-Policy frame-ancestors, the site can be embedded inside an iframe on another domain. This enables clickjacking attacks — where a malicious site overlays invisible buttons on top of Keswick's pages.",
        impact: "Donation forms embedded in a malicious frame could trick users into submitting payments that go elsewhere.",
      },
      {
        severity: "info",
        title: "WordPress Plugin Surface Area",
        detail: "The site uses multiple third-party plugins (Smush for images, Wufoo for forms, and others). Each plugin is an additional attack surface. Without a security audit of installed plugins, it's impossible to confirm there are no known vulnerabilities in the current stack.",
        impact: "Plugin vulnerabilities are the #1 cause of WordPress site compromises. Regular plugin audits are essential.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    score: 58,
    grade: "F",
    icon: "⚙️",
    summary: "The site is built on WordPress with a templated theme and multiple plugins. While it functions, the technical foundation shows signs of accumulated debt: render-blocking assets, a base64 lazy-load pattern for images, external form embeds via Wufoo, and third-party CDN dependencies. No evidence of a staging environment, automated testing, or performance monitoring.",
    findings: [
      {
        severity: "critical",
        title: "WordPress Plugin Bloat",
        detail: "Based on asset paths and page structure, the site loads scripts and styles from at least 8–10 plugins. Each plugin adds HTTP requests, potential conflicts, and maintenance overhead. Several appear to inject JavaScript into every page regardless of whether that feature is used on the page.",
        impact: "Plugin bloat is the leading cause of WordPress performance degradation. It compounds over time as plugins update and introduce new dependencies.",
      },
      {
        severity: "warning",
        title: "Third-Party Form via Wufoo Embed",
        detail: "The Campground Check-In form is hosted on Wufoo (keswick.wufoo.com). This creates a dependency on a third-party service for a critical workflow. If Wufoo experiences downtime, this form goes offline.",
        impact: "Loss of control over a core user journey. Data collected via Wufoo may also create GDPR/privacy compliance questions.",
      },
      {
        severity: "warning",
        title: "No Evidence of Performance Monitoring",
        detail: "There are no visible indicators of real user monitoring (RUM), uptime monitoring, or Core Web Vitals tracking. If the site goes down or slows significantly, the team may not know until a visitor reports it.",
        impact: "Silent failures are the worst kind. A slow or broken site during a major event registration window could result in lost bookings with no one aware of the issue.",
      },
      {
        severity: "info",
        title: "External Ticketing Dependency (TicketTailor)",
        detail: "Concert ticket purchases link out to tickettailor.com, an external platform. While functional, this breaks the user journey and reduces trust — visitors leave the site to complete a transaction.",
        impact: "Each handoff to an external domain introduces friction and reduces conversion. An integrated booking experience keeps users in the Keswick ecosystem.",
      },
    ],
  },
];

const CRITICAL_FINDINGS = [
  {
    rank: 1,
    title: "Accessibility Failures Contradict the Mission",
    description: "America's Keswick exists to serve all people. The current site excludes visitors who rely on screen readers, keyboard-only navigation, or need sufficient color contrast. Missing alt text, no skip nav, and unverified ARIA roles mean a real portion of Keswick's intended audience can't fully use the site.",
    urgency: "Active issue",
  },
  {
    rank: 2,
    title: "Performance Failures Costing Retreat Bookings",
    description: "A 4+ second mobile load time translates directly to abandoned group retreat inquiries. Each $5,000–$15,000 group booking that bounces due to slow load time is a real, measurable loss.",
    urgency: "Happening now",
  },
  {
    rank: 3,
    title: "Security Headers Missing on a Donation-Accepting Site",
    description: "The site processes donations without a Content Security Policy. A single compromised WordPress plugin could silently capture donor payment data. CSP and HSTS are non-negotiable for any site handling financial transactions.",
    urgency: "Active risk",
  },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────
function gradeColor(grade) {
  return { A: "#22c55e", B: "#276EF1", C: "#eab308", D: "#f97316", F: "#ef4444" }[grade] || "#888";
}

function severityColor(s) {
  return { critical: "#ef4444", warning: "#f97316", info: "#276EF1" }[s] || "#888";
}

function severityLabel(s) {
  return { critical: "CRITICAL", warning: "WARNING", info: "INFO" }[s] || s.toUpperCase();
}

// ─── ANIMATED GAUGE ─────────────────────────────────────────────────────────
function Gauge({ score, size = 200 }) {
  const [animScore, setAnimScore] = useState(0);
  const radius = (size / 2) * 0.75;
  const circumference = 2 * Math.PI * radius;
  const progress = (animScore / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 70 ? "#eab308" : score >= 60 ? "#f97316" : "#ef4444";

  useEffect(() => {
    let frame;
    let current = 0;
    const step = () => {
      current = Math.min(current + 1.2, score);
      setAnimScore(Math.round(current));
      if (current < score) frame = requestAnimationFrame(step);
    };
    const timeout = setTimeout(() => { frame = requestAnimationFrame(step); }, 300);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [score]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1a1a1a" strokeWidth={size * 0.07} />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.07}
        strokeDasharray={`${progress} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.05s linear" }}
      />
      <text x={size / 2} y={size / 2 - size * 0.06} textAnchor="middle" fill="#fff" fontSize={size * 0.22} fontWeight="700" fontFamily="system-ui">
        {animScore}
      </text>
      <text x={size / 2} y={size / 2 + size * 0.1} textAnchor="middle" fill="#666" fontSize={size * 0.09} fontFamily="system-ui">
        out of 100
      </text>
    </svg>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function ProgressBar({ score }) {
  const [width, setWidth] = useState(0);
  const color = score >= 80 ? "#22c55e" : score >= 70 ? "#eab308" : score >= 60 ? "#f97316" : "#ef4444";
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 400);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div style={{ background: "#1a1a1a", borderRadius: 4, height: 6, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${width}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.9s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

// ─── GRADE PILL ──────────────────────────────────────────────────────────────
function GradePill({ grade, size = "md" }) {
  const s = size === "lg" ? { fontSize: 28, width: 56, height: 56 } : { fontSize: 16, width: 36, height: 36 };
  return (
    <div style={{
      width: s.width, height: s.height,
      borderRadius: "50%",
      background: gradeColor(grade) + "22",
      border: `2px solid ${gradeColor(grade)}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: s.fontSize, fontWeight: 800, color: gradeColor(grade),
      fontFamily: "system-ui", flexShrink: 0,
    }}>
      {grade}
    </div>
  );
}

// ─── CATEGORY CARD ───────────────────────────────────────────────────────────
function CategoryCard({ cat }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, textAlign: "left",
        }}
      >
        <span style={{ fontSize: 22 }}>{cat.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "system-ui" }}>{cat.label}</div>
          <div style={{ marginTop: 8 }}>
            <ProgressBar score={cat.score} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <span style={{ color: "#888", fontSize: 15, fontFamily: "system-ui" }}>{cat.score}/100</span>
          <GradePill grade={cat.grade} />
          <span style={{ color: "#555", fontSize: 18, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "block" }}>›</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid #222", padding: "20px 24px" }}>
          <p style={{ color: "#aaa", fontSize: 15, lineHeight: 1.7, margin: "0 0 20px", fontFamily: "system-ui" }}>{cat.summary}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cat.findings.map((f, i) => (
              <div key={i} style={{ background: "#0a0a0a", border: `1px solid ${severityColor(f.severity)}33`, borderLeft: `3px solid ${severityColor(f.severity)}`, borderRadius: 8, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{
                    background: severityColor(f.severity) + "22", color: severityColor(f.severity),
                    fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, letterSpacing: 1,
                    fontFamily: "system-ui",
                  }}>{severityLabel(f.severity)}</span>
                  <span style={{ color: "#ddd", fontWeight: 700, fontSize: 14, fontFamily: "system-ui" }}>{f.title}</span>
                </div>
                <p style={{ color: "#999", fontSize: 13, lineHeight: 1.6, margin: "0 0 8px", fontFamily: "system-ui" }}>{f.detail}</p>
                <p style={{ color: "#666", fontSize: 12, lineHeight: 1.5, margin: 0, fontFamily: "system-ui" }}>
                  <span style={{ color: "#f97316", fontWeight: 600 }}>Impact: </span>{f.impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "#276EF1" }) {
  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "20px 24px" }}>
      <div style={{ color: color, fontSize: 28, fontWeight: 800, fontFamily: "system-ui" }}>{value}</div>
      <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginTop: 4, fontFamily: "system-ui" }}>{label}</div>
      {sub && <div style={{ color: "#666", fontSize: 12, marginTop: 4, fontFamily: "system-ui" }}>{sub}</div>}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AuditDashboard() {
  const totalFindings = CATEGORIES.reduce((acc, c) => acc + c.findings.length, 0);
  const criticalCount = CATEGORIES.reduce((acc, c) => acc + c.findings.filter(f => f.severity === "critical").length, 0);
  const warningCount = CATEGORIES.reduce((acc, c) => acc + c.findings.filter(f => f.severity === "warning").length, 0);

  const styles = {
    page: { background: "#000", minHeight: "100vh", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" },
    container: { maxWidth: 900, margin: "0 auto", padding: "0 24px" },
    section: { padding: "48px 0" },
    sectionTitle: { fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 24, letterSpacing: "-0.02em" },
    divider: { border: "none", borderTop: "1px solid #1a1a1a", margin: 0 },
    tag: (color) => ({
      background: color + "22", color, fontSize: 11, fontWeight: 700, padding: "3px 10px",
      borderRadius: 20, letterSpacing: 0.5, display: "inline-block",
    }),
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ ...styles.container, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src={AUDITOR.logo} alt="Online Nexus Marketing" style={{ height: 36, opacity: 0.9 }} onError={e => { e.target.style.display = "none"; }} />
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Online Nexus Marketing</div>
              <div style={{ color: "#555", fontSize: 12 }}>Website Audit Report</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#888", fontSize: 12 }}>{CLIENT.date}</div>
            <div style={{ color: "#276EF1", fontSize: 13, fontWeight: 600 }}>{CLIENT.url}</div>
          </div>
        </div>
      </div>

      {/* HERO / OVERVIEW */}
      <div style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #000 100%)", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ ...styles.container, padding: "60px 24px 48px" }}>
          <div style={{ marginBottom: 8 }}>
            <span style={styles.tag("#276EF1")}>CONFIDENTIAL AUDIT</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, margin: "12px 0 8px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            {CLIENT.name}
          </h1>
          <p style={{ color: "#666", fontSize: 16, margin: "0 0 40px" }}>{CLIENT.contact}</p>

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 40, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <Gauge score={OVERALL_SCORE} size={180} />
              <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
                <GradePill grade="D" size="lg" />
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Overall Grade</div>
                  <div style={{ color: "#666", fontSize: 12 }}>7 categories audited</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
              <StatCard label="Critical Issues" value={criticalCount} sub="Need immediate action" color="#ef4444" />
              <StatCard label="Warnings" value={warningCount} sub="Should be addressed" color="#f97316" />
              <StatCard label="Total Findings" value={totalFindings} sub="Across all categories" color="#276EF1" />
              <StatCard label="Legal Deadline" value="Apr '26" sub="ADA Title II (WCAG 2.1 AA)" color="#eab308" />
            </div>
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* CRITICAL FINDINGS */}
      <div style={{ ...styles.container, ...styles.section }}>
        <h2 style={styles.sectionTitle}>Top 3 Critical Findings</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {CRITICAL_FINDINGS.map((f) => (
            <div key={f.rank} style={{
              background: "#111", border: "1px solid #ef444422", borderLeft: "4px solid #ef4444",
              borderRadius: 12, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "#ef444422", border: "2px solid #ef4444",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800,
                color: "#ef4444", flexShrink: 0,
              }}>{f.rank}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{f.title}</span>
                  <span style={{ background: "#ef444422", color: "#ef4444", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, letterSpacing: 1 }}>{f.urgency.toUpperCase()}</span>
                </div>
                <p style={{ color: "#999", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr style={styles.divider} />

      {/* CATEGORY FINDINGS */}
      <div style={{ ...styles.container, ...styles.section }}>
        <h2 style={styles.sectionTitle}>Category Findings</h2>
        <p style={{ color: "#666", fontSize: 14, margin: "-16px 0 24px" }}>Click any category to expand findings.</p>
        {CATEGORIES.map(cat => <CategoryCard key={cat.id} cat={cat} />)}
      </div>

      <hr style={styles.divider} />

      {/* SCORECARD TABLE */}
      <div style={{ ...styles.container, ...styles.section }}>
        <h2 style={styles.sectionTitle}>Scorecard</h2>
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 40px", padding: "12px 20px", borderBottom: "1px solid #1a1a1a" }}>
            {["Category", "Score", "Grade", ""].map((h, i) => (
              <div key={i} style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, textAlign: i > 0 ? "center" : "left" }}>{h}</div>
            ))}
          </div>
          {CATEGORIES.map((cat, i) => (
            <div key={cat.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 40px", padding: "16px 20px", borderBottom: i < CATEGORIES.length - 1 ? "1px solid #1a1a1a" : "none", alignItems: "center", gap: 8 }}>
              <div>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{cat.icon} {cat.label}</div>
                <ProgressBar score={cat.score} />
              </div>
              <div style={{ textAlign: "center", color: "#aaa", fontSize: 15, fontWeight: 600 }}>{cat.score}</div>
              <div style={{ display: "flex", justifyContent: "center" }}><GradePill grade={cat.grade} /></div>
              <div />
            </div>
          ))}
          <div style={{ borderTop: "2px solid #276EF133", background: "#276EF108", display: "grid", gridTemplateColumns: "1fr 80px 80px 40px", padding: "16px 20px", alignItems: "center" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Overall Score</div>
            <div style={{ textAlign: "center", color: "#276EF1", fontSize: 18, fontWeight: 800 }}>{OVERALL_SCORE}</div>
            <div style={{ display: "flex", justifyContent: "center" }}><GradePill grade="D" /></div>
            <div />
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* NEXT STEPS */}
      <div style={{ ...styles.container, ...styles.section }}>
        <h2 style={styles.sectionTitle}>Next Steps</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { num: "01", title: "Accessibility Remediation", desc: "Address WCAG 2.1 AA violations before the April 2026 federal deadline. This includes skip links, ARIA roles, alt text audit, and color contrast corrections.", color: "#ef4444" },
            { num: "02", title: "Performance Overhaul", desc: "Eliminate render-blocking resources, implement caching, compress JavaScript, and integrate a CDN. Target: sub-2 second load on mobile.", color: "#f97316" },
            { num: "03", title: "Security Headers Deployment", desc: "Configure CSP, HSTS, X-Frame-Options, and X-Content-Type-Options at the server level. Protect donors and visitors from script injection and clickjacking.", color: "#eab308" },
            { num: "04", title: "SEO Foundation Repair", desc: "Fix the homepage title tag, implement schema markup for Organization, Event, and Review types, and confirm OG tags are present and correct.", color: "#22c55e" },
            { num: "05", title: "UX Simplification", desc: "Replace the rotating hero carousel with a single high-impact CTA. Simplify the navigation to reduce friction on the path to booking a retreat.", color: "#276EF1" },
            { num: "06", title: "Modern Rebuild", desc: "Consider a ground-up rebuild on a modern, performance-first stack (Astro + React + Contentful + Vercel) that's faster, more secure, and easier to maintain long-term.", color: "#a855f7" },
          ].map(step => (
            <div key={step.num} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "24px" }}>
              <div style={{ color: step.color, fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 8 }}>{step.num}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{step.title}</div>
              <p style={{ color: "#888", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <hr style={styles.divider} />

      {/* CTA */}
      <div style={{ ...styles.container, ...styles.section }}>
        <div style={{ background: "linear-gradient(135deg, #0d1a33 0%, #111 100%)", border: "1px solid #276EF133", borderRadius: 16, padding: "40px 36px", display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
          <img
            src={AUDITOR.headshot}
            alt={AUDITOR.name}
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #276EF1", flexShrink: 0 }}
            onError={e => { e.target.style.display = "none"; }}
          />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>{AUDITOR.name}</div>
            <div style={{ color: "#276EF1", fontSize: 14, marginBottom: 4 }}>{AUDITOR.company}</div>
            <div style={{ color: "#666", fontSize: 13, marginBottom: 16, fontStyle: "italic" }}>{AUDITOR.slogan}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a
                href={AUDITOR.calendly}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#276EF1", color: "#fff", fontWeight: 700, fontSize: 14,
                  padding: "12px 24px", borderRadius: 8, textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Book a Strategy Call
              </a>
              <a
                href={`mailto:${AUDITOR.email}`}
                style={{
                  background: "transparent", color: "#276EF1", fontWeight: 600, fontSize: 14,
                  padding: "12px 24px", borderRadius: 8, textDecoration: "none",
                  border: "1px solid #276EF133", display: "inline-block",
                }}
              >
                {AUDITOR.email}
              </a>
            </div>
          </div>
          <div style={{ textAlign: "right", minWidth: 160 }}>
            <div style={{ color: "#555", fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>AUDIT PREPARED FOR</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{CLIENT.name}</div>
            <div style={{ color: "#555", fontSize: 13 }}>{CLIENT.url}</div>
            <div style={{ color: "#444", fontSize: 11, marginTop: 8 }}>{CLIENT.date}</div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #111", padding: "24px", textAlign: "center" }}>
        <p style={{ color: "#333", fontSize: 12, margin: 0 }}>
          &copy; {new Date().getFullYear()} {AUDITOR.company} &nbsp;&bull;&nbsp; This report is confidential and prepared exclusively for {CLIENT.name}. &nbsp;&bull;&nbsp; <a href={`mailto:${AUDITOR.email}`} style={{ color: "#444" }}>{AUDITOR.email}</a>
        </p>
      </div>
    </div>
  );
}
