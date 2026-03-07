'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
      }
    }
    
    checkSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-500">Minha Carteira 📈</h1>
        <button 
          onClick={handleLogout}
          className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Sair
        </button>
      </header>
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400 mt-2">Bem-vindo à sua carteira de investimentos.</p>
      </div>
    </div>
  )
}