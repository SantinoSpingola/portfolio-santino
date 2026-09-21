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

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   INTRO — el logo sube y la lista gira a su lugar
   ============================================================ */
setTimeout(() => document.body.classList.remove("intro"), 150);

/* ============================================================
   CERTIFICACIONES
   ============================================================ */
(function buildCerts() {
  const list = document.getElementById("cert-list");
  if (!list) return;
  CERTS.forEach((c, i) => {
    const li  = document.createElement("li");
    const url = CERT_URLS[i] || "#";
    const label = `${c.name} <span class="date">${c.done ? c.date || "2026" : "en curso"}</span>`;
    li.innerHTML = c.done && url !== "#"
      ? `<a class="u" href="${url}" target="_blank" rel="noopener">${label}</a>`
      : label;
    list.appendChild(li);
  });
})();

/* ============================================================
   MODOS DE COLOR — ultra · night · light
   ============================================================ */
const THEME_COLORS = { ultra:"#4801FF", night:"#000000", light:"#F2F2F2" };
const modeBtns = document.querySelectorAll(".mode");

function setMode(mode) {
  const root = document.documentElement;
  if (mode === "ultra") delete root.dataset.mode; else root.dataset.mode = mode;
  modeBtns.forEach(b => {
    const on = b.dataset.mode === mode;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", String(on));
  });
  document.getElementById("theme-color").setAttribute("content", THEME_COLORS[mode]);
  try { localStorage.setItem("color-mode", mode); } catch (e) {}
}
setMode(document.documentElement.dataset.mode || "ultra");
modeBtns.forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));

/* ============================================================
   PERSPECTIVA — el punto de fuga sigue al centro de la pantalla,
   así cada título se deforma distinto según dónde esté
   ============================================================ */
const stage = document.getElementById("work");
let ticking = false;
function updatePerspective() {
  const y = window.scrollY + window.innerHeight * .5 - stage.offsetTop;
  stage.style.setProperty("--po-y", `${Math.round(y)}px`);
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updatePerspective); }
}, { passive:true });
window.addEventListener("resize", updatePerspective);
updatePerspective();

/* ============================================================
   HOVER — marca la lista para que el título activo quede en contorno
   ============================================================ */
const projects = document.getElementById("projects");
projects.querySelectorAll(".project").forEach(li => {
  li.addEventListener("mouseenter", () => projects.classList.add("is-hovering"));
  li.addEventListener("mouseleave", () => projects.classList.remove("is-hovering"));
});

/* ============================================================
   PANEL — sobre mí y casos, con deep link por hash
   ============================================================ */
const panel    = document.getElementById("panel");
const sheets   = [...panel.querySelectorAll(".sheet")];
const navLinks = panel.querySelectorAll(".panel-nav a");
let lastTrigger = null;

// "#contacto" vive dentro de "sobre mí": se abre la hoja y se scrollea al bloque
function resolve(hash) {
  const id = (hash || "").replace(/^#/, "");
  if (!id) return null;
  const target = document.getElementById(id);
  const sheet  = target && target.closest(".sheet");
  return sheet ? { sheet, target } : null;
}

function openPanel(hash, { push = true } = {}) {
  const found = resolve(hash);
  if (!found) return;
  sheets.forEach(s => s.classList.toggle("is-active", s === found.sheet));
  panel.setAttribute("aria-label", found.sheet.dataset.title || "Detalle");
  navLinks.forEach(a => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${found.target.id}`)));
  document.body.classList.add("panel-open");

  if (found.target !== found.sheet) {
    requestAnimationFrame(() => {
      const top = found.target.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
      panel.scrollTo({ top: top - 140, behavior: reduceMotion ? "auto" : "smooth" });
    });
  } else {
    panel.scrollTop = 0;
  }
  if (push && location.hash !== hash) history.pushState(null, "", hash);
  document.getElementById("panel-close").focus({ preventScroll:true });
}

function closePanel({ push = true } = {}) {
  if (!document.body.classList.contains("panel-open")) return;
  document.body.classList.remove("panel-open");
  projects.querySelectorAll(".is-selected").forEach(li => li.classList.remove("is-selected"));
  if (push && location.hash) history.pushState(null, "", location.pathname + location.search);
  if (lastTrigger) { lastTrigger.focus({ preventScroll:true }); lastTrigger = null; }
}

// Cualquier link interno que apunte a una hoja abre el panel.
// Desde la lista grande, el título gira de frente antes de abrir.
document.addEventListener("click", e => {
  // Con el giro 3D el click suele caer en el <li> y no en el link: toda la fila cuenta
  const row = e.target.closest(".project");
  const a = row ? row.querySelector("a") : e.target.closest('a[href^="#"]');
  if (!a || !resolve(a.getAttribute("href"))) return;
  e.preventDefault();
  if (!document.body.classList.contains("panel-open")) lastTrigger = a;

  const li = a.closest(".project");
  if (li) {
    li.classList.add("is-selected");
    setTimeout(() => openPanel(a.getAttribute("href")), reduceMotion ? 0 : 450);
  } else {
    openPanel(a.getAttribute("href"));
  }
});

panel.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", e => {
  e.preventDefault();
  closePanel();
}));

document.getElementById("logo").addEventListener("click", e => {
  e.preventDefault();
  window.scrollTo({ top:0, behavior: reduceMotion ? "auto" : "smooth" });
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closePanel();
});

window.addEventListener("popstate", () => {
  if (resolve(location.hash)) openPanel(location.hash, { push:false });
  else closePanel({ push:false });
});

// Deep link: se abre después del load para que el salto nativo al ancla no mueva el panel
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (resolve(location.hash)) {
  openPanel(location.hash, { push:false });
  window.addEventListener("load", () => setTimeout(() => {
    window.scrollTo(0, 0);
    openPanel(location.hash, { push:false });
  }, 0));
}
