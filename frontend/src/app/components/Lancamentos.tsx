// src/components/Lancamentos.tsx
'use client'

import { useState} from 'react'
import { Button } from '@/src/app/components/ui/Button'
import { Input } from '@/src/app/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/src/app/components/ui/Card'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'

export default function Lancamentos() {
  const [activeTab, setActiveTab] = useState<'caixa' | 'ativos'>('caixa')
  const [pulseClass, setPulseClass] = useState('')
  
  // Estados - Caixa
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [financeType, setFinanceType] = useState('receita')

  // Estados - Ativos
  const [ticker, setTicker] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [tradeType, setTradeType] = useState('compra')

  const triggerPulse = () => {
    const cls = activeTab === 'caixa' ? 'animate-pulse-caixa' : 'animate-pulse-ativos'
    setPulseClass(cls)
    setTimeout(() => setPulseClass(''), 250)
  }

  const handleKeyDown = (e: React.KeyboardEvent, nextRef?: HTMLElement | null) => {
    if (e.key === 'Enter' && nextRef) {
      e.preventDefault()
      triggerPulse()
      nextRef.focus()
    }
  }

  const handleFinanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) {
      toast.error('Preencha todos os campos')
      return
    }

    try {
      const res = await fetch(`${API_URL}/finance/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          type: financeType,
        }),
      })

      if (res.ok) {
        toast.success('Transação salva com sucesso')
        setDescription('')
        setAmount('')
      } else {
        toast.error('Erro ao salvar transação')
      }
    } catch {
      toast.error('Erro de conexão com o servidor')
    }
  }

  const handleTradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticker || !quantity || !price) {
      toast.error('Preencha todos os campos')
      return
    }

    try {
      const res = await fetch(`${API_URL}/portfolio/trade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: ticker.toUpperCase(),
          quantity: parseInt(quantity),
          price: parseFloat(price),
          type: tradeType,
        }),
      })

      if (res.ok) {
        toast.success('Ordem executada com sucesso')
        setTicker('')
        setQuantity('')
        setPrice('')
      } else {
        const errorData = await res.json()
        toast.error(`Erro: ${errorData.detail || 'Falha ao executar ordem'}`)
      }
    } catch {
      toast.error('Erro de conexão com o servidor')
    }
  }

  return (
    <Card className={pulseClass}>
      <CardHeader>
        <CardTitle>Novos Lançamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex mb-6 border-b border-border">
          <button
            className={`flex-1 pb-3 font-body text-sm font-medium transition-colors duration-200 ${
              activeTab === 'caixa'
                ? 'border-b-2 border-interactive text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('caixa')}
          >
            Caixa
          </button>
          <button
            className={`flex-1 pb-3 font-body text-sm font-medium transition-colors duration-200 ${
              activeTab === 'ativos'
                ? 'border-b-2 border-interactive text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('ativos')}
          >
            Ativos
          </button>
        </div>

        {/* Caixa Form */}
        {activeTab === 'caixa' && (
          <form onSubmit={handleFinanceSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Descrição (ex: Salário)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="caixa-desc"
              onKeyDown={(e) =>
                handleKeyDown(e, document.getElementById('caixa-amount'))
              }
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Valor (R$)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono"
              id="caixa-amount"
              onKeyDown={(e) =>
                handleKeyDown(e, document.getElementById('caixa-type'))
              }
            />
            <select
              value={financeType}
              onChange={(e) => setFinanceType(e.target.value)}
              className="select-base"
              id="caixa-type"
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
            <Button
              type="submit"
              variant={financeType === 'receita' ? 'success' : 'destructive'}
              size="lg"
              className="w-full mt-2"
            >
              Lançar {financeType === 'receita' ? 'Receita' : 'Despesa'}
            </Button>
          </form>
        )}

        {/* Ativos Form */}
        {activeTab === 'ativos' && (
          <form onSubmit={handleTradeSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Ticker (ex: PETR4)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="font-mono uppercase"
              id="ativos-ticker"
              onKeyDown={(e) =>
                handleKeyDown(e, document.getElementById('ativos-qty'))
              }
            />
            <Input
              type="number"
              placeholder="Quantidade"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="font-mono"
              id="ativos-qty"
              onKeyDown={(e) =>
                handleKeyDown(e, document.getElementById('ativos-price'))
              }
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Preço (R$)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="font-mono"
              id="ativos-price"
              onKeyDown={(e) =>
                handleKeyDown(e, document.getElementById('ativos-type'))
              }
            />
            <select
              value={tradeType}
              onChange={(e) => setTradeType(e.target.value)}
              className="select-base"
              id="ativos-type"
            >
              <option value="compra">Comprar</option>
              <option value="venda">Vender</option>
            </select>
            <Button
              type="submit"
              variant={tradeType === 'compra' ? 'success' : 'destructive'}
              size="lg"
              className="w-full mt-2"
            >
              {tradeType === 'compra' ? 'Comprar' : 'Vender'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}