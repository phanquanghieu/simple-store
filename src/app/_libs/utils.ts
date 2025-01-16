import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function iLikeContains(text: string, search: string) {
  return text.toLowerCase().includes(search.toLowerCase())
}
