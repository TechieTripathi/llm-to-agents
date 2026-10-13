// Section 6 — department use cases. Single source of truth for the use-case explorer (slide 46)
// and the department worked examples (slides 47–53). All examples are fictional (Kestrel Freight).

export type TaskType = 'gather' | 'transform' | 'analyse' | 'communicate' | 'execute'
export type Risk = 'lower' | 'medium' | 'high'

export const TASK_TYPES: { id: TaskType, label: string, long: string, hint: string }[] = [
  { id: 'gather', label: 'Gather', long: 'Information gathering', hint: 'Find, collect and extract facts from sources' },
  { id: 'transform', label: 'Transform', long: 'Transformation', hint: 'Turn one format into another: notes → SOP, policy → checklist' },
  { id: 'analyse', label: 'Analyse', long: 'Analysis', hint: 'Compare, categorise, explain patterns and variances' },
  { id: 'communicate', label: 'Communicate', long: 'Communication', hint: 'Draft messages, briefs and summaries for a reader' },
  { id: 'execute', label: 'Execute', long: 'Execution', hint: 'Take an action in a system — tickets, pull requests, updates' },
]

export const RISK_LABEL: Record<Risk, { state: 'ok' | 'warn' | 'bad', label: string }> = {
  lower: { state: 'ok', label: 'Lower risk' },
  medium: { state: 'warn', label: 'Medium risk' },
  high: { state: 'bad', label: 'High risk' },
}

export interface UseCase {
  id: string
  dept: DeptId
  type: TaskType
  task: string
  inputs: string
  steps: string[]
  output: string
  verify: string
  risk: Risk
  riskNote: string
  /** Position in the full deck of the worked example, if this use case has one. */
  slide?: number
}

export type DeptId = 'hr' | 'finance' | 'sales' | 'marketing' | 'ops' | 'it' | 'mgmt' | 'research'

export const DEPARTMENTS: { id: DeptId, name: string, short: string, owner?: string }[] = [
  { id: 'hr', name: 'HR', short: 'HR', owner: 'Sara Lindqvist, HR advisor' },
  { id: 'finance', name: 'Finance', short: 'Finance', owner: 'Mei Chen, Finance business partner' },
  { id: 'sales', name: 'Sales', short: 'Sales', owner: 'Arjun Mehta, Account manager' },
  { id: 'marketing', name: 'Marketing', short: 'Marketing' },
  { id: 'ops', name: 'Operations', short: 'Operations', owner: 'Tomás Ruiz, Operations lead' },
  { id: 'it', name: 'IT & engineering', short: 'IT', owner: 'Daniel Okafor, IT engineering lead' },
  { id: 'mgmt', name: 'Management', short: 'Management', owner: 'Helen Brooks, Operations director' },
  { id: 'research', name: 'Research & learning', short: 'Research' },
]

