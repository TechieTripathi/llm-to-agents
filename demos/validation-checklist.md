# Validation checklist

Use this after any AI-assisted draft in the demonstrations, and as a template for your own work. Each check names what to compare against. A check you cannot complete is a finding, not a pass.

> Fictional example data for the "From LLMs to AI Agents" workshop.

## For every output

| Check | Compare against | Pass when |
|---|---|---|
| Facts are sourced | The source documents you supplied | Every factual claim points to a line, clause or cell |
| Nothing is invented | The same sources | No feature, date, number or name appears that the sources do not contain |
| Gaps are visible | The task | Missing information is flagged or left blank, never guessed |
| Numbers are recomputed | The data file, not the model's text | A tool or a person recalculated each figure |
| Owners are real | The attendee list or org chart | Every owner is a person who was there or is named in the source |
| Dates match | The source wording | "by the 23rd" is 23 Oct, not the nearest date mentioned elsewhere |
| Inferences are labelled | The sources | Anything concluded rather than stated is marked "inferred" |
| Current, not stale | Source date and status | No withdrawn, archived or superseded source is used as the authority |
| A person approves | Your approval rule | A named person signs off before anything is sent |

## Demo-specific checks

### Slide 55 and 59: weekly update
- [ ] On-time delivery is 92.5% (6,845 of 7,400 shipments in `depot-metrics.csv`), not the 94.1% in the status report
- [ ] Portal tickets total 116
- [ ] The mismatch is flagged for Priya, and the status report is not edited

### Slide 56: customer notice
- [ ] Go-live Tuesday 27 October 2026
- [ ] Old portal read-only Monday 26 October 22:00 to Tuesday 27 October 06:00; the service desk gives updates
- [ ] Password reset at first log-in
- [ ] CSV exports move to Reports › Exports; old links redirect for 90 days
- [ ] Who to contact
- [ ] Open question flagged: API customers not confirmed

### Slide 57: travel policy answer
- [ ] Each claim marked supported, contradicted or not in source, with the clause number
- [ ] Anything the excerpt does not cover (mileage) is referred to Group Finance, not answered

### Slide 58: password research
- [ ] The answer cites NIST SP 800-63B-4 (2025), not the withdrawn 2017 SP 800-63B
- [ ] 15 characters for single-factor passwords; 8 only when part of multi-factor authentication
- [ ] No composition rules; no scheduled expiry; change on evidence of compromise
- [ ] Every quoted sentence was found on the cited page

### Slide 60: meeting notes
- [ ] Every decision, action and risk cites a note line
- [ ] Daniel's API check is due Fri 23 Oct (line 14), not Fri 16 Oct
- [ ] Arjun's customer notice has no date in the notes and none was invented
