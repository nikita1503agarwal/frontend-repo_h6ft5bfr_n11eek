import StoreBuilder from './components/StoreBuilder'
import { useState } from 'react'

function App() {
  const [done, setDone] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 p-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center py-6">
          <h1 className="text-3xl font-extrabold tracking-tight">WhatsApp → MPesa Microstore</h1>
          <p className="text-gray-600 mt-2">Create a shop in under 2 minutes. Share on WhatsApp. Get paid via STK Push.</p>
        </div>

        <StoreBuilder onDone={setDone} />

        {done && (
          <div className="mt-6 bg-white rounded-xl p-4 border">
            <h3 className="font-semibold mb-2">Share your link</h3>
            <div className="flex items-center gap-2">
              <input readOnly className="flex-1 border rounded px-3 py-2" value={`myshop.africa/${done.slug}`} />
              <a href={`/${done.slug}`} className="bg-black text-white px-3 py-2 rounded">Open</a>
              <a href={`https://wa.me/?text=${encodeURIComponent('Shop my products at myshop.africa/'+done.slug)}`} target="_blank" className="bg-green-600 text-white px-3 py-2 rounded">Share on WhatsApp</a>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-gray-500 mt-8">Optimized for Kenya’s mobile users</div>
      </div>
    </div>
  )
}

export default App