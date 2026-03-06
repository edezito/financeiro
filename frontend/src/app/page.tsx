'use client'
import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // O Supabase enviará um link "mágico" para o e-mail do usuário
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      alert('Erro ao enviar e-mail: ' + error.message)
    } else {
      alert('Verifique seu e-mail para acessar o sistema!')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Portfolio Manager 📈</h1>
      <form onSubmit={handleLogin} className="p-8 bg-gray-800 rounded-lg shadow-xl">
        <input
          type="email"
          placeholder="Seu e-mail"
          className="p-2 mb-4 w-full rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-bold transition"
        >
          {loading ? 'Enviando...' : 'Entrar com E-mail'}
        </button>
      </form>
    </div>
  )
}