'use client'

import { useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth, googleProvider } from '@/src/lib/firebase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useFirebaseAuth() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!auth) return

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const handleAuthError = (error: unknown) => {
    if (error instanceof FirebaseError) {
      toast.error(`Erro de autenticação: ${error.message} (Código: ${error.code})`)
    } else if (error instanceof Error) {
      toast.error(`Erro inesperado: ${error.message}`)
    } else {
      toast.error('Ocorreu um erro desconhecido.')
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    if (!auth) {
      toast.error('Firebase não inicializado')
      return
    }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Login realizado com sucesso!')
      router.refresh()
      router.push('/dashboard')
    } catch (error: unknown) {
      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    if (!auth) {
      toast.error('Firebase não inicializado')
      return
    }

    setLoading(true)
    try {
      if (!googleProvider) throw new Error('Provider não disponível')
      
      await signInWithPopup(auth, googleProvider)
      toast.success('Login com Google realizado!')
      router.refresh()
      router.push('/dashboard')
    } catch (error: unknown) {
      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const setupRecaptcha = (containerId: string) => {
    if (typeof window === 'undefined' || !auth) return null
    
    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible'
    })
  }

  const loginWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
     if (!auth) {
      toast.error('Firebase não inicializado')
      return null
    }

    setLoading(true)
    try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        return confirmationResult
    } catch (error: unknown) {
        handleAuthError(error)
        return null
    } finally {
        setLoading(false)
    }
  }

  const verifyOTP = async (confirmationResult: ConfirmationResult, code: string) => {
      setLoading(true)
      try {
          await confirmationResult.confirm(code)
          toast.success('Login por telefone realizado com sucesso!')
          router.refresh()
          router.push('/dashboard')
      } catch (error: unknown) {
          handleAuthError(error)
      } finally {
          setLoading(false)
      }
  }

  return {
      loading,
      user,
      loginWithEmail,
      loginWithGoogle,
      setupRecaptcha,
      loginWithPhone,
      verifyOTP
  }
}