export const USE_CASES: UseCase[] = [
  // HR
  {
    id: 'hr-onboarding', dept: 'hr', type: 'transform', slide: 47,
    task: 'Onboarding checklist from approved policies',
    inputs: 'Approved onboarding, IT-access and safety policies; the role and depot',
    steps: ['Extract every required action', 'Order by day 1, week 1, month 1', 'Cite the policy section for each item'],
    output: 'Checklist with a source on every line',
    verify: 'Policy owner checks each item; legal duties confirmed by HR',
    risk: 'medium', riskNote: 'Use role templates, not employee records',
  },
  {
    id: 'hr-jd', dept: 'hr', type: 'communicate',
    task: 'Job description draft',
    inputs: 'Role profile, pay band, language guide',
    steps: ['Draft from the role profile only', 'Flag requirements not in the profile', 'Check wording against the guide'],
    output: 'Job description ready for the hiring manager',
    verify: 'Manager checks duties; HR checks pay and wording',
    risk: 'medium', riskNote: 'Screening candidates with AI is high-risk',
  },
  {
    id: 'hr-policy-qa', dept: 'hr', type: 'gather',
    task: 'Answer staff questions from the handbook',
    inputs: 'Current staff handbook; the question',
    steps: ['Retrieve the relevant sections', 'Answer and quote the section', 'Say so when the handbook is silent'],
    output: 'Answer with a section reference',
    verify: 'HR reviews answers on pay, leave or discipline before sending',
    risk: 'medium', riskNote: 'Questions can contain health or personal details',
  },
  // Finance
  {
    id: 'fin-variance', dept: 'finance', type: 'analyse', slide: 48,
    task: 'Explain budget variances',
    inputs: 'Budget-vs-actual export; account definitions',
    steps: ['Compute and rank the variances', 'Draft an explanation per line', 'List questions for budget owners'],
    output: 'Commentary plus open questions',
    verify: 'Recompute every figure; partner approves',
    risk: 'high', riskNote: 'Unreleased financials: approved tools only',
  },
  {
    id: 'fin-disputes', dept: 'finance', type: 'transform',
    task: 'Invoice-dispute emails into a tracker',
    inputs: 'Dispute emails; invoice numbers',
    steps: ['Extract invoice, amount and reason', 'Categorise the reason', 'Flag missing information'],
    output: 'One tracker row per dispute',
    verify: 'Spot-check amounts against the ledger',
    risk: 'medium', riskNote: 'Contains customer financial data',
  },
  {
    id: 'fin-summary', dept: 'finance', type: 'communicate',
    task: 'Month-end summary for depot managers',
    inputs: 'Approved month-end pack',
    steps: ['Summarise in plain language', 'Explain finance terms once', 'Copy figures verbatim, never re-derive'],
    output: 'One-page summary',
    verify: 'Every figure matches the pack; finance signs off',
    risk: 'medium', riskNote: 'Internal figures: share only after approval',
  },
  // Sales
  {
    id: 'sales-brief', dept: 'sales', type: 'gather', slide: 49,
    task: 'Public-source account brief',
    inputs: "Prospect's annual report, press releases, job postings",
    steps: ['Collect public sources', 'Extract facts with source and date', 'List questions for the first call'],
    output: 'One-page brief, every fact dated',
    verify: 'Check freshness; confirm each fact in the original',
    risk: 'lower', riskNote: 'Public sources only — keep CRM notes out',
  },
  {
    id: 'sales-followup', dept: 'sales', type: 'communicate',
    task: 'Follow-up email after a discovery call',
    inputs: 'Call notes; approved service sheet',
    steps: ['Draft the email', 'Match commitments to the notes', 'Use approved service claims only'],
    output: 'Email draft for the account manager',
    verify: 'Account manager checks commitments, prices and dates',
    risk: 'medium', riskNote: 'Prices and terms need commercial approval',
  },
  {
    id: 'sales-winloss', dept: 'sales', type: 'analyse',
    task: 'Themes from win/loss notes',
    inputs: 'Anonymised win/loss notes',
    steps: ['Cluster reasons into themes', 'Count each theme', 'Quote one example per theme'],
    output: 'Theme table with counts and quotes',
    verify: 'Sample-check that quotes and counts match the notes',
    risk: 'lower', riskNote: 'Remove customer names before analysis',
  },
  // Marketing
  {
    id: 'mkt-variants', dept: 'marketing', type: 'transform', slide: 49,
    task: 'Campaign variants for one message',
    inputs: 'Approved message, brand guide, audience segments',
    steps: ['Draft a variant per segment', 'Check against brand rules', 'List every claim that needs proof'],
    output: 'Variants plus a claims list',
    verify: 'Brand review; claims match the approved fact sheet',
    risk: 'medium', riskNote: 'Published claims become commitments',
  },
  {
    id: 'mkt-survey', dept: 'marketing', type: 'analyse',
    task: 'Themes from survey comments',
    inputs: 'Exported free-text comments (anonymised)',
    steps: ['Code comments into themes', 'Count each theme', 'Pick representative quotes'],
    output: 'Theme table with counts',
    verify: 'Re-code a random sample by hand; recount',
    risk: 'lower', riskNote: 'Strip names and contact details first',
  },
  {
    id: 'mkt-repurpose', dept: 'marketing', type: 'communicate',
    task: 'Case study into channel posts',
    inputs: 'Approved case study',
    steps: ['Shorten for each channel', 'Keep facts and quotes verbatim', 'Suggest one call to action'],
    output: 'Post drafts per channel',
    verify: 'Customer approves quotes; brand review',
    risk: 'lower', riskNote: 'Only use material the customer approved',
  },
  // Operations
  {
    id: 'ops-sop', dept: 'ops', type: 'transform', slide: 50,
    task: 'Incident notes into an SOP draft',
    inputs: 'Shift-log notes; maintenance report',
    steps: ['Reconstruct what happened', 'Turn actions into ordered steps', 'Mark assumptions and gaps'],
    output: 'SOP draft for the process owner',
    verify: 'Process owner reviews; safety steps checked',
    risk: 'high', riskNote: 'A wrong step can hurt someone',
  },
  {
    id: 'ops-delays', dept: 'ops', type: 'analyse',
    task: 'Delay reasons from delivery exceptions',
    inputs: 'Exception export (no customer names)',
    steps: ['Categorise each reason', 'Count by depot and week', 'Draft questions for depot leads'],
    output: 'Categorised table and trend notes',
    verify: 'Spot-check categories; recompute counts',
    risk: 'lower', riskNote: 'Aggregate data; check before sharing outside ops',
  },
  {
    id: 'ops-tickets', dept: 'ops', type: 'execute',
    task: 'Tickets from inspection notes',
    inputs: 'Inspection notes; ticket system (draft only)',
    steps: ['Extract each defect', 'Create draft tickets with priority', 'Hold for supervisor approval'],
    output: 'Draft tickets awaiting approval',
    verify: 'Supervisor approves each ticket and its priority',
    risk: 'high', riskNote: 'Acts in a live system — draft-only permissions',
  },
  // IT & engineering
  {
    id: 'it-debug', dept: 'it', type: 'analyse', slide: 51,
    task: 'Log summary, test and code change',
    inputs: 'Synthetic error log; the failing module',
    steps: ['Summarise the error pattern', 'Write a test that reproduces it', 'Propose and explain a fix'],
    output: 'Failing test, fix and explanation',
    verify: 'Run the tests; code review; security check',
    risk: 'medium', riskNote: 'Never paste secrets, tokens or real customer data',
  },
  {
    id: 'it-docs', dept: 'it', type: 'transform',
    task: 'Document a legacy script',
    inputs: 'Script source; example runs',
    steps: ['Explain purpose and flow', 'List inputs, outputs, side effects', 'Note risky operations'],
    output: 'README draft',
    verify: 'Engineer reruns the examples; peer review',
    risk: 'medium', riskNote: 'Scripts may contain credentials — scrub first',
  },
  {
    id: 'it-pr', dept: 'it', type: 'execute',
    task: 'Agent proposes a dependency update',
    inputs: 'Repository; failing CI job; update policy',
    steps: ['Update the dependency', 'Run the test suite', 'Open a pull request with a summary'],
    output: 'Pull request awaiting human review',
    verify: 'Tests green, human review, security scan before merge',
    risk: 'high', riskNote: 'Least-privilege access; never auto-merge',
  },
  // Management
  {
    id: 'mgmt-brief', dept: 'mgmt', type: 'communicate', slide: 52,
    task: 'Decision brief from team updates',
    inputs: 'Weekly updates from four team leads',
    steps: ['Extract decisions, dates and owners', 'Group risks by impact', 'Draft options for the decision'],
    output: 'One-page decision brief',
    verify: 'Owners, dates and assumptions match the sources',
    risk: 'medium', riskNote: 'Leave people matters out of shared briefs',
  },
  {
    id: 'mgmt-risks', dept: 'mgmt', type: 'analyse',
    task: 'Risk list for a steering meeting',
    inputs: 'Risk register; latest status reports',
    steps: ['Find new or changed risks', 'Check each has an owner and date', 'Rank by impact and likelihood'],
    output: 'Ranked risk list',
    verify: 'Owners confirm; dates match the plan',
    risk: 'medium', riskNote: 'Ranking is a judgement — the manager owns it',
  },
  {
    id: 'mgmt-prep', dept: 'mgmt', type: 'gather',
    task: 'Meeting preparation pack',
    inputs: 'Agenda, last minutes, open actions',
    steps: ['Summarise the last meeting', 'List open actions by owner', 'Suggest questions to ask'],
    output: 'One-page prep note',
    verify: 'Actions and dates match the tracker',
    risk: 'lower', riskNote: 'Keep performance matters out of AI tools',
  },
  // Research & learning
  {
    id: 'res-claims', dept: 'research', type: 'gather', slide: 53,
    task: 'Compare claims across studies',
    inputs: 'Three published papers, not press stories',
    steps: ['Extract claim, method and sample', 'Line them up in one table', 'Note limitations and conflicts'],
    output: 'Evidence table with caveats',
    verify: 'Check each number and limitation in the original',
    risk: 'lower', riskNote: 'Summaries drop caveats — read the methods',
  },
  {
    id: 'res-onboarding', dept: 'research', type: 'transform',
    task: 'Onboarding plan for a new engineer',
    inputs: 'Architecture notes, repository README, glossary',
    steps: ['Build a reading order', 'Explain terms in plain language', 'Write self-check questions'],
    output: 'Two-week learning plan',
    verify: 'Mentor reviews; links point to current docs',
    risk: 'lower', riskNote: 'Internal docs: use an approved tool',
  },
  {
    id: 'res-explain', dept: 'research', type: 'communicate',
    task: 'Explain a paper to non-specialists',
    inputs: 'The paper (PDF)',
    steps: ['Summarise question and method', 'Extract sample and limits', 'Write a plain-language version'],
    output: 'One-page explainer',
    verify: 'Numbers and limitations checked against the paper',
    risk: 'lower', riskNote: 'Simplifying can overstate the finding',
  },
]

/** Use cases the clicker steps through on slide 46 (varied task types and risk levels). */
export const EXPLORER_TOUR = ['mkt-survey', 'hr-policy-qa', 'fin-summary', 'it-pr']

export const useCase = (id: string) => USE_CASES.find(u => u.id === id)!
