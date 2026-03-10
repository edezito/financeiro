'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/src/app/components/DashboardHeader'
import Lancamentos from '@/src/app/components/Lancamentos'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/app/components/ui/Card'
import { Wallet, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { useAuth } from '@/src/contexts/AuthContext'
import { auth } from '@/src/lib/firebase'
import { signOut } from 'firebase/auth'

const summaryData = {
  saldo: 'R$ 14.570,00',
  patrimonio: 'R$ 21.000,00',
  receitas: 'R$ 12.150,00',
  despesas: 'R$ 2.580,00',
}

export default function Dashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Carregando seus dados...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onLogout={handleLogout} />

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Lancamentos />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body text-muted-foreground">
                      Saldo em Caixa
                    </span>
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-2xl font-display font-bold text-foreground">
                    {summaryData.saldo}
                  </span>
                  <span className="text-xs font-mono text-success block mt-2">
                    +12.5% este mês
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body text-muted-foreground">
                      Patrimônio Investido
                    </span>
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-2xl font-display font-bold text-foreground">
                    {summaryData.patrimonio}
                  </span>
                  <span className="text-xs font-mono text-success block mt-2">
                    +8.2% este mês
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body text-muted-foreground">
                      Receitas
                    </span>
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-2xl font-display font-bold text-foreground">
                    {summaryData.receitas}
                  </span>
                  <span className="text-xs font-mono text-success block mt-2">
                    +4.1%
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body text-muted-foreground">
                      Despesas
                    </span>
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  </div>
                  <span className="text-2xl font-display font-bold text-foreground">
                    {summaryData.despesas}
                  </span>
                  <span className="text-xs font-mono text-destructive block mt-2">
                    +2.3%
                  </span>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Evolução Patrimonial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Gráfico em breve... 🚀
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma transação recente
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}