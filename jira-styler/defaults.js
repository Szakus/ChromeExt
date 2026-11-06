const DEFAULT_CSS_GLOBAL = `/* Applied on all pages of your Jira domain */
#footer { display: none; }
#customfield_46343 { max-width: 400px !important; }
.field-group { margin-bottom: 6px !important; }
form.aui:not(.aui-legacy-forms) .date-select,
form.aui:not(.aui-legacy-forms) .field-group,
form.aui:not(.aui-legacy-forms) .group { padding-top: 0px !important; padding-bottom: 0px !important; }
.qf-field { padding: 0px 30px 0px 0; margin-bottom: 0px; clear: left; }
#customfield_16100-single-select { max-width: 400px !important; }

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
#issue-create > div.form-body > div.field-group.issue-link-edit { display: none; }
#issue-create > div.form-body > div:nth-child(13) { display: none; }
#issue-create > div.form-body > div:nth-child(14) { display: none; }
#issue-create > div.form-body > div.jpo-baseline-start { display: none; }
#issue-create > div.form-body > div.jpo-baseline-end { display: none; }
#issue-create > div.form-body > div:nth-child(16) { display: none; }
#issue-create > div.form-body > div:nth-child(23) { display: none; }
#issue-create > div.form-body > div:nth-child(24) { display: none; }
#issue-create > div.form-body > div:nth-child(25) { display: none; }
#issue-create > div.form-body > div:nth-child(27) { display: none; }
#issue-create > div.form-body > div:nth-child(28) { display: none; }
#issue-create > div.form-body > div:nth-child(29) { display: none; }
#issue-create > div.form-body > div:nth-child(32) { display: none; }
#issue-create > div.form-body > div:nth-child(33) { display: none; }
#issue-create > div.form-body > div:nth-child(34) { display: none; }
#issue-create > div.form-body > div:nth-child(35) { display: none; }
#issue-create > div.form-body > div:nth-child(36) { display: none; }
#issue-create > div.form-body > div:nth-child(37) { display: none; }
#issue-create > div.form-body > div:nth-child(38) { display: none; }
#customfield_29700 { height: 50px; }
#content>.aui-page-header .aui-page-header-inner,
#content>main>.aui-page-header .aui-page-header-inner,
#content>section>.aui-page-header .aui-page-header-inner { padding: 0 !important; }`;
