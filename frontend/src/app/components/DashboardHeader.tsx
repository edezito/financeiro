// src/components/DashboardHeader.tsx
'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/src/app/components/ui/Button'

interface DashboardHeaderProps {
  onLogout?: () => void
}

export default function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="text-lg font-display font-bold text-foreground tracking-tight">
          Portfolio Manager
        </h1>
        {onLogout && (
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        )}
      </div>
    </header>
  )
}