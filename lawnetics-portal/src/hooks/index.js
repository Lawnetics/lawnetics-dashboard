import { useState, useMemo } from 'react'
import { useDataStore, useUIStore } from '../store'

// ── usePagination ─────────────────────────────────────────────
export function usePagination(items, pageSize = 10) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(items.length / pageSize)
  const paginated = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  )
  return { page, setPage, totalPages, paginated }
}

// ── useSearch ─────────────────────────────────────────────────
export function useSearch(items, keys) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((item) =>
      keys.some((key) => {
        const val = key.split('.').reduce((o, k) => o?.[k], item)
        return String(val || '').toLowerCase().includes(q)
      })
    )
  }, [items, query, keys])
  return { query, setQuery, filtered }
}

// ── useSort ───────────────────────────────────────────────────
export function useSort(items) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const sorted = useMemo(() => {
    if (!sortKey) return items
    return [...items].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
  }, [items, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  return { sorted, sortKey, sortDir, toggleSort }
}

// ── useTable – combines search + sort + pagination ────────────
export function useTable(rawItems, searchKeys, pageSize = 10) {
  const { query, setQuery, filtered } = useSearch(rawItems, searchKeys)
  const { sorted, sortKey, sortDir, toggleSort } = useSort(filtered)
  const { page, setPage, totalPages, paginated } = usePagination(sorted, pageSize)
  return { query, setQuery, sortKey, sortDir, toggleSort, page, setPage, totalPages, paginated, total: filtered.length }
}

// ── useToast shortcut ─────────────────────────────────────────
export function useToast() {
  const { addToast } = useUIStore()
  return {
    success: (msg) => addToast(msg, 'ok'),
    error:   (msg) => addToast(msg, 'er'),
    info:    (msg) => addToast(msg, 'in'),
  }
}

// ── useMattersByType ──────────────────────────────────────────
export function useMattersByType(type) {
  const { matters } = useDataStore()
  return useMemo(() => matters.filter((m) => m.type === type), [matters, type])
}

// ── useUrgentDeadlines ────────────────────────────────────────
export function useUrgentDeadlines(days = 30) {
  const { deadlines } = useDataStore()
  return useMemo(() => {
    const now = new Date()
    return deadlines.filter((d) => {
      const diff = Math.ceil((new Date(d.date) - now) / 86400000)
      return diff >= 0 && diff <= days
    })
  }, [deadlines, days])
}
