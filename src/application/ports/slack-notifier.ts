export interface SlackNotifier {
  sendMessage(message: string, webhookUrl?: string | null): Promise<void>
}
