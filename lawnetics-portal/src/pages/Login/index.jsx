import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate     = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const [email, setEmail]       = useState('admin@lawnetics.in')
  const [password, setPassword] = useState('lawnetics')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!email || password.length < 4) { addToast('Invalid credentials', 'er'); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      addToast(err.message || 'Invalid credentials', 'er')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    addToast('Redirecting to Google OAuth…', 'in')
    try {
      await login('admin@lawnetics.in', 'lawnetics')
      navigate('/dashboard')
    } catch (err) {
      addToast('Google login failed: ' + (err.message || 'database error'), 'er')
    }
  }

  return (
    <div className="min-h-screen login-gradient flex items-center justify-center p-4">
      <div
        className="glass-card border border-white/10 rounded-[18px] p-[2.4rem_2.8rem] w-full max-w-[420px] shadow-lg"
        style={{ animation: 'bounceIn 0.5s ease' }}
      >
        {/* Logo / Brand */}
        <div className="text-center mb-[0.4rem]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-org to-navy mb-3 shadow-org">
            <span className="text-[1.1rem] font-black text-white tracking-tight">
              <span className="text-org-light">L</span>N
            </span>
          </div>
        </div>
        <p className="font-serif text-[2rem] font-bold text-center leading-none mb-[0.1rem]">
          <span className="text-org">Law</span>
          <span className="text-white">Netics</span>
        </p>
        <p className="font-serif text-[0.92rem] text-org italic text-center mb-[0.2rem]">
          Your Creation, Your Right
        </p>
        <p className="text-[0.67rem] text-white/28 tracking-[0.04em] text-center mb-[1.6rem]">
          www.lawnetics.in &nbsp;·&nbsp; info@lawnetics.in
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="mt-3">
            <label className="block text-[0.63rem] font-bold tracking-[0.14em] uppercase text-white/40 mb-[0.35rem]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@lawnetics.in"
              className="w-full bg-white/[0.06] border border-white/10 text-white rounded-[7px] px-[0.9rem] py-[0.62rem] text-[0.85rem] outline-none transition-all placeholder:text-white/20 focus:border-org focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(232,80,32,.2)]"
            />
          </div>
          <div className="mt-3">
            <label className="block text-[0.63rem] font-bold tracking-[0.14em] uppercase text-white/40 mb-[0.35rem]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              className="w-full bg-white/[0.06] border border-white/10 text-white rounded-[7px] px-[0.9rem] py-[0.62rem] text-[0.85rem] outline-none transition-all placeholder:text-white/20 focus:border-org focus:bg-white/10 focus:shadow-[0_0_0_3px_rgba(232,80,32,.2)]"
            />
          </div>
        </form>

        <p className="text-[0.66rem] text-white/25 text-center mt-[0.85rem] mb-[1rem]">
          Demo: admin@lawnetics.in / lawnetics
        </p>

        {/* Login button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full org-gradient text-white border-none rounded-[8px] py-[0.72rem] text-[0.83rem] font-extrabold tracking-[0.08em] uppercase cursor-pointer mb-[0.7rem] shadow-org transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(232,80,32,.45)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in…' : 'Sign In to Docket Portal'}
        </button>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full bg-white/[0.06] border border-white/12 text-white/65 rounded-[7px] py-[0.6rem] text-[0.78rem] font-medium cursor-pointer flex items-center justify-center gap-[0.6rem] transition-all hover:bg-white/10 hover:text-white"
        >
          <svg width="17" height="17" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        {/* Footer */}
        <div className="mt-6 text-center text-[0.67rem] text-white/25 space-y-0.5">
          <p>LawNetics IP Docketing Portal © 2026</p>
          <p>
            <a href="https://www.lawnetics.in" target="_blank" rel="noreferrer" className="text-cyan hover:underline">www.lawnetics.in</a>
            &nbsp;·&nbsp;
            <a href="mailto:info@lawnetics.in" className="text-cyan hover:underline">info@lawnetics.in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
