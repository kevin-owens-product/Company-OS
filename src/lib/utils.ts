import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateApiKey(): string {
    return `cf_${crypto.randomBytes(32).toString('hex')}`
}

export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
    })
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
    }).format(amount / 100)
}
