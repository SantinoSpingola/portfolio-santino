/* ============================================================
   CONFIGURATION — editar para actualizar el portfolio
   ============================================================ */

// Cambiar done:false → true para marcar cursos completados
const CERTS = [
  { name:"Claude 101",                          done:true, date:"ABR 2026" },
  { name:"Claude Code 101",                     done:true, date:"ABR 2026" },
  { name:"Claude Code in Action",               done:true, date:"MAY 2026" },
  { name:"AI Fluency: Framework & Foundations", done:true, date:"2026"     },
  { name:"Introduction to Claude Cowork",       done:true, date:"ABR 2026" },
];

// URLs de verificacion (mismo orden que CERTS). Dejar "#" si no disponible aun.
const CERT_URLS = [
  "https://verify.skilljar.com/c/mpu7g2csoxjy",  // Claude 101
  "https://verify.skilljar.com/c/um68gpivm9hh",  // Claude Code 101
  "https://verify.skilljar.com/c/docsi9w2chup",  // Claude Code in Action
  "https://verify.skilljar.com/c/ntbmgn8eb48h",  // AI Fluency: Framework & Foundations
  "https://verify.skilljar.com/c/f462y5dwjyb4",  // Introduction to Claude Cowork
];

/* ============================================================
   CURSOR — translate3d keeps movement on the compositor thread
   ============================================================ */
const cursor = document.getElementById("cursor");
const ring   = document.getElementById("cursor-ring");

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  // -4 = half of 8px dot; keeps it centered without layout reads
  cursor.style.transform = `translate3d(${mx - 4}px,${my - 4}px,0)`;
}, { passive: true });

(function rafRing() {
  rx += (mx - rx) * .11;
  ry += (my - ry) * .11;
  // -17 = half of 34px ring
  ring.style.transform = `translate3d(${rx - 17}px,${ry - 17}px,0)`;
  requestAnimationFrame(rafRing);
})();

document.querySelectorAll("a, button, .stat, .cert-card, .edu-card, .pill, .tl-proj, .tl-card, .case, .mini, .case-link, .gh-btn, .social-link").forEach(el => {
  el.addEventListener("mouseenter", () => { cursor.classList.add("big"); ring.classList.add("big"); });
  el.addEventListener("mouseleave", () => { cursor.classList.remove("big"); ring.classList.remove("big"); });
});

/* ============================================================
   NAV + SCROLL PROGRESS — one passive listener for both
   ============================================================ */
const nav       = document.getElementById("nav");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");
const scrollBar = document.getElementById("scroll-bar");

window.addEventListener("scroll", () => {
  const y   = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  nav.classList.toggle("scrolled", y > 40);
  scrollBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}, { passive: true });

hamburger.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
  hamburger.setAttribute("aria-label", open ? "Cerrar menu" : "Abrir menu");
});

// Cerrar el menu movil con Escape
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && mobileNav.classList.contains("open")) {
    mobileNav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.focus();
  }
});

document.querySelectorAll(".mob-link").forEach(l => l.addEventListener("click", () => {
  mobileNav.classList.remove("open");
  hamburger.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
}));

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
const code = document.getElementById("term-code");
const text = `{
  "name": "Santino Spingola",
  "role": "IA Aplicada / Automatizacion / Integraciones",
  "available": true,
  "location": "San Isidro, AR",
  "focus": [
    "LLMs en produccion",
    "CRM <-> ERP",
    "Sistemas de gestion"
  ],
  "github": "santinospingola"
}`;

let i = 0;
function type() {
  if (i >= text.length) return;
  code.textContent += text[i++];
  setTimeout(type, text[i - 1] === "\n" ? 55 : 20);
}
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  code.textContent = text;          // sin animacion: el texto ya esta
} else {
  setTimeout(type, 800);
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold:.08, rootMargin:"0px 0px -32px 0px" });

document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ============================================================
   STAT COUNTERS
   ============================================================ */
function countUp(el) {
  const target = +el.dataset.to;
  const dur = 1200, fps = 60;
  const inc = target / (dur / (1000 / fps));
  let cur = 0;
  const step = () => {
    cur += inc;
    if (cur >= target) { el.textContent = target; return; }
    el.textContent = Math.floor(cur);
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const aboutSec = document.getElementById("about");
const cntObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll(".stat-n").forEach(countUp);
    cntObs.disconnect();
  }
}, { threshold:.4 });
if (aboutSec) cntObs.observe(aboutSec);

/* ============================================================
   CERTIFICATIONS
   ============================================================ */
function buildCerts() {
  const grid  = document.getElementById("cert-grid");
  const bar   = document.getElementById("prog-bar");
  const count = document.getElementById("prog-count");
  if (!grid) return;

  const total = CERTS.length;
  const done  = CERTS.filter(c => c.done).length;
  if (count) count.textContent = `${done} / ${total}`;

  CERTS.forEach((c, i) => {
    const card = document.createElement("div");
    card.className = "cert-card reveal " + (c.done ? "done" : "pend");

    const url = CERT_URLS[i] || "#";
    card.innerHTML = c.done
      ? `<span class="cert-badge">✓ ANTHROPIC CERTIFIED</span>
         <p class="cert-name">${c.name}</p>
         <span class="cert-meta">Anthropic Academy · ${c.date || "2026"}</span>
         ${url !== "#"
           ? `<a href="${url}" class="cert-link" target="_blank" rel="noopener">VER CERTIFICADO →</a>`
           : `<span class="cert-link-na">Certificado disponible</span>`}`
      : `<p class="cert-name">${c.name}</p>
         <span class="cert-meta">Anthropic Academy · 2026</span>
         <span class="cert-pend">⧖ EN CURSO</span>`;

    grid.appendChild(card);
    io.observe(card); // reutiliza el mismo observer de scroll-reveal
  });

  // Animar la barra cuando la sección entra en vista
  const certSec = document.getElementById("certifications");
  if (bar && certSec) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) bar.style.width = (done / total * 100) + "%";
    }, { threshold:.25 }).observe(certSec);
  }
}
buildCerts();


/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(a => {
  a.addEventListener("click", e => {
    const t = document.querySelector(a.getAttribute("href"));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior:"smooth" }); }
  });
});
