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

  chrome.scripting.executeScript({
    target: { tabId },
    func: injectAll,
    args: [s.buckets || [], s.sprints || []]
  }).catch(() => {});
}

function injectAll(buckets, sprints) {
  const BUCKETS = Array.isArray(buckets) && buckets.length ? buckets : [];
  const SPRINTS = Array.isArray(sprints) && sprints.length ? sprints : [];

  const CAT_COLORS = {
    SmallChanges: '#2e7d52',
    RUN:          '#c17d00',
    CFO:          '#0052cc',
    Other:        '#5e3a8c',
    '-':          '#555',
  };

  function setupForm() {
    const oe = document.getElementById("customfield_29709");
    if (!oe) return;
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
          if (p3.dataset.icon) {
            const img = document.querySelector("#priority-single-select .aui-ss-entity-icon");
            if (img) img.src = p3.dataset.icon;
          }
        }
      }
    }

    injectEpicHelper();
    injectSprintHelper();
    injectStoryPointsHelper();
  }

  function injectEpicHelper() {
    const hiddenSelect = document.getElementById('customfield_16101');
    if (!hiddenSelect || hiddenSelect.__epicHelperDone) return;
    hiddenSelect.__epicHelperDone = true;
    const label = document.querySelector('label[for="customfield_16101-field"]');
    if (!label) return;

    const btn = document.createElement('a');
    btn.textContent = 'Moje Epicki ▾';
    btn.className = 'aui-button aui-button-link';
    btn.style.cssText = 'margin-left:10px;vertical-align:middle;';

    const popup = document.createElement('div');
    popup.style.cssText = [
      'display:none', 'position:fixed', 'z-index:99999',
      'background:#1a1a2e', 'border:1px solid #0f3460', 'border-radius:6px',
      'box-shadow:0 4px 20px rgba(0,0,0,.5)', 'min-width:640px',
      'max-height:420px', 'overflow-y:auto', 'font-family:system-ui,sans-serif',
    ].join(';');

    const header = document.createElement('div');
    header.style.cssText = [
      'display:flex', 'justify-content:space-between', 'align-items:center',
      'padding:10px 14px', 'background:#16213e',
      'border-bottom:1px solid #0f3460', 'border-radius:6px 6px 0 0',
      'position:sticky', 'top:0',
    ].join(';');
    header.innerHTML = `
      <span style="font-size:13px;font-weight:600;color:#fff;">Moje Epicki - BTMEUR Buckets</span>
      <span style="color:#888;cursor:pointer;font-size:16px;line-height:1;" id="__epic-close">&#x2715;</span>
    `;
    popup.appendChild(header);

    const hint = document.createElement('div');
    hint.style.cssText = 'padding:5px 14px;font-size:11px;color:#555;border-bottom:1px solid #0f3460;';
    hint.textContent = 'Kliknij wiersz aby skopiowac numer epica';
    popup.appendChild(hint);

    const table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;font-size:12px;';
    table.innerHTML = `<thead><tr style="background:#0f3460;">
      <th style="padding:6px 10px;text-align:left;color:#888;font-weight:normal;font-size:10px;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;">Kategoria</th>
      <th style="padding:6px 10px;text-align:left;color:#888;font-weight:normal;font-size:10px;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;">Epic</th>
      <th style="padding:6px 10px;text-align:left;color:#888;font-weight:normal;font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Nazwa</th>
      <th style="padding:6px 10px;text-align:left;color:#888;font-weight:normal;font-size:10px;text-transform:uppercase;letter-spacing:.5px;">Opis</th>
    </tr></thead>`;

    const tbody = document.createElement('tbody');
    BUCKETS.forEach((b, i) => {
      const tr = document.createElement('tr');
      const bg = i % 2 === 0 ? '#1a1a2e' : '#16213e';
      tr.style.cssText = `cursor:pointer;background:${bg};transition:background .1s;`;
      tr.onmouseenter = () => { tr.style.background = '#0f3460'; };
      tr.onmouseleave = () => { tr.style.background = bg; };

      const color = CAT_COLORS[b.cat] || '#555';
      const epicCell = document.createElement('td');
      epicCell.style.cssText = 'padding:7px 10px;color:#4fc3f7;font-weight:700;white-space:nowrap;';
      epicCell.textContent = b.epic;

      tr.innerHTML = `
        <td style="padding:7px 10px;">
          <span style="background:${color};color:#fff;padding:2px 7px;border-radius:3px;font-size:10px;white-space:nowrap;">${b.cat}</span>
        </td>
        <td style="padding:7px 10px;color:#4fc3f7;font-weight:700;white-space:nowrap;">${b.epic}</td>
        <td style="padding:7px 10px;color:#e0e0e0;">${b.name}</td>
        <td style="padding:7px 10px;color:#888;font-size:11px;">${b.desc}</td>
      `;

      tr.addEventListener('click', () => {
        const field = document.getElementById('customfield_16101-field');
        if (!field) {
          navigator.clipboard.writeText(b.epic);
          return;
        }

        popup.style.display = 'none';
        field.value = b.epic;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        field.focus();

        // poll for the suggestion with matching epic key and click it
        let attempts = 0;
        const timer = setInterval(() => {
          attempts++;
          const links = document.querySelectorAll('#customfield_16101-suggestions a[role="option"]');
          for (const link of links) {
            if (link.textContent.includes(b.epic)) {
              link.click();
              clearInterval(timer);
              return;
            }
          }
          if (attempts > 30) clearInterval(timer);
        }, 100);
      });

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    popup.appendChild(table);
    document.body.appendChild(popup);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (popup.style.display !== 'none') {
        popup.style.display = 'none';
        return;
      }
      popup.style.display = 'block';
      const rect = btn.getBoundingClientRect();
      const popupW = 640;
      const popupH = popup.offsetHeight;
      let left = rect.left;
      if (left + popupW > window.innerWidth - 10) left = window.innerWidth - popupW - 10;
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const top = spaceBelow >= popupH ? rect.bottom + 4 : rect.top - popupH - 4;
      popup.style.left = Math.max(0, left) + 'px';
      popup.style.top = Math.max(0, top) + 'px';
    });

    popup.querySelector('#__epic-close').addEventListener('click', (e) => {
      e.stopPropagation();
      popup.style.display = 'none';
    });

    document.addEventListener('click', (e) => {
      if (!popup.contains(e.target) && e.target !== btn) popup.style.display = 'none';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') popup.style.display = 'none';
    });

    // Insert after the hidden select, same pattern as "Assign to me" button
    hiddenSelect.insertAdjacentElement('afterend', btn);
  }

  function injectSprintHelper() {
    if (!SPRINTS.length) return;
    const hiddenSelect = document.getElementById('customfield_16100');
    if (!hiddenSelect || hiddenSelect.__sprintHelperDone) return;
    hiddenSelect.__sprintHelperDone = true;

    const wrap = document.createElement('span');
    wrap.style.cssText = 'margin-left:8px;vertical-align:middle;';

    SPRINTS.forEach(sprint => {
      const btn = document.createElement('a');
      btn.className = 'aui-button aui-button-link';
      btn.style.cssText = 'margin-right:6px;';
      btn.textContent = sprint;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const field = document.getElementById('customfield_16100-field');
        if (!field) return;
        field.value = sprint;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        field.focus();

        let attempts = 0;
        const timer = setInterval(() => {
          attempts++;
          const links = document.querySelectorAll('#customfield_16100-suggestions a[role="option"]');
          for (const link of links) {
            if (link.textContent.trim().startsWith(sprint)) {
              link.click();
              clearInterval(timer);
              return;
            }
          }
          if (attempts > 30) clearInterval(timer);
        }, 100);
      });

      wrap.appendChild(btn);
    });

    hiddenSelect.insertAdjacentElement('afterend', wrap);
  }

  function injectStoryPointsHelper() {
    const field = document.getElementById('customfield_46343');
    if (!field || field.__spHelperDone) return;
    field.__spHelperDone = true;

    const wrap = document.createElement('span');
    wrap.style.cssText = 'margin-left:8px;vertical-align:middle;';

    [['XS', 1], ['S', 2], ['M', 3], ['L', 5], ['XL', 8]].forEach(([label, val]) => {
      const btn = document.createElement('a');
      btn.className = 'aui-button aui-button-link';
      btn.style.cssText = 'margin-right:4px;';
      btn.textContent = label;
      btn.title = val;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        field.value = val;
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });
      wrap.appendChild(btn);
    });

    field.insertAdjacentElement('afterend', wrap);
  }

  // Run immediately if form already in DOM
  if (document.getElementById("customfield_29709")) setupForm();

  // MutationObserver for AJAX dialogs
  if (window.__jiraStylerObserver) return;
  window.__jiraStylerObserver = true;

  new MutationObserver(() => {
    const oe = document.getElementById("customfield_29709");
    if (!oe || oe.__jiraStylerDone) return;
    setupForm();
  }).observe(document.body, { childList: true, subtree: true });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.startsWith("http")) {
    injectStyles(tabId, tab.url);
  }
});
