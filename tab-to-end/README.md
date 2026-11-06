# Tab to End

Moves tabs opened from pinned tabs to the end of the tab strip.

By default Chrome opens a link next to the tab it came from. When that tab is pinned, the new tab lands right after the pinned group, at the start of the strip. This extension moves it to the end instead.

## Installation

See the [general installation steps](../README.md#installation) and select the `tab-to-end` folder.

Permissions used: `tabs`, `storage`.

## Usage

Click the extension icon to open the popup.

- **ON / OFF toggle** - enables or disables the behavior; saved immediately
- **Open tabs / Pinned tabs** - number of open and pinned tabs across all windows

## Behavior

- Applies to every tab that has an opener tab which is **pinned** (e.g. Ctrl/Cmd+click, middle-click or a link opening in a new tab)
- The new tab is moved to the last position in its window
- Tabs opened from regular (unpinned) tabs and tabs created manually (Ctrl/Cmd+T) are not affected
