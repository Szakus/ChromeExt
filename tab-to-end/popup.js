async function load() {
  const { settings } = await chrome.storage.local.get("settings");
  const enabled = settings?.enabled !== false;

  document.getElementById("enabled").checked = enabled;
  document.getElementById("status-label").textContent = enabled ? "ON" : "OFF";

  const tabs = await chrome.tabs.query({});
  document.getElementById("tab-count").textContent = tabs.length;
  document.getElementById("pinned-count").textContent = tabs.filter(t => t.pinned).length;
}

document.getElementById("enabled").addEventListener("change", async (e) => {
  document.getElementById("status-label").textContent = e.target.checked ? "ON" : "OFF";
  const { settings } = await chrome.storage.local.get("settings");
  await chrome.storage.local.set({ settings: { ...settings, enabled: e.target.checked } });
});

load();
