/* Synthector v2 — minimal JS:
   - theme toggle (persisted)
   - reveal on scroll
   - copy buttons
   - mailto composer
   - close mobile menu after click
*/

(function () {
  const root = document.documentElement;

  // ---- Theme toggle ----
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "synthector_theme";

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}

    if (themeToggle) {
      const isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", theme === "light" ? "#F7F8FA" : "#070A0D");
  }

  function initialTheme() {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (_) {}
    return "dark"; // requirement: dark default
  }

  setTheme(initialTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const cur = root.getAttribute("data-theme") || "dark";
      setTheme(cur === "dark" ? "light" : "dark");
    });
  }

  // ---- Reveal on scroll ----
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.16 });

    revealEls.forEach(el => io.observe(el));
  }

  // ---- Copy buttons ----
  function setCopyState(btn, ok) {
    const original = btn.textContent;
    btn.textContent = ok ? "Copied" : "Copy failed";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 900);
  }

  document.addEventListener("click", async (ev) => {
    const btn = ev.target.closest(".copy-btn");
    if (!btn) return;

    const wrap = btn.closest("[data-copy-surface]");
    const code = wrap ? wrap.querySelector("pre code") : null;
    if (!code) return;

    const text = code.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(btn, true);
    } catch (_) {
      try {
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        const success = document.execCommand("copy");
        sel.removeAllRanges();
        setCopyState(btn, success);
      } catch (e2) {
        setCopyState(btn, false);
      }
    }
  });

  // ---- Pilot form -> mailto ----
  const form = document.getElementById("pilotForm");
  const fallback = document.getElementById("mailtoFallback");
  const TO = "Synthector@gmail.com";

  function val(id) {
    const el = document.getElementById(id);
    return el ? String(el.value || "").trim() : "";
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = val("name");
      const email = val("email");
      const company = val("company");
      const system = val("system");
      const notes = val("notes");

      const subject = "Synthector pilot request";
      const body = [
        "Hi Christopher,",
        "",
        "I'd like to request pilot access to Synthector.",
        "",
        `Name: ${name || "-"}`,
        `Company: ${company || "-"}`,
        `Email: ${email || "-"}`,
        `Integrating with: ${system || "-"}`,
        "",
        "Context / requirements:",
        notes || "-",
        "",
        "Thanks,",
      ].join("\n");

      const mailto = `mailto:${encodeURIComponent(TO)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      try { window.location.href = mailto; } catch (_) {
        if (fallback) fallback.hidden = false;
      }

      setTimeout(() => {
        if (fallback) fallback.hidden = false;
      }, 800);
    });
  }

  // ---- Close mobile menu when selecting a link ----
  document.addEventListener("click", (ev) => {
    const link = ev.target.closest(".nav-panel a");
    if (!link) return;

    const details = ev.target.closest("details");
    if (details && details.open) details.open = false;
  });
})();
