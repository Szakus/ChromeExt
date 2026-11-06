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
#issue-create > div.form-body > div:nth-child(13) { display: none; }
#issue-create > div.form-body > div:nth-child(14) { display: none; }
#issue-create > div.form-body > div.jpo-baseline-start { display: none; }
#issue-create > div.form-body > div.jpo-baseline-end { display: none; }
#issue-create > div.form-body > div:nth-child(32) { display: none; }
#issue-create > div.form-body > div:nth-child(33) { display: none; }
#issue-create > div.form-body > div:nth-child(34) { display: none; }
#issue-create > div.form-body > div:nth-child(35) { display: none; }
#issue-create > div.form-body > div:nth-child(36) { display: none; }
#issue-create > div.form-body > div:nth-child(37) { display: none; }
#issue-create > div.form-body > div:nth-child(38) { display: none; }`;
