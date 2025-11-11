/**
 * Utilidades generales
 * Funciones auxiliares para uso en toda la aplicación
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind CSS de manera óptima
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
