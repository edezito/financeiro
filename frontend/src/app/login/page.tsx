'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/src/app/components/ui/Button'
import { Input } from '@/src/app/components/ui/Input'
import { Card, CardContent } from '@/src/app/components/ui/Card'
import { toast } from 'sonner'
import { auth, googleProvider } from '@/src/lib/firebase'
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { 
  Mail, 
  Lock, 
  Chrome, 
  ArrowRight, 
  LineChart, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [resetPasswordMode, setResetPasswordMode] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const router = useRouter()

  // Verificar se já está logado
  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard')
      }
    })
    return () => unsubscribe?.()
  }, [router])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('E-mail é obrigatório')
      return false
    } else if (!re.test(email)) {
      setEmailError('E-mail inválido')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Senha é obrigatória')
      return false
    } else if (password.length < 6) {
      setPasswordError('Senha deve ter pelo menos 6 caracteres')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    
    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)

    try {
      if (!auth) throw new Error('Firebase não inicializado')
      
      await signInWithEmailAndPassword(auth, email, password)
      
      // Se "lembrar de mim" estiver marcado, a persistência já está configurada
      toast.success('Login realizado com sucesso!', {
        icon: <CheckCircle2 className="w-4 h-4 text-success" />,
        duration: 3000,
      })
      
      router.refresh()
      router.push('/dashboard')
    } catch (error: unknown) {
      console.error('Erro no login:', error)
      
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          toast.error('E-mail ou senha incorretos.', {
            icon: <AlertCircle className="w-4 h-4 text-destructive" />,
          })
        } else if (error.code === 'auth/too-many-requests') {
          toast.error('Muitas tentativas. Tente novamente mais tarde.')
        } else if (error.code === 'auth/user-disabled') {
          toast.error('Esta conta foi desativada.')
        } else if (error.code === 'auth/network-request-failed') {
          toast.error('Erro de conexão. Verifique sua internet.')
        } else {
          toast.error('Erro ao fazer login: ' + error.message)
        }
      } else if (error instanceof Error) {
        toast.error('Erro inesperado: ' + error.message)
      } else {
        toast.error('Ocorreu um erro desconhecido durante o login.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      if (!auth || !googleProvider) throw new Error('Firebase não inicializado')
      
      await signInWithPopup(auth, googleProvider)
      
      toast.success('Login com Google realizado!', {
        icon: <CheckCircle2 className="w-4 h-4 text-success" />,
      })
      
      router.refresh()
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
          // Usuário fechou o popup - não mostrar erro
        } else if (error.code === 'auth/popup-blocked') {
          toast.error('Popup bloqueado. Permita popups para este site.')
        } else {
          toast.error('Erro no login com Google: ' + error.message)
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

  const handleResetPassword = async () => {
    if (!validateEmail(email)) return

    setLoading(true)
    try {
      if (!auth) throw new Error('Firebase não inicializado')
      
      await sendPasswordResetEmail(auth, email)
      setResetEmailSent(true)
      
      toast.success('E-mail de recuperação enviado!', {
        icon: <CheckCircle2 className="w-4 h-4 text-success" />,
      })
      
      setTimeout(() => {
        setResetPasswordMode(false)
        setResetEmailSent(false)
      }, 5000)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') {
          toast.error('E-mail não encontrado.')
        } else {
          toast.error('Erro ao enviar e-mail: ' + error.message)
        }
      } else if (error instanceof Error) {
        toast.error('Erro inesperado: ' + error.message)
      } else {
        toast.error('Ocorreu um erro desconhecido na recuperação de senha.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Tela de recuperação de senha
  if (resetPasswordMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-white mb-4 shadow-lg shadow-primary/25">
              <LineChart className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
              Recuperar senha
            </h1>
          </div>

          <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-background/95">
            <CardContent className="p-8">
              {resetEmailSent ? (
                <div className="text-center">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">E-mail enviado!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enviamos instruções para recuperar sua senha para:
                  </p>
                  <p className="text-sm font-medium text-foreground mb-4">{email}</p>
                  <p className="text-xs text-muted-foreground">
                    Verifique sua caixa de entrada e spam.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4"
                    onClick={() => {
                      setResetPasswordMode(false)
                      setResetEmailSent(false)
                    }}
                  >
                    Voltar para o login
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    Digite seu e-mail e enviaremos instruções para redefinir sua senha.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/90 block">
                        E-mail
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            validateEmail(e.target.value)
                          }}
                          placeholder="seu@email.com"
                          className={`pl-10 bg-secondary/5 border-border/50 focus:border-primary/50 transition-colors ${
                            emailError ? 'border-destructive' : ''
                          }`}
                        />
                      </div>
                      {emailError && (
                        <p className="text-xs text-destructive mt-1">{emailError}</p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="default"
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg shadow-primary/25"
                      onClick={handleResetPassword}
                      disabled={loading || !!emailError}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        'Enviar instruções'
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setResetPasswordMode(false)}
                    >
                      Voltar para o login
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Tela de login principal
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-white mb-4 shadow-lg shadow-primary/25 animate-pulse">
            <LineChart className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">
            Portfolio Manager
          </h1>
          <p className="text-sm font-body text-muted-foreground mt-2">
            Gerencie seus investimentos de forma inteligente
          </p>
        </div>

        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-background/95">
          <CardContent className="p-8">
            {/* Login com Google */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full bg-background hover:bg-secondary/10 border-border/50 text-foreground font-medium mb-6 hover:border-primary/50 transition-all duration-200"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Chrome className="w-5 h-5 mr-3" />
              Continuar com Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-background text-muted-foreground">
                  ou entre com e-mail
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90 block">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      validateEmail(e.target.value)
                    }}
                    onBlur={() => validateEmail(email)}
                    placeholder="seu@email.com"
                    className={`pl-10 bg-secondary/5 border-border/50 focus:border-primary/50 transition-colors ${
                      emailError ? 'border-destructive focus:border-destructive' : ''
                    }`}
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-destructive mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {emailError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90 block">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      validatePassword(e.target.value)
                    }}
                    onBlur={() => validatePassword(password)}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 bg-secondary/5 border-border/50 focus:border-primary/50 transition-colors ${
                      passwordError ? 'border-destructive focus:border-destructive' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-destructive mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border/50 bg-secondary/5 text-primary focus:ring-primary/20 focus:ring-offset-0"
                  />
                  <span className="text-sm text-muted-foreground">Lembrar-me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setResetPasswordMode(true)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Entrar
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Ainda não tem uma conta?{' '}
          <Link 
            href="/register" 
            className="text-primary font-medium hover:text-primary/80 transition-colors hover:underline"
          >
            Criar conta gratuita
          </Link>
        </p>
      </div>
    </div>
  )
}