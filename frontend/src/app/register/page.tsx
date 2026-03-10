'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/src/app/components/ui/Button'
import { Input } from '@/src/app/components/ui/Input'
import { Card, CardContent } from '@/src/app/components/ui/Card'
import { toast } from 'sonner'
import { auth, googleProvider } from '@/src/lib/firebase'
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithPopup 
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { Mail, Lock, User, Chrome, ArrowRight, LineChart, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!auth) {
      toast.error('Firebase não inicializado')
      setLoading(false)
      return
    }

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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(userCredential.user)
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          toast.error('Este e-mail já está cadastrado.')
        } else {
          toast.error('Erro ao cadastrar: ' + error.message)
        }
      } else if (error instanceof Error) {
        toast.error('Erro inesperado: ' + error.message)
      } else {
        toast.error('Ocorreu um erro desconhecido.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    if (!auth || !googleProvider) {
      toast.error('Firebase não inicializado')
      return
    }

    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Cadastro com Google realizado!')
      router.refresh()
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
          // Usuário fechou o popup, não mostrar erro
        } else {
          toast.error('Erro no cadastro com Google: ' + error.message)
        }
      } else if (error instanceof Error) {
         toast.error('Erro inesperado: ' + error.message)
      } else {
         toast.error('Ocorreu um erro desconhecido no Google Sign-In.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border/50 shadow-xl backdrop-blur-sm bg-background/95">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Cadastro realizado!
            </h2>
            <p className="text-muted-foreground mb-1">
              Enviamos um link de confirmação para
            </p>
            <p className="font-medium text-foreground mb-4">{email}</p>
            <p className="text-sm text-muted-foreground mb-2">
              Verifique sua caixa de entrada e spam.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Redirecionando para o login...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-white mb-4 shadow-lg shadow-primary/25">
            <LineChart className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">
            Criar Conta
          </h1>
          <p className="text-sm font-body text-muted-foreground mt-2">
            Comece a gerenciar seus investimentos hoje
          </p>
        </div>

        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-background/95">
          <CardContent className="p-8">
            {/* Registro com Google */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full bg-background hover:bg-secondary/10 border-border/50 text-foreground font-medium mb-6"
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              <Chrome className="w-5 h-5 mr-3" />
              {loading ? 'Processando...' : 'Cadastrar com Google'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-background text-muted-foreground">
                  ou cadastre-se com e-mail
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90 block">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="pl-10 bg-secondary/5 border-border/50 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90 block">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="pl-10 bg-secondary/5 border-border/50 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90 block">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-secondary/5 border-border/50 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo de 6 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90 block">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-secondary/5 border-border/50 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg shadow-primary/25 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cadastrando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Criar conta
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground mt-6">
              Ao se cadastrar, você concorda com nossos{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Já tem uma conta?{' '}
          <Link 
            href="/login" 
            className="text-primary font-medium hover:text-primary/80 transition-colors hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}