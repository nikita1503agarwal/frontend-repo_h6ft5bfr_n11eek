import { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function StoreFront({ slug }) {
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [checkoutState, setCheckoutState] = useState({ loading: false, message: '' })
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const load = async () => {
      const s = await fetch(`${apiBase}/api/store/${slug}`).then(r=>r.json())
      setStore(s)
      const p = await fetch(`${apiBase}/api/products/${slug}`).then(r=>r.json())
      setProducts(p)
    }
    load()
  }, [slug])

  const addToCart = (p) => {
    setCart(prev => {
      const existing = prev.find(i=>i.product_id===p._id)
      if (existing) return prev.map(i=> i.product_id===p._id? {...i, quantity: i.quantity+1} : i)
      return [...prev, { product_id: p._id, name: p.name, price: p.price, quantity: 1 }]
    })
  }

  const total = cart.reduce((t,i)=>t+i.price*i.quantity,0)

  const checkout = async () => {
    if (!phone) return
    setCheckoutState({ loading: true, message: '' })
    try {
      const res = await fetch(`${apiBase}/api/checkout`, {
        method: 'POST', headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ store_slug: slug, items: cart, customer: { phone } })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Checkout failed')
      setCheckoutState({ loading:false, message: `Payment ${data.status}. Order ${data.order_id}` })
      setCart([])
    } catch (e) {
      setCheckoutState({ loading:false, message: e.message })
    }
  }

  if (!store) return <div className="text-center py-10">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{store.name}</h1>
      {store.description && <p className="text-gray-600">{store.description}</p>}

      <div className="grid grid-cols-2 gap-3 mt-4">
        {products.map(p=> (
          <div key={p._id} className="border rounded-lg p-3 bg-white">
            {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-32 object-cover rounded"/>}
            <h3 className="font-semibold mt-2">{p.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold">KES {p.price}</span>
              <button onClick={()=>addToCart(p)} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Add</button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-3 left-0 right-0">
        <div className="max-w-3xl mx-auto bg-white border rounded-xl p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Cart • {cart.reduce((c,i)=>c+i.quantity,0)} items</span>
            <span className="font-bold">KES {total.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex gap-2">
            <input placeholder="2547XXXXXXX" value={phone} onChange={e=>setPhone(e.target.value)} className="flex-1 border rounded px-3 py-2"/>
            <button disabled={!cart.length || checkoutState.loading} onClick={checkout} className="bg-emerald-600 text-white px-4 rounded disabled:opacity-50">{checkoutState.loading? 'Processing...' : 'Pay via MPesa'}</button>
          </div>
          {checkoutState.message && <p className="text-sm mt-1">{checkoutState.message}</p>}
        </div>
      </div>
    </div>
  )
}
