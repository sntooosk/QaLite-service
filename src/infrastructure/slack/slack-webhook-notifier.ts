import { HttpError } from '../../errors.js'
import { SlackNotifier } from '../../application/ports/slack-notifier.js'

export class SlackWebhookNotifier implements SlackNotifier {
  async sendMessage(message: string, webhookUrl?: string | null): Promise<void> {
    const sanitizedWebhookUrl = webhookUrl?.trim()
    if (!sanitizedWebhookUrl) {
      throw new HttpError(400, 'Webhook URL is required.')
    }

    const response = await fetch(sanitizedWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    })

    if (!response.ok) {
      throw new Error(`Slack webhook responded with status ${response.status}`)
    }
  }
}
