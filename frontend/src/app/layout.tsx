import { Toaster } from 'sonner'
import { AuthProvider } from '@/src/contexts/AuthContext'
import './globals.css'

export const metadata = {
  title: 'Portfolio Manager',
  description: 'Gerencie seus investimentos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-foreground font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(0, 0%, 10%)',
                color: 'hsl(0, 0%, 96%)',
                border: '1px solid hsl(0, 0%, 17%)',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}