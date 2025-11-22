import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('buyer')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login'
      const body = mode === 'signup'
        ? { name, email, password, role, phone }
        : { email, password }
      const res = await fetch(API_BASE + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed')
      const data = await res.json()
      onAuthed(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-semibold">{mode === 'signup' ? 'Create account' : 'Welcome back'}</h2>
        <button className="text-blue-300 hover:text-white text-sm" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
          {mode === 'signup' ? 'Have an account? Login' : "New here? Sign up"}
        </button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode === 'signup' && (
          <>
            <input className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder:text-white/50" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
            <div className="grid grid-cols-2 gap-2">
              <select className="px-3 py-2 rounded bg-white/10 text-white" value={role} onChange={e => setRole(e.target.value)}>
                <option value="buyer">Buyer</option>
                <option value="owner">Owner</option>
              </select>
              <input className="px-3 py-2 rounded bg_white/10 text-white placeholder:text-white/50" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </>
        )}
        <input className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder:text-white/50" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder:text-white/50" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="text-red-300 text-sm">{error}</p>}
        <button disabled={loading} className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-60">
          {loading ? 'Please wait…' : (mode === 'signup' ? 'Create account' : 'Login')}
        </button>
      </form>
    </div>
  )
}
