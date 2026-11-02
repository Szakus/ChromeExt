const ALARM_NAME = "tab-cleaner-check";
const CHECK_INTERVAL_MINUTES = 5;

const DEFAULTS = {
  maxAgeMinutes: 360,
  action: "archive",    // "close" | "archive"
  whitelist: [],        // URL patterns to never touch
  enabled: true
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("settings", ({ settings }) => {
    if (!settings) {
      chrome.storage.local.set({ settings: DEFAULTS, archive: [] });
    }
  });
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: CHECK_INTERVAL_MINUTES });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) runCleaner();
});

async function runCleaner() {
  const { settings, archive } = await chrome.storage.local.get(["settings", "archive"]);
  if (!settings?.enabled) return;

  const { maxAgeMinutes, action, whitelist } = settings;
  const cutoff = Date.now() - maxAgeMinutes * 60 * 1000;

  const tabs = await chrome.tabs.query({});
  const allWindows = await chrome.windows.getAll({ populate: false });
  const activeTabIds = new Set();

  for (const win of allWindows) {
    const [active] = await chrome.tabs.query({ windowId: win.id, active: true });
    if (active) activeTabIds.add(active.id);
  }

  const toProcess = tabs.filter(tab => {
    if (tab.pinned) return false;
    if (tab.groupId !== chrome.tabGroups?.TAB_GROUP_ID_NONE && tab.groupId !== undefined && tab.groupId !== -1) return false;
    if (activeTabIds.has(tab.id)) return false;
    if (!tab.url || tab.url.startsWith("chrome") || tab.url.startsWith("brave")) return false;
    if (isWhitelisted(tab.url, whitelist)) return false;
    return true;
  });

  const { tabLastSeen } = await chrome.storage.local.get("tabLastSeen");
  const seen = tabLastSeen || {};
  const now = Date.now();

  const stale = toProcess.filter(tab => {
    const last = seen[tab.id] || tab.lastAccessed || 0;
    return last < cutoff;
  });

  if (stale.length === 0) return;

  if (action === "archive") {
    const entries = stale.map(tab => ({
      id: tab.id,
      url: tab.url,
      title: tab.title,
      favIconUrl: tab.favIconUrl,
      archivedAt: now
    }));
    const updated = [...(archive || []), ...entries].slice(-500); // keep last 500
    await chrome.storage.local.set({ archive: updated });
  }

  const ids = stale.map(t => t.id);
  await chrome.tabs.remove(ids);

  // cleanup seen map
  for (const id of ids) delete seen[id];
  await chrome.storage.local.set({ tabLastSeen: seen });

  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: "Tab Cleaner",
    message: `${action === "archive" ? "Archived" : "Closed"} ${stale.length} inactive tab(s)`
  });
}

// track last activity per tab
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const { tabLastSeen } = await chrome.storage.local.get("tabLastSeen");
  const seen = tabLastSeen || {};
  seen[tabId] = Date.now();
  await chrome.storage.local.set({ tabLastSeen: seen });
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const { tabLastSeen } = await chrome.storage.local.get("tabLastSeen");
  const seen = tabLastSeen || {};
  delete seen[tabId];
  await chrome.storage.local.set({ tabLastSeen: seen });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === "runNow") {
    runCleaner().then(() => sendResponse({ ok: true }));
    return true;
  }
  if (msg.action === "cleanAll") {
    cleanAll().then(sendResponse);
    return true;
  }
});

async function cleanAll() {
  const { settings, archive } = await chrome.storage.local.get(["settings", "archive"]);
  const action = settings?.action ?? "archive";
  const whitelist = settings?.whitelist ?? [];

  const tabs = await chrome.tabs.query({});
  const activeTabIds = new Set();
  const allWindows = await chrome.windows.getAll({ populate: false });
  for (const win of allWindows) {
    const [active] = await chrome.tabs.query({ windowId: win.id, active: true });
    if (active) activeTabIds.add(active.id);
  }

  const candidates = tabs.filter(tab => {
    if (tab.pinned) return false;
    if (tab.groupId !== undefined && tab.groupId !== -1) return false;
    if (activeTabIds.has(tab.id)) return false;
    if (!tab.url || tab.url.startsWith("chrome") || tab.url.startsWith("brave")) return false;
    if (isWhitelisted(tab.url, whitelist)) return false;
    return true;
  });

  if (candidates.length === 0) return { count: 0 };

  if (action === "archive") {
    const now = Date.now();
    const entries = candidates.map(tab => ({
      url: tab.url, title: tab.title, favIconUrl: tab.favIconUrl, archivedAt: now
    }));
    const updated = [...(archive || []), ...entries].slice(-500);
    await chrome.storage.local.set({ archive: updated });
  }

  await chrome.tabs.remove(candidates.map(t => t.id));
  return { count: candidates.length };
}

function isWhitelisted(url, patterns) {
  return patterns.some(p => {
    try { return new URL(url).hostname.includes(p); } catch { return false; }
  });
}
