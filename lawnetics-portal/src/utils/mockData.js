// ── Date helpers ──────────────────────────────────────────────
const td = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}
const tp = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

// ── Clients ───────────────────────────────────────────────────
export const MOCK_CLIENTS = [
  { id: 'c1', name: 'ABC Pvt. Ltd.',      type: 'Company',        country: 'India', contact: 'Ramesh Gupta',  email: 'legal@abc.com',          phone: '+91 98100 11111', attorney: 'Self',           created: '2024-01-15' },
  { id: 'c2', name: 'XYZ Technologies',   type: 'Company',        country: 'India', contact: 'Priya Singh',   email: 'ip@xyz.tech',            phone: '+91 98200 22222', attorney: 'Self',           created: '2024-03-10' },
  { id: 'c3', name: 'Global Foods Inc.',  type: 'Company',        country: 'USA',   contact: 'John Smith',    email: 'legal@globalfoods.com',  phone: '+1 646 000 0001', attorney: 'Adv. P. Sharma', created: '2024-06-22' },
  { id: 'c4', name: 'Dr. Priya Mehta',    type: 'Individual',     country: 'India', contact: 'Dr. Priya Mehta',email: 'priya@gmail.com',       phone: '+91 97100 33333', attorney: 'Adv. R. Verma', created: '2025-01-05' },
  { id: 'c5', name: 'Darjeeling Tea Board',type: 'Statutory Body',country: 'India', contact: 'Secretary',     email: 'info@darjeelingtea.in', phone: '+91 354 000 000', attorney: 'Self',           created: '2025-03-12' },
]

// ── Matters ───────────────────────────────────────────────────
export const MOCK_MATTERS = [
  { id: 'm1',  type: 'TM',     clientId: 'c1', clientName: 'ABC Pvt. Ltd.',      appNo: '5896321',           mark: 'ZENOVA',                 classes: '35',       filingDate: '2023-08-15', status: 'Under Examination', nextDate: td(12), priority: 'h', attorney: 'Self',           notes: 'FER received. Reply due urgently.', created: tp(30) },
  { id: 'm2',  type: 'TM',     clientId: 'c1', clientName: 'ABC Pvt. Ltd.',      appNo: '5897854',           mark: 'ZENOVA PLUS',            classes: '42',       filingDate: '2023-09-20', status: 'Pending',           nextDate: td(45), priority: 'm', attorney: 'Self',           notes: '', created: tp(25) },
  { id: 'm3',  type: 'TM',     clientId: 'c2', clientName: 'XYZ Technologies',   appNo: '6012345',           mark: 'XYTRON',                 classes: '9,42',     filingDate: '2024-01-10', status: 'Hearing Fixed',     nextDate: td(7),  priority: 'h', attorney: 'Self',           notes: 'Hearing at IPO Mumbai.', created: tp(20) },
  { id: 'm4',  type: 'PAT',    clientId: 'c2', clientName: 'XYZ Technologies',   appNo: 'IN202441002234',    mark: 'Smart IoT Gateway System',               filingDate: '2024-02-28', status: 'Pending',           nextDate: td(60), priority: 'm', attorney: 'Adv. P. Sharma', inventors: 'Priya Singh, Rahul Verma', notes: 'PCT application filed.', created: tp(18) },
  { id: 'm5',  type: 'TM',     clientId: 'c3', clientName: 'Global Foods Inc.',  appNo: '6234567',           mark: 'TASTYMAX',               classes: '30',       filingDate: '2024-05-01', status: 'Opposed',           nextDate: td(22), priority: 'h', attorney: 'Adv. P. Sharma', notes: 'Opposition by competitor.', created: tp(15) },
  { id: 'm6',  type: 'COPY',   clientId: 'c4', clientName: 'Dr. Priya Mehta',    appNo: 'SW/2025/00456',     mark: 'Research Publication Vol 3', nature: 'Literary', filingDate: '2025-02-01', status: 'Registered', nextDate: '', priority: 'l', attorney: 'Adv. R. Verma', notes: '', created: tp(12) },
  { id: 'm7',  type: 'GI',     clientId: 'c5', clientName: 'Darjeeling Tea Board',appNo: 'GI/1/2006/00045', mark: 'Darjeeling Tea',         goods: 'Tea',        area: 'Darjeeling, West Bengal', filingDate: '2006-04-27', status: 'Registered', nextDate: td(90), priority: 'l', attorney: 'Self', notes: "World's first GI tag in India.", created: tp(10) },
  { id: 'm8',  type: 'HC',     clientId: 'c2', clientName: 'XYZ Technologies',   caseNo: 'W.P.(C) 1234/2025', caseTitle: 'XYZ Technologies vs ABC Corp', court: 'Delhi High Court', bench: 'Division Bench', filingDate: '2025-03-10', nextDate: td(20), stage: 'Arguments', attorney: 'Self', notes: '', created: tp(8) },
  { id: 'm9',  type: 'DC',     clientId: 'c3', clientName: 'Global Foods Inc.',  caseNo: 'CS(OS) 567/2025',  caseTitle: 'Global Foods vs Rival Brands', court: 'Saket District Court', filingDate: '2025-04-15', nextDate: td(15), stage: 'Evidence', attorney: 'Adv. P. Sharma', notes: '', created: tp(5) },
  { id: 'm10', type: 'DESIGN', clientId: 'c1', clientName: 'ABC Pvt. Ltd.',      appNo: 'D/2025/12345',      mark: 'Premium Packaging',      designClass: '09-03', filingDate: '2025-05-01', status: 'Pending', nextDate: td(35), priority: 'm', attorney: 'Self', notes: '', created: tp(3) },
]

