import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function PropertyForm({ owner, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [size, setSize] = useState('')
  const [images, setImages] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        title,
        description,
        price: parseFloat(price),
        location,
        size_sqft: size ? parseFloat(size) : null,
        images: images ? images.split(',').map(s => s.trim()).filter(Boolean) : [],
        owner_id: owner.user_id,
        owner_name: owner.name,
        owner_phone: owner.phone || ''
      }
      const res = await fetch(API_BASE + '/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed')
      const data = await res.json()
      onCreated(data)
      setTitle(''); setDescription(''); setPrice(''); setLocation(''); setSize(''); setImages('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-3">List a new property</h3>
      <form onSubmit={submit} className="grid grid-cols-1 gap-3">
        <input className="px-3 py-2 rounded bg-white/10 text-white placeholder:text-white/50" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="px-3 py-2 rounded bg-white/10 text-white placeholder:text-white/50" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <input className="px-3 py-2 rounded bg-white/10 text-white placeholder:text-white/50" placeholder="Price (INR)" value={price} onChange={e => setPrice(e.target.value)} required />
          <input className="px-3 py-2 rounded bg-white/10 text-white placeholder:text-white/50" placeholder="Size (sqft)" value={size} onChange={e => setSize(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="px-3 py-2 rounded bg-white/10 text-white placeholder:text-white/50" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
          <input className="px-3 py-2 rounded bg-white/10 text-white placeholder:text-white/50" placeholder="Image URLs (comma separated)" value={images} onChange={e => setImages(e.target.value)} />
        </div>
        {error && <p className="text-red-300 text-sm">{error}</p>}
        <button disabled={loading} className="py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-60">{loading ? 'Listing…' : 'Create listing'}</button>
      </form>
    </div>
  )
}
