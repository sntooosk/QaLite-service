import { ServerResponse } from 'node:http'

export const json = (res: ServerResponse, statusCode: number, payload: unknown): void => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export const html = (res: ServerResponse, statusCode: number, content: string): void => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(content)
}
