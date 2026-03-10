// src/app/register/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/src/app/components/ui/Button'
import { Input } from '@/src/app/components/ui/Input'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      toast.success('Cadastro realizado! Verifique seu e-mail.')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground mb-2">
            Cadastro realizado!
          </h2>
          <p className="text-sm font-body text-muted-foreground mb-1">
            Enviamos um link de confirmação para {email}
          </p>
          <p className="text-xs font-body text-muted-foreground">
            Verifique sua caixa de entrada e spam.
          </p>
          <p className="text-xs font-body text-muted-foreground mt-4">
            Redirecionando para o login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Criar Conta
          </h1>
          <p className="text-sm font-body text-muted-foreground mt-2">
            Cadastre-se para gerenciar seus investimentos
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-body text-muted-foreground mb-1.5 block">
              E-mail
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="text-xs font-body text-muted-foreground mb-1.5 block">
              Senha
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <p className="text-xs font-body text-muted-foreground mt-1">
              Mínimo de 6 caracteres
            </p>
          </div>
          <div>
            <label className="text-xs font-body text-muted-foreground mb-1.5 block">
              Confirmar Senha
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <p className="text-center text-sm font-body text-muted-foreground mt-6">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-interactive hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}