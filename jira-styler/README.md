# Jira Styler

Injects custom CSS into your Jira instance and adds helper buttons to the Create Issue form (epic picker, sprint buttons, story point sizes).

> Built for a specific Jira Server / Data Center setup: the default CSS and the form helpers rely on that instance's custom field IDs. On another Jira they may do nothing until the IDs are adjusted in `background.js`.

## Installation

See the [general installation steps](../README.md#installation) and select the `jira-styler` folder.

Permissions used: `tabs`, `storage`, `scripting`, `activeTab` and host access to all sites (`*://*/*`) - needed to inject into whatever domain you configure.

## Configuration

Click the extension icon to open the popup. Changes are saved with **Save**; reload Jira tabs to apply them.

| Field | Description |
|---|---|
| **ON / OFF toggle** | Enables or disables injection (saved immediately) |
| **Jira domain** | e.g. `jira.yourcompany.net`. Nothing is injected until this is set; injection happens on every page whose URL contains this text |

### Tabs

| Tab | Description |
|---|---|
| **Global CSS** | CSS applied on every page of the Jira domain |
| **Create Issue CSS** | CSS applied additionally on `/secure/CreateIssue` pages |
| **Epicki** | JSON array of epics shown in the *Moje Epicki* picker (see below) |
| **Sprinty** | One sprint name per line; each becomes a quick-pick button |

**Reset to defaults** restores both CSS tabs to the built-in defaults (`defaults.js`). Epics and sprints are left untouched.

### Epics JSON

```json
[
  { "cat": "RUN", "epic": "PROJ-123", "name": "Maintenance", "desc": "Bugs and small fixes" },
  { "cat": "SmallChanges", "epic": "PROJ-456", "name": "Small changes", "desc": "" }
]
```

- `cat` - category badge; `SmallChanges`, `RUN`, `CFO`, `Other` and `-` have their own colors, anything else is grey
- `epic` - epic issue key filled into the Epic Link field
- `name`, `desc` - shown in the picker table

Invalid JSON is reported under the text area and the settings are not saved.

## Create Issue helpers

Added to the Create Issue form, both on the full page and in the AJAX dialog:

- **Moje Epicki ▾** - next to the Epic Link field; opens a table of your epics. Clicking a row fills the Epic Link field and selects the matching suggestion (if the field is missing, the key is copied to the clipboard). Close with ✕, Esc or a click outside.
- **Sprint buttons** - next to the Sprint field, one per configured sprint; clicking one types it and picks the first suggestion that starts with that name
- **Story point sizes** - `XS`, `S`, `M`, `L`, `XL` set the field to 1, 2, 3, 5, 8
- **Defaults** - fills an instance-specific custom field (`customfield_29709`) with a fixed value and sets Priority to *P3 Medium* when nothing else is selected
