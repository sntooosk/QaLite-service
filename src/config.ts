import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const envPath = resolve(process.cwd(), '.env')

const loadEnvFile = (): void => {
  if (!existsSync(envPath)) return

  readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .forEach((line) => {
      const [key, ...rest] = line.split('=')
      if (!key || process.env[key]) return

      process.env[key] = rest
        .join('=')
        .trim()
        .replace(/^['"]|['"]$/g, '')
    })
}

const parseList = (value: string | undefined, fallback: string[]): string[] =>
  value
    ?.split(',')
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [...fallback]

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://qualitydigital-qamanager.vercel.app',
]

loadEnvFile()

export interface AppConfig {
  allowedOrigins: string[]
  port: number
  isProduction: boolean
}

export const config: AppConfig = {
  allowedOrigins: parseList(process.env.ALLOWED_ORIGINS, DEFAULT_ALLOWED_ORIGINS),
  port: Number.parseInt(process.env.PORT ?? '3000', 10) || 3000,
  isProduction: process.env.NODE_ENV === 'production',
}
