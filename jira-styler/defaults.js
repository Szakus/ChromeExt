const DEFAULT_CSS_GLOBAL = `/* Applied on all pages of your Jira domain */
#footer { display: none; }

/* Worklog form - hide extra fields */
#worklogForm > div:nth-child(13) > div:nth-child(3) { display: none; }
#worklogForm > div:nth-child(13) > div:nth-child(4) { display: none; }
#worklogForm > div:nth-child(13) > div:nth-child(5) { display: none; }
#worklogForm > div:nth-child(13) > div:nth-child(6) { display: none; }
#worklogForm > div:nth-child(13) > div:nth-child(7) { display: none; }
#worklogForm > div:nth-child(13) > div:nth-child(8) { display: none; }

#worklogForm > div:nth-child(14) > div:nth-child(3) { display: none; }
#worklogForm > div:nth-child(14) > div:nth-child(4) { display: none; }
#worklogForm > div:nth-child(14) > div:nth-child(5) { display: none; }
#worklogForm > div:nth-child(14) > div:nth-child(6) { display: none; }
#worklogForm > div:nth-child(14) > div:nth-child(7) { display: none; }
#worklogForm > div:nth-child(14) > div:nth-child(8) { display: none; }`;

const DEFAULT_CSS_CREATE = `/* Applied only on /secure/CreateIssue */
.description { display: none; }
#issue-create > div.form-body > div.field-group.aui-field-componentspicker.frother-control-renderer { display: none; }
#issue-create > div.form-body > div.field-group.aui-field-versionspicker.frother-control-renderer { display: none; }
#issue-create > div.form-body > div:nth-child(16) { display: none; }
#issue-create > div.form-body > div.field-group.issue-link-edit { display: none; }
#customfield_29700 { height: 50px; }
#issue-create > div.form-body > div:nth-child(24) { display: none; }
#issue-create > div.form-body > div:nth-child(25) { display: none; }
#issue-create > div.form-body > div:nth-child(27) { display: none; }
#issue-create > div.form-body > div:nth-child(28) { display: none; }
#issue-create > div.form-body > div:nth-child(29) { display: none; }`;
