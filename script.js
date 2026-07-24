/* ==========================================================================
   Kaeyan AI Studio — script.js
   ========================================================================== */
(() => {
  "use strict";

  /* ---------------- Loader ---------------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => loader.classList.add("loaded"), 400);
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Theme toggle ---------------- */
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("kaeyan-theme");
  if (savedTheme) document.body.setAttribute("data-theme", savedTheme);
  themeToggle.addEventListener("click", () => {
    const next = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("kaeyan-theme", next);
  });

  /* ---------------- Navbar scroll state ---------------- */
  const navbar = document.getElementById("navbar");
  const scrollBar = document.getElementById("scrollProgressBar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollBar.style.width = pct + "%";
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile nav ---------------- */
  const navBurger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");
  navBurger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navBurger.setAttribute("aria-expanded", open);
    navBurger.classList.toggle("active", open);
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navBurger.setAttribute("aria-expanded", false);
  }));

  /* ---------------- Custom cursor ---------------- */
  const dot = document.querySelector(".cursor-dot");
  const glow = document.querySelector(".cursor-glow");
  let mx = 0, my = 0, gx = 0, gy = 0;
  window.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  (function animateGlow() {
    gx += (mx - gx) * 0.15;
    gy += (my - gy) * 0.15;
    glow.style.transform = `translate(${gx}px,${gy}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateGlow);
  })();
  document.querySelectorAll("a, button, .service-card, .pf-card, input, textarea, select").forEach(el => {
    el.addEventListener("mouseenter", () => glow.classList.add("hover"));
    el.addEventListener("mouseleave", () => glow.classList.remove("hover"));
  });

  /* ---------------- Magnetic buttons ---------------- */
  document.querySelectorAll("[data-magnetic]").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const relX = e.clientX - r.left - r.width / 2;
      const relY = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealTargets = document.querySelectorAll(".reveal-up, .hero-title");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(t => io.observe(t));

  /* ---------------- Hero counters ---------------- */
  const counters = document.querySelectorAll(".stat-num");
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countIO.observe(c));

  /* ---------------- Timeline fill on view ---------------- */
  const timeline = document.getElementById("timeline");
  const timelineFill = document.getElementById("timelineFill");
  if (timeline) {
    const tIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timelineFill.style.width = "100%";
          tIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    tIO.observe(timeline);
  }

  /* ---------------- Neural network canvas (hero) ---------------- */
  const canvas = document.getElementById("neuralCanvas");
  const ctx = canvas.getContext("2d");
  let W, H, nodes = [];
  const NODE_COUNT = 60;
  let pointer = { x: -9999, y: -9999 };

  function resizeCanvas() {
    const hero = document.querySelector(".hero");
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6
    }));
  }
  function drawNodes() {
    ctx.clearRect(0, 0, W, H);
    const accent = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#8A6CFF";
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      const dx = pointer.x - n.x, dy = pointer.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) { n.x -= dx * 0.003; n.y -= dy * 0.003; }

      for (let j = i + 1; j < nodes.length; j++) {
        const o = nodes[j];
        const ddx = n.x - o.x, ddy = n.y - o.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < 140) {
          ctx.strokeStyle = `rgba(138,108,255,${(1 - d / 140) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(o.x, o.y);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
    }
    requestAnimationFrame(drawNodes);
  }
  window.addEventListener("resize", () => { resizeCanvas(); initNodes(); });
  document.querySelector(".hero").addEventListener("mousemove", e => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  });
  document.querySelector(".hero").addEventListener("mouseleave", () => { pointer.x = -9999; pointer.y = -9999; });
  resizeCanvas(); initNodes(); requestAnimationFrame(drawNodes);

  /* ---------------- Hero glow follows mouse ---------------- */
  const heroGlow = document.getElementById("heroGlow");
  window.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    heroGlow.style.transform = `translate(calc(-50% + ${x}px), ${e.clientY * 0.04}px)`;
  });

  /* ---------------- Service card hover glow position ---------------- */
  document.addEventListener("mousemove", e => {
    const card = e.target.closest(".service-card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  /* =========================================================
     DATA: Services
  ========================================================= */
  const services = [
    {
      icon: "🤖", title: "AI Chatbots & Agents", price: "From ₹10000",
      desc: "Conversational AI trained on your business — support, sales, and internal ops.",
      who: "SaaS teams, e-commerce brands, and service businesses drowning in repetitive queries.",
      timeline: "2-4 weeks",
      deliverables: "Trained agent, admin dashboard, analytics, handoff-to-human flow",
      tech: ["Claude / GPT", "RAG pipelines", "WhatsApp API", "Voice agents"],
      benefits: "Cuts response time from hours to seconds and deflects up to 70% of repetitive tickets.",
      covers: "AI Chatbot Development, AI Voice Agent, WhatsApp Automation"
    },
    {
      icon: "⚙️", title: "AI & Workflow Automation", price: "From ₹10000",
      desc: "Connect your tools and let AI handle the busywork — quoting, follow-ups, reporting.",
      who: "Operations teams running the same manual process more than twice a week.",
      timeline: "1-3 weeks",
      deliverables: "Mapped workflow, automation build, CRM integration, monitoring dashboard",
      tech: ["n8n / Zapier", "Custom AI Solutions", "CRM Automation", "API integrations"],
      benefits: "Reclaims 10–20 team-hours a week and removes manual data-entry errors.",
      covers: "AI Automation, Workflow Automation, CRM Automation, Custom AI Solutions"
    },
    {
      icon: "◧", title: "Website & Product Development", price: "From ₹10,000",
      desc: "Fast, beautiful, conversion-focused websites, landing pages and e-commerce builds.",
      who: "Founders launching a new product, brand, or store that needs to feel premium on day one.",
      timeline: "2–6 weeks",
      deliverables: "Responsive site, CMS setup, SEO foundation, analytics, launch support",
      tech: ["HTML/CSS/JS", "Headless CMS", "Shopify", "Web performance tuning"],
      benefits: "Sub-2s load times and a design system built to scale with the business.",
      covers: "Website Development, Landing Pages, E-Commerce"
    },
    {
      icon: "✎", title: "UI/UX Design", price: "From ₹5000",
      desc: "Research-backed product design — from first wireframe to a polished design system.",
      who: "Product teams that need clarity before their next engineering sprint.",
      timeline: "2-5 weeks",
      deliverables: "User research summary, wireframes, hi-fi UI kit, interactive prototype",
      tech: ["Figma", "UX Research", "Design Systems", "Usability testing"],
      benefits: "Fewer engineering rebuilds because decisions are validated before code.",
      covers: "UI/UX Design, UX Research, Wireframing, Prototype, Design Systems"
    },
    {
      icon: "▣", title: "Dashboard & SaaS Product Design", price: "From ₹25,000",
      desc: "Complex data made simple — dashboards, admin panels, and full SaaS product design.",
      who: "B2B SaaS teams shipping data-dense products that still need to feel effortless.",
      timeline: "3-6 weeks",
      deliverables: "Information architecture, component library, dashboard UI, mobile app screens",
      tech: ["Figma", "Design tokens", "Chart systems", "Responsive grids"],
      benefits: "Cleaner onboarding and lower support volume from confused users.",
      covers: "Dashboard Design, SaaS Product Design, Mobile App Design"
    },
    {
      icon: "◆", title: "Brand Identity & Print", price: "From ₹1000",
      desc: "Logo, visual identity and print collateral that feels intentional, not templated.",
      who: "New businesses and rebrands that need a identity system, not just a logo file.",
      timeline: "1–3 weeks",
      deliverables: "Logo suite, brand guidelines, business cards, stationery, brochure & flyer templates",
      tech: ["Typography systems", "Print-ready files", "Brand guidelines deck"],
      benefits: "One consistent identity across every touchpoint, digital and print.",
      covers: "Brand Identity, Logo Design, Business Cards, Stationery, Brochure, Flyer, Menu Design"
    },
    {
      icon: "◐", title: "Social & Digital Marketing", price: "From ₹1000/mo",
      desc: "Content, community and paid growth across the platforms your customers actually use.",
      who: "Brands that need consistent presence without hiring a full in-house team.",
      timeline: "Ongoing, monthly",
      deliverables: "Content calendar, posting & community management, ad campaigns, monthly report",
      tech: ["Meta Ads", "Instagram / Facebook", "Google Business Profile", "Analytics"],
      benefits: "Predictable content cadence and a growing, engaged audience.",
      covers: "Social Media Management, Instagram Marketing, Facebook Marketing, Google Business Profile"
    },
    {
      icon: "▲", title: "SEO & Performance Marketing", price: "From ₹650/mo",
      desc: "Technical SEO, content strategy and lead generation built on real search data.",
      who: "Companies who want organic growth that compounds instead of resetting every month.",
      timeline: "Ongoing, results in 60–90 days",
      deliverables: "Technical audit, content strategy, on-page fixes, monthly ranking report",
      tech: ["Core Web Vitals", "Schema markup", "Content strategy", "Lead-gen funnels"],
      benefits: "Durable organic traffic that keeps compounding after the campaign ends.",
      covers: "SEO, Performance Optimization, Content Strategy, Digital Marketing, Lead Generation"
    },
    {
      icon: "✦", title: "AI Consulting", price: "From ₹1,200",
      desc: "An outside-in audit of where AI actually belongs in your business — and a roadmap to get there.",
      who: "Leadership teams evaluating AI investment before committing budget.",
      timeline: "1-2 weeks",
      deliverables: "Opportunity audit, prioritised roadmap, build-vs-buy recommendation, ROI model",
      tech: ["Process mapping", "Model evaluation", "Data readiness review"],
      benefits: "A clear, de-risked plan instead of a scattershot list of AI experiments.",
      covers: "AI Consulting"
    }
  ];

  const servicesGrid = document.getElementById("servicesGrid");
  servicesGrid.innerHTML = services.map((s, i) => `
    <div class="service-card" id="svc-${i}">
      <div class="sc-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p class="sc-desc">${s.desc}</p>
      <div class="sc-foot">
        <span class="sc-price">${s.price}</span>
        <button class="sc-expand" aria-label="Expand ${s.title} details" aria-expanded="false">+</button>
      </div>
      <div class="sc-body">
        <div class="sc-body-inner">
          <p><strong>Who it's for:</strong> ${s.who}</p>
          <div class="sc-meta">
            <div><span>Timeline</span>${s.timeline}</div>
            <div><span>Deliverables</span>${s.deliverables}</div>
          </div>
          <p><strong>Includes:</strong> ${s.covers}</p>
          <p><strong>Why it matters:</strong> ${s.benefits}</p>
          <div class="sc-tags">${s.tech.map(t => `<span>${t}</span>`).join("")}</div>
          <a href="#contact" class="btn btn-primary">Get a quote</a>
        </div>
      </div>
    </div>
  `).join("");

  servicesGrid.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const willOpen = !card.classList.contains("open");
      card.classList.toggle("open");
      card.querySelector(".sc-expand").setAttribute("aria-expanded", willOpen);
    });
  });

  /* =========================================================
     DATA: Portfolio
  ========================================================= */
  const portfolio = [
    {
      name: "NeuraBox", cat: "AI Product Design", c1: "#3171F3", c2: "#8438E6",
      tags: ["AI", "SaaS", "Dashboard"],
      overview: "An AI knowledge-base product that turns a company's scattered docs into an instantly searchable, conversational assistant.",
      problem: "The client's support team spent hours re-answering the same questions buried across wikis, PDFs and Slack threads.",
      research: "We interviewed 14 support agents and mapped every recurring query into a topic taxonomy before designing anything.",
      process: "Low-fidelity flows validated with agents, then a full component library covering search, citations, and escalation states.",
      challenges: "Balancing answer confidence with transparency - users needed to trust when the AI was unsure.",
      solutions: "A confidence-tiered UI that visually distinguishes verified answers from AI-inferred ones, with one-click source citations.",
      outcome: "62% of tickets resolved without a human agent within the first month of launch.",
      timeline: "8 weeks", industry: "B2B SaaS", scope: "Product design + AI integration",
      colors: ["#3171F3", "#8438E6", "#050816", "#B8B8C0"]
    },
    {
      name: "Forest Meadows Resort", cat: "Hospitality Website", c1: "#00E0A4", c2: "#0E183C",
      tags: ["Web", "Booking", "Brand"],
      overview: "A destination resort website redesigned to sell the feeling of the place before a single filter is applied.",
      problem: "The previous site loaded slowly and buried the booking flow behind four clicks, losing mobile visitors fast.",
      research: "Competitive audit of luxury hospitality sites, plus a heatmap review of the old site's drop-off points.",
      process: "Cinematic hero imagery, a persistent booking widget, and a stripped-back navigation built around three guest intents.",
      challenges: "Keeping the site premium-feeling while hitting sub-2-second load times on mobile networks.",
      solutions: "Aggressive image optimisation and a custom lazy-load sequence tuned to perceived performance, not just metrics.",
      outcome: "Direct bookings up 34% quarter-over-quarter after launch, with mobile bounce rate down by half.",
      timeline: "5 weeks", industry: "Hospitality", scope: "Website design + development",
      colors: ["#00E0A4", "#0E183C", "#F6F7FB", "#525266"]
    },
    {
      name: "BRO Platform", cat: "SaaS Dashboard", c1: "#8438E6", c2: "#3171F3",
      tags: ["Dashboard", "SaaS", "Design System"],
      overview: "A B2B logistics platform given a full design system overhaul to support rapid feature growth.",
      problem: "Every new feature shipped with a slightly different UI pattern, and the product was becoming inconsistent and slow to build on.",
      research: "Audit of 40+ existing screens to identify duplicate patterns and inconsistent spacing, color, and type usage.",
      process: "Built a token-based design system first, then re-skinned core flows before extending it to new features.",
      challenges: "Migrating without freezing feature development for the engineering team.",
      solutions: "A parallel-track rollout - new components shipped alongside old ones, retired screen by screen.",
      outcome: "40% faster feature shipping once the design system was adopted studio-wide.",
      timeline: "10 weeks", industry: "Logistics SaaS", scope: "Design system + dashboard UI",
      colors: ["#8438E6", "#3171F3", "#0C1124", "#FFFFFF"]
    },
    {
      name: "Prompt BI", cat: "AI Analytics Tool", c1: "#3171F3", c2: "#00E0A4",
      tags: ["AI", "Analytics", "B2B"],
      overview: "A natural-language business intelligence tool - ask a question in plain English, get a chart back.",
      problem: "Non-technical stakeholders relied on analysts for every simple data question, creating a reporting bottleneck.",
      research: "Shadowed five analysts for a week to catalogue the most common questions asked of them.",
      process: "Prototype-tested three query-to-chart interaction models before settling on a conversational canvas.",
      challenges: "Making the AI's chart choices feel predictable rather than a black box.",
      solutions: "An editable 'reasoning trail' showing exactly which fields and filters produced each chart.",
      outcome: "Analyst-dependent requests dropped by 55% within six weeks of rollout.",
      timeline: "7 weeks", industry: "Data / Analytics", scope: "AI product design + prototyping",
      colors: ["#3171F3", "#00E0A4", "#050816", "#B8B8C0"]
    },
    {
      name: "LocalLoop", cat: "Marketplace Dashboard", c1: "#0E183C", c2: "#8A6CFF",
      tags: ["Marketplace", "Web App"],
      overview: "A hyperlocal delivery marketplace connecting neighbourhood shops with nearby customers.",
      problem: "Vendors found the merchant dashboard confusing, leading to slow order acceptance and stock errors.",
      research: "On-site visits with six merchant partners to watch real order-management sessions.",
      process: "Redesigned the order queue around urgency, not chronology, with one-tap status updates.",
      challenges: "Designing for merchants using low-end Android devices with unreliable connections.",
      solutions: "An offline-first interface that queues updates locally and syncs the moment connectivity returns.",
      outcome: "Average order-acceptance time dropped from 6 minutes to 90 seconds.",
      timeline: "6 weeks", industry: "Marketplace", scope: "Product design + PWA build",
      colors: ["#0E183C", "#8A6CFF", "#F6F7FB", "#00E0A4"]
    },
    {
      name: "Kaeyan Voice", cat: "AI Voice Agent", c1: "#8438E6", c2: "#0E183C",
      tags: ["AI", "Voice", "Automation"],
      overview: "An always-on AI voice agent handling inbound calls for a multi-location service business.",
      problem: "Missed after-hours calls were costing the client an estimated 15 bookings a week.",
      research: "Analysed 200+ recorded calls to map the most common intents and required handoff points.",
      process: "Scripted conversational flows, then trained and tuned the agent against real call transcripts.",
      challenges: "Keeping the voice agent's tone warm and on-brand rather than robotic.",
      solutions: "Custom prompt engineering plus a human-review loop during the first month of live calls.",
      outcome: "92% of after-hours calls now resolved or booked without staff involvement.",
      timeline: "4 weeks", industry: "Home Services", scope: "AI voice agent build",
      colors: ["#8438E6", "#0E183C", "#050816", "#FFFFFF"]
    }
  ];

  const portfolioGrid = document.getElementById("portfolioGrid");
  portfolioGrid.innerHTML = portfolio.map((p, i) => `
    <div class="pf-card" data-index="${i}">
      <div class="pf-thumb">
        <span class="pf-placeholder">
          Image Preview
          <small>Coming Soon</small>
        </span>
      </div>
      <div class="pf-overlay">
        <p class="pf-cat">${p.cat}</p>
        <h3>${p.name}</h3>
        <div class="pf-tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
        <span class="pf-view">View Case Study →</span>
      </div>
    </div>
  `).join("");

  /* ---------------- Portfolio modal ---------------- */
  const pfModal = document.getElementById("pfModal");
  const pfContent = document.getElementById("pfContent");
  let currentPf = 0;

  function renderPf(i) {
    const p = portfolio[i];
    pfContent.innerHTML = `
      <div class="pf-hero-img">
        <span class="pf-placeholder">
          Image Preview
          <small>Coming Soon</small>
        </span>
      </div>
      <div class="pf-body">
        <p class="pf-cat">${p.cat}</p>
        <h2>${p.name}</h2>
        <div class="pf-meta-grid">
          <div><span>Timeline</span>${p.timeline}</div>
          <div><span>Industry</span>${p.industry}</div>
          <div><span>Scope</span>${p.scope}</div>
        </div>
        <div class="pf-section"><h4>Overview</h4><p>${p.overview}</p></div>
        <div class="pf-section"><h4>Problem</h4><p>${p.problem}</p></div>
        <div class="pf-section"><h4>Research</h4><p>${p.research}</p></div>
        <div class="pf-section"><h4>Process & Wireframes</h4><p>${p.process}</p>
          <div class="pf-gallery"><div></div><div></div><div></div></div>
        </div>
        <div class="pf-section"><h4>UI Screens & Design System</h4>
          <p>Typography, color and component tokens defined before a single screen was built.</p>
          <div class="pf-swatches">${p.colors.map(c => `<span style="background:${c}"></span>`).join("")}</div>
        </div>
        <div class="pf-section"><h4>Challenges</h4><p>${p.challenges}</p></div>
        <div class="pf-section"><h4>Solutions</h4><p>${p.solutions}</p></div>
        <div class="pf-section"><h4>Outcome & Results</h4><p>${p.outcome}</p></div>
        <div class="pf-section"><h4>Gallery</h4>
          <div class="pf-gallery"><div></div><div></div><div></div></div>
        </div>
      </div>
    `;
    currentPf = i;
  }

  function openPf(i) {
    renderPf(i);
    pfModal.classList.add("open");
    pfModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closePf() {
    pfModal.classList.remove("open");
    pfModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  portfolioGrid.addEventListener("click", e => {
    const card = e.target.closest(".pf-card");
    if (card) openPf(parseInt(card.dataset.index, 10));
  });
  document.getElementById("pfClose").addEventListener("click", closePf);
  pfModal.addEventListener("click", e => { if (e.target === pfModal) closePf(); });
  document.getElementById("pfPrev").addEventListener("click", () => renderPf((currentPf - 1 + portfolio.length) % portfolio.length));
  document.getElementById("pfNext").addEventListener("click", () => renderPf((currentPf + 1) % portfolio.length));
  document.addEventListener("keydown", e => {
    if (!pfModal.classList.contains("open")) return;
    if (e.key === "Escape") closePf();
    if (e.key === "ArrowRight") renderPf((currentPf + 1) % portfolio.length);
    if (e.key === "ArrowLeft") renderPf((currentPf - 1 + portfolio.length) % portfolio.length);
  });

  /* =========================================================
     DATA: Pricing
  ========================================================= */
  const pricing = [
    {
      name: "Starter", desc: "For a single, focused deliverable.", amount: "₹490", period: "one-time project",
      features: ["1 core deliverable (site, brand, or automation)", "Up to 2 revision rounds", "5-day delivery on landing pages", "Email support", "30 days post-launch support"]
    },
    {
      name: "Growth", desc: "For businesses ready to scale their digital presence.", amount: "₹1,450", period: "one-time project", featured: true,
      features: ["Website or product design + build", "Basic AI automation included", "Up to 4 revision rounds", "SEO foundation setup", "60 days post-launch support", "Priority Slack support"]
    },
    {
      name: "Business", desc: "Full-stack design, AI, and growth support.", amount: "₹3,200", period: "per project",
      features: ["Multi-service engagement", "Custom AI chatbot or automation", "Full design system", "Monthly performance report", "90 days post-launch support", "Dedicated project manager"]
    },
    {
      name: "Enterprise", desc: "Ongoing partnership for complex AI systems.", amount: "Custom", period: "retainer",
      features: ["Multiple concurrent workstreams", "Custom AI infrastructure", "Dedicated pod (design + eng)", "SLA-backed support", "Quarterly roadmap reviews", "White-glove onboarding"]
    }
  ];
  document.getElementById("pricingGrid").innerHTML = pricing.map(p => `
    <div class="price-card ${p.featured ? "featured" : ""}">
      ${p.featured ? '<span class="price-tag">Most popular</span>' : ""}
      <h3>${p.name}</h3>
      <p class="price-desc">${p.desc}</p>
      <div class="price-amount">${p.amount}</div>
      <div class="price-period">${p.period}</div>
      <ul class="price-features">${p.features.map(f => `<li>${f}</li>`).join("")}</ul>
      <a href="#contact" class="btn ${p.featured ? "btn-primary" : "btn-ghost"} full-width">Get Started</a>
    </div>
  `).join("");

  /* =========================================================
     DATA: Testimonials
  ========================================================= */
  const testimonials = [
    { quote: "Kaeyan didn't just design our site - they rebuilt how customers understand what we do. Bookings jumped within weeks.", name: "Ananya Rao", role: "Founder, Forest Meadows Resort" },
    { quote: "The AI chatbot they built handles more support volume than our first two hires combined, and it actually sounds like us.", name: "Marcus Webb", role: "Head of Ops, NeuraBox" },
    { quote: "Their process is the most disciplined I've seen from a design studio - research first, opinions backed by evidence.", name: "Priya Menon", role: "Product Lead, BRO Platform" },
    { quote: "We came in for a logo and left with an entire brand system that made every future decision easier.", name: "Daniel Osei", role: "CEO, LocalLoop" },
    { quote: "Prompt BI shipped in seven weeks and our analysts got their time back almost immediately.", name: "Sara Lindqvist", role: "Data Lead, Prompt BI" },
    { quote: "Fast, sharp, and never precious about their own ideas — exactly what a startup timeline needs.", name: "Rahul Iyer", role: "Founder, Kaeyan Voice client" }
  ];
  const tHtml = testimonials.map(t => `
    <div class="t-card">
      <p class="t-quote">"${t.quote}"</p>
      <div class="t-person">
        <div class="t-avatar">${t.name.split(" ").map(n => n[0]).join("")}</div>
        <div><div class="t-name">${t.name}</div><div class="t-role">${t.role}</div></div>
      </div>
    </div>
  `).join("");
  document.getElementById("testimonialTrack").innerHTML = tHtml + tHtml;

  /* =========================================================
     DATA: FAQ
  ========================================================= */
  const faqs = [
    { q: "How long does a typical project take?", a: "Landing pages and brand identity projects usually take 1-3 weeks. Full product design or AI automation builds run 4–8 weeks depending on scope. We'll give you a specific timeline after the discovery call." },
    { q: "Do you work with early-stage startups?", a: "Yes - about half of our clients are pre-seed to Series A. We offer the Starter and Growth tiers specifically to fit tighter early-stage budgets without cutting corners on quality." },
    { q: "What does 'AI-first' actually mean for my project?", a: "It means we evaluate where intelligence genuinely improves the experience before we design anything — not adding a chatbot for its own sake. Sometimes the right answer is no AI at all, and we'll tell you that." },
    { q: "Can you work with our existing design system or codebase?", a: "Absolutely. We regularly extend existing design systems and integrate with current codebases rather than rebuilding from scratch, which keeps cost and risk down." },
    { q: "What happens after launch?", a: "Every package includes a post-launch support window (30-90 days depending on tier) covering bug fixes, small iterations, and monitoring. Ongoing retainers are available after that." },
    { q: "How is pricing structured?", a: "Most engagements are fixed-price per project so there are no surprises. Ongoing services like SEO and social media are billed monthly. Enterprise engagements are scoped as custom retainers." }
  ];
  document.getElementById("faqList").innerHTML = faqs.map((f, i) => `
    <div class="faq-item">
      <button class="faq-q" aria-expanded="false" data-i="${i}">${f.q}<span class="plus"></span></button>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>
  `).join("");
  document.querySelectorAll(".faq-q").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const willOpen = !item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(el => { el.classList.remove("open"); el.querySelector(".faq-q").setAttribute("aria-expanded", false); });
      if (willOpen) { item.classList.add("open"); btn.setAttribute("aria-expanded", true); }
    });
  });

  /* ---------------- Contact form (client-side demo) ---------------- */
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      formNote.textContent = "Please fill in the required fields.";
      formNote.style.color = "#ff6b6b";
      return;
    }
    document.getElementById("submitLabel").textContent = "Sending...";
    setTimeout(() => {
      document.getElementById("submitLabel").textContent = "Send Message";
      formNote.style.color = "var(--success)";
      formNote.textContent = "Thanks - we'll be in touch within one business day.";
      contactForm.reset();
    }, 900);
  });

  const newsletterForm = document.getElementById("newsletterForm");
  newsletterForm.addEventListener("submit", e => {
    e.preventDefault();
    const btn = newsletterForm.querySelector("button");
    btn.textContent = "✓";
    setTimeout(() => { btn.textContent = "→"; newsletterForm.reset(); }, 1800);
  });

  /* ---------------- Back to top ---------------- */
  const backToTop = document.getElementById("backToTop");
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

})();
