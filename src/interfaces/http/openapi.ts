import { config } from '../../config.js'

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'QA Manager Proxy API',
    version: '2.0.0',
    description:
      'API minimalista que recebe resumos de execução de QA e os encaminha para um webhook do Slack.',
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: 'Ambiente local',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Status da API',
        description: 'Usada para monitoramento e health-checks simples.',
        responses: {
          200: {
            description: 'API disponível.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/slack/task-summary': {
      post: {
        summary: 'Enviar resumo de QA para o Slack',
        description:
          'Aceita um resumo estruturado ou uma mensagem pronta e encaminha para o webhook configurado.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/TaskSummaryPayload' },
                  {
                    type: 'object',
                    required: ['message'],
                    properties: {
                      message: {
                        type: 'string',
                        description: 'Mensagem já formatada para o Slack.',
                        example: 'Deploy concluído com sucesso.',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Mensagem enviada ao Slack.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Slack task summary sent.' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Erro de validação ou payload inválido.',
          },
          503: {
            description: 'Webhook do Slack não configurado.',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      TaskSummaryPayload: {
        type: 'object',
        required: ['environmentSummary'],
        properties: {
          message: {
            type: 'string',
            description:
              'Mensagem enviada diretamente ao Slack (ignorando o resumo detalhado).',
          },
          environmentSummary: { $ref: '#/components/schemas/EnvironmentSummaryPayload' },
        },
      },
      EnvironmentSummaryPayload: {
        type: 'object',
        properties: {
          identifier: { type: 'string', description: 'Nome ou id do ambiente testado.' },
          totalTime: {
            type: 'string',
            description: 'Tempo total em texto.',
            example: '00:15:30',
          },
          totalTimeMs: {
            type: 'integer',
            format: 'int64',
            description: 'Tempo total em milissegundos.',
          },
          scenariosCount: { type: 'integer', minimum: 0, example: 10 },
          executedScenariosCount: { type: 'integer', minimum: 0, example: 10 },
          executedScenariosMessage: {
            type: 'string',
            description: 'Mensagem pronta sobre cenários executados.',
          },
          fix: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['bug', 'storyfixes'] },
              value: { type: 'integer', minimum: 0 },
            },
          },
          jira: { type: 'string', description: 'Chave do Jira relacionada à execução.' },
          suiteName: { type: 'string', description: 'Nome da suíte executada.' },
          suiteDetails: {
            type: 'string',
            description: 'Detalhes adicionais sobre a suíte.',
          },
          participantsCount: { type: 'integer', minimum: 0 },
          monitoredUrls: {
            type: 'array',
            items: { type: 'string', format: 'uri' },
          },
          attendees: {
            type: 'array',
            items: {
              oneOf: [
                { $ref: '#/components/schemas/EnvironmentSummaryAttendee' },
                { type: 'string', description: 'Nome ou email simples.' },
              ],
            },
          },
        },
      },
      EnvironmentSummaryAttendee: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
    },
  },
} as const
