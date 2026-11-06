# Chrome Extensions

A collection of small Chrome extensions (Manifest V3). Each one lives in its own folder and is installed separately.

## Extensions

| Extension | Description |
|---|---|
| [Auto Tab Cleaner](auto-tab-cleaner/README.md) | Closes or archives tabs that have been inactive for a configurable time; whitelist, searchable archive and CSV/JSON export. |
| [Tab to End](tab-to-end/README.md) | Moves tabs opened from pinned tabs to the end of the tab strip instead of next to the pinned group. |
| [Jira Styler](jira-styler/README.md) | Injects custom CSS into your Jira instance and adds Create Issue helpers: epic picker, sprint buttons and story point sizes. |

## Installation

The extensions are not published in the Chrome Web Store - load them as unpacked extensions:

1. Get the code - download the extension's ZIP from the [latest release](https://github.com/Szakus/ChromeExt/releases/latest) and unzip it, or `git clone` this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the folder of the extension you want (e.g. `auto-tab-cleaner`) - not the repository root
6. Pin the extension icon in the toolbar for easy access

Repeat steps 4-6 for each extension. To update one, replace its folder with the new version (or `git pull`) and click the reload icon on its card in `chrome://extensions/`. Keep the same folder path: an unpacked extension loaded from a different folder gets a new ID and starts with empty settings and data.

> Chrome may show a warning about Developer mode extensions on startup - this is normal for manually installed extensions.

Usage and settings of each extension are described in its own README (links above).
