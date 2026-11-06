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

  if (css) {
    chrome.scripting.insertCSS({ target: { tabId }, css }).catch(() => {});
  }

  if (isCreateIssue) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: applyCreateIssueDefaults
    }).catch(() => {});
  }

  // inject MutationObserver on every Jira page to handle AJAX dialogs
  chrome.scripting.executeScript({
    target: { tabId },
    func: injectObserver
  }).catch(() => {});
}

function applyCreateIssueDefaults() {
  // Raised by OE -> Poland
  const oe = document.getElementById("customfield_29709");
  if (oe && !oe.value) oe.value = "141573";

  // Priority -> P3 Medium (AUI single-select, hidden <select multiple>)
  const prio = document.getElementById("priority");
  if (prio) {
    const hasSelection = Array.from(prio.options).some(o => o.selected && o.value !== "10300");
    if (!hasSelection) {
      const p3 = Array.from(prio.options).find(o => o.text.trim() === "P3 Medium");
      if (p3) {
        p3.selected = true;
        prio.dispatchEvent(new Event("change", { bubbles: true }));
        const field = document.getElementById("priority-field");
        if (field) field.value = "P3 Medium";
        const icon = p3.dataset.icon;
        if (icon) {
          const img = document.querySelector("#priority-single-select .aui-ss-entity-icon");
          if (img) img.src = icon;
        }
      }
    }
  }
}

function injectObserver() {
  if (window.__jiraStylerObserver) return;
  window.__jiraStylerObserver = true;

  const observer = new MutationObserver(() => {
    const oe = document.getElementById("customfield_29709");
    if (!oe || oe.__jiraStylerDone) return;
    oe.__jiraStylerDone = true;

    if (!oe.value) oe.value = "141573";

    const prio = document.getElementById("priority");
    if (prio) {
      const hasSelection = Array.from(prio.options).some(o => o.selected && o.value !== "10300");
      if (!hasSelection) {
        const p3 = Array.from(prio.options).find(o => o.text.trim() === "P3 Medium");
        if (p3) {
          p3.selected = true;
          prio.dispatchEvent(new Event("change", { bubbles: true }));
          const field = document.getElementById("priority-field");
          if (field) field.value = "P3 Medium";
          const icon = p3.dataset.icon;
          if (icon) {
            const img = document.querySelector("#priority-single-select .aui-ss-entity-icon");
            if (img) img.src = icon;
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.startsWith("http")) {
    injectStyles(tabId, tab.url);
  }
});