// ── Deadlines ─────────────────────────────────────────────────
export const MOCK_DEADLINES = [
  { id: 'd1', type: 'Hearing',            matterId: 'm3', matterName: 'XYTRON (XYZ Tech)',        date: td(7),  time: '10:30', venue: 'IPO Mumbai',          priority: 'ug', attorney: 'Self',           notes: 'Officer: Mr. J. Iyer' },
  { id: 'd2', type: 'FER Deadline',       matterId: 'm1', matterName: 'ZENOVA (ABC Pvt.)',         date: td(12), time: '',      venue: '',                    priority: 'ug', attorney: 'Self',           notes: 'Reply to FER due' },
  { id: 'd3', type: 'Opposition Deadline',matterId: 'm5', matterName: 'TASTYMAX (Global Foods)',   date: td(22), time: '',      venue: '',                    priority: 'wa', attorney: 'Adv. P. Sharma', notes: 'Evidence affidavit due' },
  { id: 'd4', type: 'Court Date',         matterId: 'm9', matterName: 'CS(OS) 567/2025',           date: td(15), time: '11:00', venue: 'Saket District Court',priority: 'wa', attorney: 'Adv. P. Sharma', notes: 'Evidence stage' },
  { id: 'd5', type: 'Hearing',            matterId: 'm8', matterName: 'W.P.(C) 1234/2025',         date: td(20), time: '10:30', venue: 'Delhi High Court',    priority: 'wa', attorney: 'Self',           notes: '' },
  { id: 'd6', type: 'Renewal Due',        matterId: 'm7', matterName: 'Darjeeling Tea GI',          date: td(90), time: '',      venue: '',                    priority: 'ok', attorney: 'Self',           notes: '10-year renewal' },
]

// ── Documents ─────────────────────────────────────────────────
export const MOCK_DOCUMENTS = [
  { id: 'f1', name: 'ZENOVA_FER_Receipt.pdf',           matterId: 'm1', type: 'pdf', size: '1.2 MB', date: tp(2),  tags: ['FER','Official'] },
  { id: 'f2', name: 'XYTRON_Hearing_Notice.pdf',        matterId: 'm3', type: 'pdf', size: '0.8 MB', date: tp(1),  tags: ['Hearing','Urgent'] },
  { id: 'f3', name: 'TASTYMAX_Opposition.pdf',          matterId: 'm5', type: 'pdf', size: '2.1 MB', date: tp(5),  tags: ['Opposition'] },
  { id: 'f4', name: 'GI_Darjeeling_Certificate.pdf',    matterId: 'm7', type: 'pdf', size: '3.5 MB', date: tp(30), tags: ['Certificate'] },
  { id: 'f5', name: 'HC_Writ_Petition.docx',            matterId: 'm8', type: 'doc', size: '1.8 MB', date: tp(8),  tags: ['Pleadings','Court'] },
]

// ── Activity ──────────────────────────────────────────────────
export const MOCK_ACTIVITY = [
  { id: 'a1', text: '<strong>FER received</strong> for ZENOVA (App 5896321)', time: '2h ago',    color: 'org' },
  { id: 'a2', text: '<strong>Hearing fixed</strong> for XYTRON',              time: '4h ago',    color: 'cyan' },
  { id: 'a3', text: '<strong>New matter:</strong> Darjeeling Tea GI',         time: 'Yesterday', color: 'green' },
  { id: 'a4', text: '<strong>Document uploaded:</strong> HC Writ Petition',   time: '2 days ago',color: 'gold' },
  { id: 'a5', text: '<strong>Google Drive synced</strong> — 5 files updated', time: '3 days ago',color: 'navy' },
]

// ── Sub-folder templates ──────────────────────────────────────
export const FOLDER_SUBFOLDERS = {
  TM:     ['Filing_Documents','Examination_Reports','Reply_to_FER','Hearing_Notices','Opposition','Evidence','Registration_Certificate','Renewal','Client_Communication','Orders_Notices','Miscellaneous'],
  PAT:    ['Application','Examination_Reports','Response','Grant_Certificate','Renewal','Client_Communication'],
  COPY:   ['Filing_Documents','Registration','Client_Communication','Miscellaneous'],
  DESIGN: ['Filing_Documents','Registration','Client_Communication','Miscellaneous'],
  GI:     ['Filing_Documents','Registration','Client_Communication','Miscellaneous'],
  HC:     ['Pleadings','Evidence','Written_Arguments','Orders','Judgments','Client_Communication'],
  DC:     ['Pleadings','Evidence','Written_Arguments','Orders','Judgments','Client_Communication'],
}

// ── Attorneys ─────────────────────────────────────────────────
export const ATTORNEYS = ['Self', 'Adv. P. Sharma', 'Adv. R. Verma', 'Adv. M. Singh']

// ── Matter types ─────────────────────────────────────────────
export const MATTER_TYPES = [
  { key: 'TM',     label: 'Trademark',     icon: '™',  route: '/trademark',      color: '#e85020' },
  { key: 'PAT',    label: 'Patent',        icon: '⚙',  route: '/patent',         color: '#00aadd' },
  { key: 'COPY',   label: 'Copyright',     icon: '©',  route: '/copyright',      color: '#c89b30' },
  { key: 'DESIGN', label: 'Design',        icon: '◈',  route: '/design',         color: '#7c3aed' },
  { key: 'GI',     label: 'GI Tag',        icon: '📍', route: '/gi',             color: '#1a7a4a' },
  { key: 'HC',     label: 'High Court',    icon: '⚖',  route: '/high-court',     color: '#c04010' },
  { key: 'DC',     label: 'District Ct.',  icon: '🏛', route: '/district-court', color: '#c0392b' },
]

export const TM_STATUSES    = ['Pending','Under Examination','FER Issued','Hearing Fixed','Opposed','Registered','Renewal Due']
export const PAT_STATUSES   = ['Pending','Under Examination','FER Issued','Granted','Abandoned']
export const COPY_STATUSES  = ['Filed','Under Scrutiny','Objected','Registered']
export const HC_STAGES      = ['Filing','Admission','Notice','Reply Filed','Arguments','Reserved','Decided']
export const DC_STAGES      = ['Filing','Summons','Written Statement','Evidence','Arguments','Judgment']
export const EVENT_TYPES    = ['Hearing','FER Deadline','Opposition Deadline','Renewal Due','Filing Deadline','Court Date','Evidence Deadline','Client Meeting','Other']
export const CLIENT_TYPES   = ['Company','Individual','LLP','Partnership','Trust','Statutory Body']
export const COUNTRIES      = ['India','USA','UK','UAE','Germany','France','Japan','China','Other']
