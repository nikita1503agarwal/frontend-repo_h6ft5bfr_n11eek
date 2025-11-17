import { useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function StoreBuilder({ onDone }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [seller, setSeller] = useState({ name: '', phone: '' })
  const [store, setStore] = useState({ name: '', slug: '', description: '' })
  const [result, setResult] = useState(null)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${apiBase}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seller)
      })
      if (!res.ok) throw new Error('Signup failed')
      const data = await res.json()
      setResult({ seller_id: data.seller_id })
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStore = async (e) => {
    e.preventDefault()
    if (!result?.seller_id) return
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${apiBase}/api/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...store, owner_id: result.seller_id })
      })
      if (!res.ok) throw new Error('Store creation failed')
      const data = await res.json()
      setResult(prev => ({ ...prev, store_id: data.store_id, slug: store.slug }))
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-2">Create your micro-store</h2>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      {step === 1 && (
        <form onSubmit={handleSignup} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input className="w-full border rounded px-3 py-2" required value={seller.name} onChange={e=>setSeller({...seller, name:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone (2547XXXXXXX)</label>
            <input className="w-full border rounded px-3 py-2" required value={seller.phone} onChange={e=>setSeller({...seller, phone:e.target.value})} />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">{loading? 'Creating...' : 'Continue'}</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleCreateStore} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Store Name</label>
            <input className="w-full border rounded px-3 py-2" required value={store.name} onChange={e=>setStore({...store, name:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium">Store Link</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">myshop.africa/</span>
              <input className="flex-1 border rounded px-3 py-2" required value={store.slug} onChange={e=>setStore({...store, slug:e.target.value.replace(/\s+/g,'-').toLowerCase()})} />
            </div>
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">{loading? 'Creating...' : 'Create Store'}</button>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <p className="text-green-700 font-medium">Your store is ready!</p>
          <a href={`/${result.slug}`} className="block w-full bg-emerald-600 text-white text-center py-2 rounded">Open Store</a>
          <button onClick={()=>onDone?.(result)} className="w-full bg-gray-700 text-white py-2 rounded">Done</button>
        </div>
      )}
    </div>
  )
}
