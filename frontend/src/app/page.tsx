import Link from 'next/link'
import { Button } from '@/src/app/components/ui/Button'
import { LineChart, TrendingUp, Shield, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              Portfolio Manager
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="default" size="sm">
                Cadastrar
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Gerencie seus investimentos
            <span className="text-primary block mt-2">de forma inteligente</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Acompanhe sua carteira, receitas e despesas em um só lugar. 
            Tome decisões melhores com dados em tempo real.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                Começar agora
                <TrendingUp className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Acompanhamento em tempo real</h3>
            <p className="text-muted-foreground">
              Veja a evolução dos seus investimentos atualizada automaticamente
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Segurança e privacidade</h3>
            <p className="text-muted-foreground">
              Seus dados protegidos com autenticação do Firebase
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interface intuitiva</h3>
            <p className="text-muted-foreground">
              Design pensado para facilitar o gerenciamento da sua carteira
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}