import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/src/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Adicionado 'outline' aqui para o TS parar de reclamar
  variant?: 'default' | 'success' | 'destructive' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-interactive text-white hover:bg-interactive/90',
      success: 'bg-success text-black hover:bg-success/90',
      destructive: 'bg-destructive text-black hover:bg-destructive/90',
      ghost: 'bg-transparent hover:bg-accent text-muted-foreground hover:text-foreground',
      // Definição visual do outline
      outline: 'bg-transparent border border-border hover:bg-secondary/10 text-foreground',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-md font-display font-medium transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }