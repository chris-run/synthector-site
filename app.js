/* Synthector — minimal JS:
   - theme toggle (persisted)
   - intersection reveal
   - copy buttons for code blocks
   - mailto composer for pilot form
*/

(function () {
  const root = document.documentElement;

  // ---------- Theme ----------
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "synthector_theme";

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}

    // Update button aria label
    if (themeToggle) {
      const isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }

    // Update theme-color for mobile browser chrome
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "light" ? "#F7F8FA" : "#070A0D");
    }
  }

  function getInitialTheme() {
    // Dark-mode default per requirements
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (_) {}
    return "dark";
  }

  setTheme(getInitialTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // ---------- Reveal on scroll ----------
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { root: null, threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ---------- Copy buttons ----------
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
    if (!wrap) return;

    const code = wrap.querySelector("pre code");
    if (!code) return;

    const text = code.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(btn, true);
    } catch (_) {
      // Fallback: select text
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

  // ---------- Pilot form -> mailto ----------
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
      const lines = [
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
        "Thanks,"
      ];

      const body = lines.join("\n");
      const mailto = `mailto:${encodeURIComponent(TO)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Attempt to open the user's mail client
      try {
        window.location.href = mailto;
      } catch (_) {
        if (fallback) fallback.hidden = false;
      }

      // If the browser blocks, show fallback note after a short delay
      setTimeout(() => {
        if (fallback) fallback.hidden = false;
      }, 800);
    });
  }
})();
