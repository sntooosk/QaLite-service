# QA Manager Proxy API

Servidor HTTP minimalista escrito em TypeScript que encaminha resumos de QA para um webhook do Slack informado pelo frontend. O projeto segue uma estrutura enxuta em camadas (configuração, aplicação, domínio, infraestrutura e interfaces) para manter a separação de responsabilidades sem frameworks externos.

## Endpoints

| Método | Rota                  | Descrição                                                   |
| ------ | --------------------- | ----------------------------------------------------------- |
| `GET`  | `/health`             | Verificação rápida de disponibilidade.                      |
| `GET`  | `/openapi.json`       | Documento OpenAPI 3.0 usado pelo Swagger UI.                |
| `GET`  | `/docs`               | Interface do Swagger UI servida via CDN.                    |
| `POST` | `/slack/task-summary` | Recebe um resumo de QA e repassa para o webhook informado no payload. |

> Caso não precise da interface visual, consuma diretamente a especificação em `/openapi.json`.

## Variáveis de ambiente

Crie um arquivo `.env` (opcional) com os valores abaixo:

```bash
ALLOWED_ORIGINS=http://localhost:5173,https://seu-frontend.com
PORT=3000
```

> O webhook do Slack não é mais lido via `.env`; ele deve ser enviado no campo `webhookUrl` do corpo da requisição.

## Como executar

```bash
npm install
npm run build   # Transpila TypeScript para dist/
npm start       # Executa o servidor já compilado
# ou
npm run dev     # Assiste alterações e recompila automaticamente
```

## Qualidade e formatação

```bash
npm run lint    # Lembre de rodar o build antes para gerar dist/
npm run format  # Formata todo o código com Prettier
```

## Estrutura de pastas

- `src/config.ts`: leitura de variáveis de ambiente e defaults de CORS/porta.
- `src/application`: casos de uso e portas (ex.: `SendTaskSummaryUseCase`).
- `src/domain`: contratos e formatação de mensagens enviadas ao Slack.
- `src/infrastructure`: integrações concretas (ex.: webhook do Slack).
- `src/interfaces/http`: roteador HTTP, CORS, Swagger UI e handlers.

## Husky e commit lint

Os hooks vivem em `.husky/`. Após instalar dependências, rode `npm run prepare` para ativá-los. O hook `commit-msg` usa o Commitlint com a configuração convencional:

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

Caso precise ativar manualmente, use `git config core.hooksPath .husky`.
