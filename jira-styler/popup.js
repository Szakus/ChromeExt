async function load() {
  const { settings } = await chrome.storage.local.get("settings");
  const s = settings || {};

  const enabled = s.enabled !== false;
  document.getElementById("enabled").checked = enabled;
  document.getElementById("status-label").textContent = enabled ? "ON" : "OFF";
  document.getElementById("domain").value = s.domain || "";
  document.getElementById("cssGlobal").value = s.cssGlobal ?? DEFAULT_CSS_GLOBAL;
  document.getElementById("cssCreate").value = s.cssCreate ?? DEFAULT_CSS_CREATE;
}

async function save(silent = false) {
  const { settings } = await chrome.storage.local.get("settings");
  const updated = {
    ...(settings || {}),
    enabled: document.getElementById("enabled").checked,
    domain: document.getElementById("domain").value.trim(),
    cssGlobal: document.getElementById("cssGlobal").value,
    cssCreate: document.getElementById("cssCreate").value,
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
