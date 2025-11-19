import { IncomingMessage, ServerResponse } from 'node:http'

import { openApiDocument } from './openapi.js'
import { html, json } from './http-response.js'

const swaggerUiHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>QA Manager Proxy API</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #0b131a; }
      #swagger-ui { min-height: 100vh; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        SwaggerUIBundle({
          url: '/openapi.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
        })
      }
    </script>
  </body>
</html>`

export const handleOpenApiJson = async (
  _req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  json(res, 200, openApiDocument)
}

export const handleSwaggerUi = async (
  _req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  html(res, 200, swaggerUiHtml)
}
