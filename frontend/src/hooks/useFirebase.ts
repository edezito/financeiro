'use client'

import { useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  User
} from 'firebase/auth'
import { auth, getGoogleProvider, getPhoneProvider } from '@/src/lib/firebase'
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
    } catch (error: any) {
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
      const provider = getGoogleProvider()
      if (!provider) throw new Error('Provider não disponível')
      
      await signInWithPopup(auth, provider)
      toast.success('Login com Google realizado!')
      router.refresh()
      router.push('/dashboard')
    } catch (error: any) {
      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const setupRecaptcha = (containerId: string) => {
    if (typeof window === 'undefined' || !auth) return null
    
    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {}
    })
  }

  const sendOTP = async (phoneNumber: string, recaptchaVerifier: any) => {
    if (!auth) {
      toast.error('Firebase não inicializado')
      return null
    }

    setLoading(true)
    try {
      const confirmation = await signInWithPhoneNumber(
        auth, 
        phoneNumber, 
        recaptchaVerifier
      )
      return confirmation
    } catch (error: any) {
      handleAuthError(error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (verificationId: string, otpCode: string) => {
    if (!auth) {
      toast.error('Firebase não inicializado')
      return
    }

    setLoading(true)
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otpCode)
      await signInWithCredential(auth, credential)
      toast.success('Login realizado com sucesso!')
      router.refresh()
      router.push('/dashboard')
    } catch (error: any) {
      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error)
    
    if (error.code === 'auth/invalid-credential') {
      toast.error('E-mail ou senha incorretos.')
    } else if (error.code === 'auth/too-many-requests') {
      toast.error('Muitas tentativas. Tente novamente mais tarde.')
    } else if (error.code === 'auth/popup-closed-by-user') {
      toast.error('Popup fechado antes de completar o login.')
    } else if (error.code === 'auth/cancelled-popup-request') {
      // Ignorar, é apenas outro popup aberto
    } else {
      toast.error('Erro: ' + error.message)
    }
  }

  return {
    user,
    loading,
    loginWithEmail,
    loginWithGoogle,
    sendOTP,
    verifyOTP,
    setupRecaptcha
  }
}