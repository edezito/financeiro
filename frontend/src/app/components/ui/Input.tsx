// src/components/ui/Input.tsx
import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/src/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'input-base',
          error && 'ring-2 ring-destructive border-destructive',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }