import { clsx } from 'clsx'

// ── Class merging helper ──────────────────────────────────────
export const cn = (...args) => clsx(...args)

// ── Days diff helper ──────────────────────────────────────────
export const daysDiff = (dateStr) => {
  if (!dateStr || dateStr === '—') return null
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
}

// ── Format date for display ───────────────────────────────────
export const formatDate = (dateStr, locale = 'en-IN') => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString(locale)
}

// ── Get deadline CSS classes ──────────────────────────────────
export const getDeadlinePriorityCls = (priority) => ({
  ug: 'border-l-[3px] border-red bg-red-light',
  wa: 'border-l-[3px] border-gold bg-gold-light',
  ok: 'border-l-[3px] border-green',
}[priority] || 'border border-border')

export const getDaysLeftCls = (diff) => {
  if (diff === null) return ''
  if (diff <= 3)  return 'bg-red-light text-red'
  if (diff <= 14) return 'bg-gold-light text-gold'
  return 'bg-green-light text-green'
}

// ── Badge class for matter type ───────────────────────────────
export const typeBadgeCls = (type) => ({
  TM:     'bg-[#e8f0ff] text-[#2563eb]',
  PAT:    'bg-cyan-light text-cyan-dark',
  COPY:   'bg-gold-light text-[#9a6800]',
  DESIGN: 'bg-purple-light text-purple',
  GI:     'bg-green-light text-green',
  HC:     'bg-org-light text-org-dark',
  DC:     'bg-red-light text-red',
}[type] || 'bg-bg-2 text-text-3')

// ── Badge class for matter status ─────────────────────────────
export const statusBadgeCls = (status) => {
  const map = {
    'Pending':           'bg-[#fef9c3] text-[#854d0e]',
    'Under Examination': 'bg-[#fef9c3] text-[#854d0e]',
    'FER Issued':        'bg-[#fef9c3] text-[#854d0e]',
    'Hearing Fixed':     'bg-org-light text-org-dark',
    'Opposed':           'bg-red-light text-red',
    'Registered':        'bg-[#d1fae5] text-[#065f46]',
    'Renewal Due':       'bg-[#fef9c3] text-[#854d0e]',
    'Filed':             'bg-cyan-light text-cyan-dark',
    'Active':            'bg-green-light text-green',
    'Arguments':         'bg-org-light text-org-dark',
    'Evidence':          'bg-org-light text-org-dark',
    'Granted':           'bg-[#d1fae5] text-[#065f46]',
  }
  return map[status] || 'bg-[#fef9c3] text-[#854d0e]'
}

// ── Generate drive folder name ────────────────────────────────
export const getDriveFolderName = (matter) => {
  if (matter.type === 'TM')     return `TM_${matter.appNo}_${(matter.mark || '').replace(/ /g, '_')}_Class${matter.classes}`
  if (matter.type === 'HC')     return `HC_${(matter.caseNo || '').replace(/[^a-zA-Z0-9]/g, '_')}`
  if (matter.type === 'DC')     return `DC_${(matter.caseNo || '').replace(/[^a-zA-Z0-9]/g, '_')}`
  return `${matter.type}_${matter.appNo || 'File'}`
}

// ── Month names ───────────────────────────────────────────────
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
export const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

// ── Activity dot color ────────────────────────────────────────
export const activityDotColor = (color) => ({
  org:   '#e85020',
  cyan:  '#00aadd',
  gold:  '#c89b30',
  green: '#1a7a4a',
  navy:  '#0d2045',
  red:   '#c0392b',
}[color] || '#8a9bb5')

// ── ID generator ──────────────────────────────────────────────
export const genId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

// ── Today string ─────────────────────────────────────────────
export const todayStr = () => new Date().toISOString().split('T')[0]
