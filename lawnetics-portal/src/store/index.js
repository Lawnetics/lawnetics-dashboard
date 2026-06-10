import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { genId, todayStr } from '../utils/helpers'
import axios from 'axios'

const API_URL = `http://${window.location.hostname}:5000/api`

// ─────────────────────────────────────────────────────────────
// AUTH STORE
// ─────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const res = await axios.post(`${API_URL}/users/login`, { email, password })
          if (res.data && res.data.success) {
            const userData = res.data
            set({
              user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                avatar: userData.avatar,
              },
              isAuthenticated: true,
            })
            return true
          }
          return false
        } catch (err) {
          console.error('Login failed:', err)
          throw new Error(err.response?.data?.message || 'Invalid credentials')
        }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'lawnetics-auth-storage',
    }
  )
)

// ─────────────────────────────────────────────────────────────
// UI / LAYOUT STORE
// ─────────────────────────────────────────────────────────────
export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Toast notifications
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = genId('toast')
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3600)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // Modal state
  activeModal: null,
  modalData: null,
  openModal:  (name, data = null) => set({ activeModal: name, modalData: data }),
  closeModal: ()                  => set({ activeModal: null, modalData: null }),
}))

// ─────────────────────────────────────────────────────────────
// DATA STORE – Clients, Matters, Deadlines, Documents, Activity
// ─────────────────────────────────────────────────────────────
export const useDataStore = create((set, get) => ({
  clients:   [],
  matters:   [],
  deadlines: [],
  documents: [],
  activity:  [],
  loading:   false,
  error:     null,

  fetchInitialData: async () => {
    set({ loading: true })
    try {
      const [cRes, mRes, dlRes, docRes, actRes] = await Promise.all([
        axios.get(`${API_URL}/clients`),
        axios.get(`${API_URL}/matters`),
        axios.get(`${API_URL}/deadlines`),
        axios.get(`${API_URL}/documents`),
        axios.get(`${API_URL}/activity`),
      ])
      set({
        clients: cRes.data,
        matters: mRes.data,
        deadlines: dlRes.data,
        documents: docRes.data,
        activity: actRes.data,
        loading: false,
      })
    } catch (err) {
      console.error('Failed to load initial data:', err)
      set({ error: err.message, loading: false })
    }
  },

  // ── Clients ──────────────────────────────────────────────
  addClient: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/clients`, { ...data, created: todayStr() })
      const client = res.data
      set((s) => ({ clients: [client, ...s.clients] }))
      get().addActivity(`<strong>New client:</strong> ${data.name}`, 'green')
      return client
    } catch (err) {
      console.error('Failed to add client:', err)
    }
  },
  deleteClient: async (id) => {
    try {
      await axios.delete(`${API_URL}/clients/${id}`)
      set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }))
    } catch (err) {
      console.error('Failed to delete client:', err)
    }
  },
  updateClient: async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/clients/${id}`, data)
      const updatedClient = res.data
      set((s) => ({
        clients: s.clients.map((c) => (c.id === id ? updatedClient : c)),
      }))
    } catch (err) {
      console.error('Failed to update client:', err)
    }
  },

  // ── Matters ──────────────────────────────────────────────
  addMatter: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/matters`, { ...data, created: todayStr() })
      const matter = res.data
      set((s) => ({ matters: [matter, ...s.matters] }))
      
      // Auto-create deadline if nextDate provided
      if (data.nextDate) {
        const dl = {
          type: ['HC','DC'].includes(data.type) ? 'Court Date' : 'FER Deadline',
          matterId: matter.id,
          matterName: (data.mark || data.caseTitle) + ' (' + data.clientName + ')',
          date: data.nextDate, time: '', venue: '', priority: 'wa',
          attorney: data.attorney || 'Self', notes: '',
        }
        const dlRes = await axios.post(`${API_URL}/deadlines`, dl)
        set((s) => ({ deadlines: [...s.deadlines, dlRes.data] }))
      }
      
      get().addActivity(`<strong>New ${data.type} matter:</strong> ${data.mark || data.caseTitle} for ${data.clientName}`, 'org')
      return matter
    } catch (err) {
      console.error('Failed to add matter:', err)
    }
  },
  deleteMatter: async (id) => {
    try {
      await axios.delete(`${API_URL}/matters/${id}`)
      set((s) => ({
        matters:   s.matters.filter((m) => m.id !== id),
        deadlines: s.deadlines.filter((d) => d.matterId !== id),
      }))
    } catch (err) {
      console.error('Failed to delete matter:', err)
    }
  },
  updateMatter: async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/matters/${id}`, data)
      const updatedMatter = res.data
      set((s) => ({
        matters: s.matters.map((m) => (m.id === id ? updatedMatter : m)),
      }))
    } catch (err) {
      console.error('Failed to update matter:', err)
    }
  },

  // ── Deadlines ─────────────────────────────────────────────
  addDeadline: async (data) => {
    try {
      const res = await axios.post(`${API_URL}/deadlines`, data)
      const dl = res.data
      set((s) => ({ deadlines: [...s.deadlines, dl] }))
      get().addActivity(`<strong>Docket event added</strong> on ${data.date}`, 'cyan')
      return dl
    } catch (err) {
      console.error('Failed to add deadline:', err)
    }
  },
  deleteDeadline: async (id) => {
    try {
      await axios.delete(`${API_URL}/deadlines/${id}`)
      set((s) => ({ deadlines: s.deadlines.filter((d) => d.id !== id) }))
    } catch (err) {
      console.error('Failed to delete deadline:', err)
    }
  },

  // ── Documents ─────────────────────────────────────────────
  addDocument: async (file, matterId = '', tags = ['Uploaded']) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('matterId', matterId)
      formData.append('tags', JSON.stringify(tags))

      const res = await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const savedDoc = res.data
      set((s) => ({ documents: [savedDoc, ...s.documents] }))
      get().addActivity(`<strong>Document uploaded:</strong> ${savedDoc.name}`, 'gold')
      return savedDoc
    } catch (err) {
      console.error('Failed to add document:', err)
    }
  },
  deleteDocument: async (id) => {
    try {
      await axios.delete(`${API_URL}/documents/${id}`)
      set((s) => ({ documents: s.documents.filter((d) => d.id !== id) }))
    } catch (err) {
      console.error('Failed to delete document:', err)
    }
  },
  pushDocumentsToDrive: async () => {
    try {
      const res = await axios.post(`${API_URL}/documents/push-to-drive`)
      const docsRes = await axios.get(`${API_URL}/documents`)
      set({ documents: docsRes.data })
      get().addActivity(`<strong>Synced local files to Google Drive</strong>`, 'green')
      return res.data
    } catch (err) {
      console.error('Failed to push documents to Google Drive:', err)
      throw new Error(err.response?.data?.message || 'Failed to sync documents')
    }
  },

  // ── Activity ──────────────────────────────────────────────
  addActivity: async (text, color = 'navy') => {
    try {
      const res = await axios.post(`${API_URL}/activity`, { text, color, time: 'Just now' })
      const item = res.data
      set((s) => ({ activity: [item, ...s.activity].slice(0, 20) }))
    } catch (err) {
      console.error('Failed to add activity:', err)
    }
  },

  // ── Computed helpers ──────────────────────────────────────
  getMattersForClient: (clientId) => get().matters.filter((m) => m.clientId === clientId),
  getDeadlinesForMatter: (matterId) => get().deadlines.filter((d) => d.matterId === matterId),
  getDocumentsForMatter: (matterId) => get().documents.filter((d) => d.matterId === matterId),
  getMattersByType: (type) => get().matters.filter((m) => m.type === type),
}))

// ─────────────────────────────────────────────────────────────
// CALENDAR STORE
// ─────────────────────────────────────────────────────────────
export const useCalendarStore = create((set) => ({
  year:  new Date().getFullYear(),
  month: new Date().getMonth(),
  navigateMonth: (dir) =>
    set((s) => {
      let m = s.month + dir
      let y = s.year
      if (m > 11) { m = 0;  y++ }
      if (m < 0)  { m = 11; y-- }
      return { month: m, year: y }
    }),
}))

// ─────────────────────────────────────────────────────────────
// SYNC STORE
// ─────────────────────────────────────────────────────────────
export const useSyncStore = create((set) => ({
  status: 'synced', // 'synced' | 'syncing'
  lastSynced: 'Today, 10:42 AM',
  startSync: async () => {
    set({ status: 'syncing' })
    try {
      await useDataStore.getState().fetchInitialData()
      set({ status: 'synced', lastSynced: 'Just now' })
    } catch (err) {
      console.error(err)
      set({ status: 'synced' })
    }
  },
}))
