async function load() {
  const { settings, archive } = await chrome.storage.local.get(["settings", "archive"]);
  const s = settings || {};

  document.getElementById("enabled").checked = s.enabled !== false;
  document.getElementById("status-label").textContent = s.enabled !== false ? "ON" : "OFF";
  document.getElementById("maxAge").value = s.maxAgeMinutes ?? 60;
  document.getElementById("action").value = s.action ?? "close";

  renderWhitelist(s.whitelist || []);

  const tabs = await chrome.tabs.query({});
  document.getElementById("tab-count").textContent = tabs.length;
  document.getElementById("archive-count").textContent = (archive || []).length;
}

async function save() {
  const { settings } = await chrome.storage.local.get("settings");
  const current = settings || {};
  const updated = {
    ...current,
    enabled: document.getElementById("enabled").checked,
    maxAgeMinutes: parseInt(document.getElementById("maxAge").value, 10) || 60,
    action: document.getElementById("action").value,
  };
  await chrome.storage.local.set({ settings: updated });
}

function renderWhitelist(list) {
  const container = document.getElementById("wl-tags");
  container.innerHTML = "";
  list.forEach(item => {
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.innerHTML = `${item} <span data-item="${item}">x</span>`;
    container.appendChild(tag);
  });
  container.querySelectorAll("span[data-item]").forEach(el => {
    el.addEventListener("click", async () => {
      const { settings } = await chrome.storage.local.get("settings");
      const wl = (settings?.whitelist || []).filter(x => x !== el.dataset.item);
      await chrome.storage.local.set({ settings: { ...settings, whitelist: wl } });
      renderWhitelist(wl);
    });
  });
}

document.getElementById("enabled").addEventListener("change", async (e) => {
  document.getElementById("status-label").textContent = e.target.checked ? "ON" : "OFF";
  await save();
});

document.getElementById("maxAge").addEventListener("change", save);
document.getElementById("action").addEventListener("change", save);

document.getElementById("wl-add").addEventListener("click", async () => {
  const input = document.getElementById("wl-input");
  let val = input.value.trim();
  if (!val) return;
  try { val = new URL(val).hostname; } catch { /* not a URL, use as-is */ }
  const { settings } = await chrome.storage.local.get("settings");
  const wl = [...new Set([...(settings?.whitelist || []), val])];
  await chrome.storage.local.set({ settings: { ...settings, whitelist: wl } });
  renderWhitelist(wl);
  input.value = "";
});

document.getElementById("wl-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("wl-add").click();
});

document.getElementById("run-now").addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ action: "runNow" });
  setTimeout(load, 500);
});

document.getElementById("clean-all").addEventListener("click", async () => {
  const btn = document.getElementById("clean-all");
  btn.textContent = "Cleaning...";
  const res = await chrome.runtime.sendMessage({ action: "cleanAll" });
  btn.textContent = res?.count > 0 ? `Done - closed ${res.count} tab(s)` : "Nothing to close";
  setTimeout(() => { btn.textContent = "Clean all (skip pinned & grouped)"; load(); }, 2500);
});

document.getElementById("show-archive").addEventListener("click", async () => {
  const section = document.getElementById("archive-section");
  section.classList.toggle("visible");
  if (section.classList.contains("visible")) renderArchive();
});

document.getElementById("clear-archive").addEventListener("click", async () => {
  await chrome.storage.local.set({ archive: [] });
  document.getElementById("archive-count").textContent = "0";
  renderArchive();
});

async function exportArchive(format) {
  const { archive } = await chrome.storage.local.get("archive");
  const items = archive || [];
  if (items.length === 0) return;

  let content, mime;
  if (format === "csv") {
    const esc = v => `"${String(v).replace(/"/g, '""')}"`;
    const pad = n => String(n).padStart(2, "0");
    // Local time, "YYYY-MM-DD HH:MM:SS" - recognized as a date by Excel / Sheets
    const fmt = ts => {
      if (!ts) return "";
      const d = new Date(ts);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    const lines = items.map(i => [i.title || "", i.url || "", fmt(i.archivedAt)].map(esc).join(","));
    // BOM so Excel reads UTF-8 (Polish characters) correctly
    content = "\uFEFF" + ["Title,URL,Archived At", ...lines].join("\r\n");
    mime = "text/csv;charset=utf-8";
  } else {
    const rows = items.map(i => ({
      title: i.title || "",
      url: i.url || "",
      archivedAt: i.archivedAt ? new Date(i.archivedAt).toISOString() : null,
    }));
    content = JSON.stringify(rows, null, 2);
    mime = "application/json";
  }

  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = `archived-tabs-${date}.${format}`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

document.getElementById("export-csv").addEventListener("click", () => exportArchive("csv"));
document.getElementById("export-json").addEventListener("click", () => exportArchive("json"));

async function renderArchive(filter = "") {
  const { archive } = await chrome.storage.local.get("archive");
  const list = document.getElementById("archive-list");
  const q = filter.toLowerCase();
  const items = (archive || []).slice().reverse().filter(item =>
    !q || item.title?.toLowerCase().includes(q) || item.url?.toLowerCase().includes(q)
  );
  if (items.length === 0) {
    list.innerHTML = '<div style="padding:10px 16px;color:#555;font-size:12px">No archived tabs</div>';
    return;
  }
  list.innerHTML = items.map(item => {
    const ago = timeAgo(item.archivedAt);
    const icon = item.favIconUrl
      ? `<img src="${item.favIconUrl}" onerror="this.style.display='none'">`
      : "";
    return `<div class="archive-item">
      ${icon}
      <a href="${item.url}" target="_blank" title="${item.url}">${item.title || item.url}</a>
      <span class="time">${ago}</span>
    </div>`;
  }).join("");
}

document.getElementById("archive-search").addEventListener("input", (e) => {
  renderArchive(e.target.value);
});

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

load();
