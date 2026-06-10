// services/authService.js
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

export const authService = {
  login: async (email, password) => {
    await delay()
    if (!email || password.length < 4) throw new Error('Invalid credentials')
    return { email, token: 'mock-jwt-token' }
  },
  logout: async () => { await delay(200) },
}

// services/clientService.js
export const clientService = {
  getAll:  async () => { await delay(); return [] },
  create:  async (data) => { await delay(); return data },
  update:  async (id, data) => { await delay(); return { id, ...data } },
  delete:  async (id) => { await delay(); return id },
}

// services/matterService.js
export const matterService = {
  getAll:       async () => { await delay(); return [] },
  getByType:    async (type) => { await delay(); return [] },
  create:       async (data) => { await delay(); return data },
  update:       async (id, data) => { await delay(); return { id, ...data } },
  delete:       async (id) => { await delay(); return id },
}

// services/calendarService.js
export const calendarService = {
  getEvents: async () => { await delay(); return [] },
  addEvent:  async (data) => { await delay(); return data },
  syncWithGoogle: async () => { await delay(1800); return { synced: true, count: 6 } },
}

// services/reportService.js
export const reportService = {
  getMatterDistribution: async () => { await delay(); return {} },
  getStatusBreakdown:    async () => { await delay(); return {} },
  getTopClients:         async () => { await delay(); return [] },
  getMonthlyFilings:     async () => { await delay(); return [] },
}

// services/driveService.js
export const driveService = {
  connect:    async () => { await delay(1500); return { connected: true } },
  syncNow:    async () => { await delay(1800); return { files: 284, synced: true } },
  getFolders: async () => { await delay(); return [] },
  getFiles:   async () => { await delay(); return [] },
}
