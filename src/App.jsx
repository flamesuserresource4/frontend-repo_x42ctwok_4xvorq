import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import PropertyCard from './components/PropertyCard'
import PropertyForm from './components/PropertyForm'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [user, setUser] = useState(null)
  const [properties, setProperties] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const load = async () => {
    setLoading(true)
    const url = new URL(API_BASE + '/properties')
    if (query) url.searchParams.set('q', query)
    if (status) url.searchParams.set('status', status)
    const res = await fetch(url)
    const data = await res.json()
    setProperties(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const contactOwner = async (item) => {
    if (!user) return
    const res = await fetch(API_BASE + '/properties/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id: item.id, buyer_id: user.user_id, message: 'Interested in this property' })
    })
    if (res.ok) setToast('Owner has been notified. They will reach out soon.')
  }

  const lockProperty = async (item) => {
    if (!user) return
    const res = await fetch(API_BASE + '/properties/lock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id: item.id, buyer_id: user.user_id })
    })
    if (res.ok) {
      setToast('Property locked for you! The owner will contact you to proceed.')
      load()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="sticky top-0 z-10 bg-slate-900/70 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="text-2xl font-bold">RaigadFarmBazaar</div>
          <div className="flex-1 flex items-center gap-2">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by title or location" className="flex-1 px-3 py-2 rounded bg-white/10 placeholder:text-white/50" />
            <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded bg-white/10">
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="locked">Locked</option>
              <option value="sold">Sold</option>
            </select>
            <button onClick={load} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">Search</button>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-3 text-sm">
                <span>{user.name} · {user.role}</span>
                <button onClick={() => setUser(null)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Logout</button>
              </div>
            ) : (
              <span className="text-white/70 text-sm">Login to list or lock properties</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-white/60">Loading properties…</div>
          ) : properties.length ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {properties.map(p => (
                <PropertyCard key={p.id} item={p} currentUser={user} onContact={contactOwner} onLock={lockProperty} />
              ))}
            </div>
          ) : (
            <div className="text-white/60">No properties found.</div>
          )}
        </div>
        <div className="space-y-4">
          {!user && <Auth onAuthed={setUser} />}
          {user && user.role === 'owner' && (
            <PropertyForm owner={user} onCreated={() => { setToast('Property listed successfully'); load() }} />
          )}
          {user && user.role === 'buyer' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-2">How it works</h3>
              <ol className="list-decimal list-inside text-white/80 text-sm space-y-1">
                <li>Browse properties and contact owners for details</li>
                <li>Lock your preferred property for priority consideration</li>
                <li>No fees. Direct conversation with owners</li>
              </ol>
            </div>
          )}
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/10 border border-white/20 backdrop-blur px-4 py-2 rounded-lg text-sm">
          {toast}
          <button className="ml-3 text-blue-300" onClick={() => setToast('')}>Close</button>
        </div>
      )}
    </div>
  )
}

export default App
