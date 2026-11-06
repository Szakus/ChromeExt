async function getSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  return settings || {};
}

async function injectStyles(tabId, url) {
  const s = await getSettings();
  if (!s.enabled || !s.domain || !s.domain.trim()) return;

  const domain = s.domain.trim().toLowerCase();
  if (!url.toLowerCase().includes(domain)) return;

  const isCreateIssue = url.includes("/secure/CreateIssue");

  const css = [s.cssGlobal || "", isCreateIssue ? (s.cssCreate || "") : ""]
    .join("\n")
    .trim();

  if (!css) return;

  chrome.scripting.insertCSS({ target: { tabId }, css }).catch(() => {});
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.startsWith("http")) {
    injectStyles(tabId, tab.url);
  }
});
