async function load() {
  const { settings } = await chrome.storage.local.get("settings");
  const s = settings || {};

  const enabled = s.enabled !== false;
  document.getElementById("enabled").checked = enabled;
  document.getElementById("status-label").textContent = enabled ? "ON" : "OFF";
  document.getElementById("domain").value = s.domain || "";
  document.getElementById("cssGlobal").value = s.cssGlobal ?? DEFAULT_CSS_GLOBAL;
  document.getElementById("cssCreate").value = s.cssCreate ?? DEFAULT_CSS_CREATE;
  document.getElementById("bucketsJson").value = s.buckets ? JSON.stringify(s.buckets, null, 2) : "";
  document.getElementById("sprintsText").value = (s.sprints || []).join("\n");
}

async function save(silent = false) {
  const { settings } = await chrome.storage.local.get("settings");

  let buckets = (settings || {}).buckets || [];
  const raw = document.getElementById("bucketsJson").value.trim();
  const errEl = document.getElementById("buckets-error");
  if (raw) {
    try {
      buckets = JSON.parse(raw);
      if (!Array.isArray(buckets)) throw new Error("Must be a JSON array");
      errEl.textContent = "";
    } catch (e) {
      errEl.textContent = "JSON error: " + e.message;
      if (!silent) return;
    }
  } else {
    buckets = [];
    if (errEl) errEl.textContent = "";
  }

  const updated = {
    ...(settings || {}),
    enabled: document.getElementById("enabled").checked,
    domain: document.getElementById("domain").value.trim(),
    cssGlobal: document.getElementById("cssGlobal").value,
    cssCreate: document.getElementById("cssCreate").value,
    buckets,
    sprints: document.getElementById("sprintsText").value
      .split("\n").map(s => s.trim()).filter(Boolean),
  };
  await chrome.storage.local.set({ settings: updated });

  if (!silent) {
    const el = document.getElementById("save-status");
    el.textContent = "Saved. Reload Jira tabs to apply.";
    setTimeout(() => { el.textContent = ""; }, 3000);
  }
}

document.getElementById("enabled").addEventListener("change", async (e) => {
  document.getElementById("status-label").textContent = e.target.checked ? "ON" : "OFF";
  await save(true);
});

document.getElementById("btn-save").addEventListener("click", () => save());

document.getElementById("btn-reset").addEventListener("click", async () => {
  document.getElementById("cssGlobal").value = DEFAULT_CSS_GLOBAL;
  document.getElementById("cssCreate").value = DEFAULT_CSS_CREATE;
  await save();
});

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  });
});

load();
