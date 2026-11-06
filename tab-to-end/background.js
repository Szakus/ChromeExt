chrome.tabs.onCreated.addListener(async (tab) => {
  const { settings } = await chrome.storage.local.get("settings");
  if (settings?.enabled === false) return;
  if (!tab.openerTabId) return;

  const opener = await chrome.tabs.get(tab.openerTabId).catch(() => null);
  if (!opener?.pinned) return;

  const allTabs = await chrome.tabs.query({ windowId: tab.windowId });
  chrome.tabs.move(tab.id, { index: allTabs.length - 1 });
});
