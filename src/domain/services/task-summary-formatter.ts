import { EnvironmentSummaryPayload, TaskSummaryPayload } from '../entities/task-summary.js'

type Primitive = string | number | boolean | undefined | null

const asText = (value: Primitive): string => {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

const withFallback = (value: Primitive, fallback = 'Não informado'): string => {
  const sanitized = asText(value)
  return sanitized || fallback
}

const formatDurationHMS = (milliseconds?: number): string => {
  if (typeof milliseconds !== 'number' || Number.isNaN(milliseconds) || milliseconds < 0) {
    return ''
  }

  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (value: number): string => value.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

type AttendeeEntry = NonNullable<EnvironmentSummaryPayload['attendees']>[number]

const formatAttendee = (entry?: AttendeeEntry): string => {
  if (!entry) return ''

  if (typeof entry === 'string') return entry.trim()

  const name = asText(entry.name)
  const email = asText(entry.email)

  if (name && email) return `${name} (${email})`

  return name || email
}

const numberField = (value?: number, fallback = '0'): string =>
  typeof value === 'number' && value >= 0 ? String(value) : fallback

const formatList = (entries?: (string | undefined | null)[]): string[] =>
  entries
    ?.map((value) => value?.trim())
    .filter((value): value is string => Boolean(value)) ?? []

export class TaskSummaryFormatter {
  buildMessage({ environmentSummary }: TaskSummaryPayload): string {
    const summary = environmentSummary ?? {}
    const lines: string[] = ['✨ *Resumo de QA*', '']

    const pushField = (label: string, value: Primitive): void => {
      lines.push(`• *${label}:* ${withFallback(value)}`)
    }

    pushField('Ambiente', summary.identifier)

    pushField('Tempo total', summary.totalTime || formatDurationHMS(summary.totalTimeMs) || '00:00:00')

    pushField('Cenários', numberField(summary.scenariosCount))

    const executedMessage =
      asText(summary.executedScenariosMessage) ||
      (typeof summary.executedScenariosCount === 'number'
        ? `${summary.executedScenariosCount} ${
            summary.executedScenariosCount === 1 ? 'cenário executado' : 'cenários executados'
          }`
        : '')
    if (executedMessage) {
      pushField('Execução', executedMessage)
    }

    const fixTypeLabel = summary.fix?.type === 'storyfixes' ? 'Storyfixes' : 'Bugs'
    pushField(`${fixTypeLabel} registrados`, numberField(summary.fix?.value))

    pushField('Jira', summary.jira)

    const suiteName = withFallback(summary.suiteName)
    const suiteDetails = asText(summary.suiteDetails)
    pushField('Suíte', suiteDetails ? `${suiteName} — ${suiteDetails}` : suiteName)

    pushField('Participantes', numberField(summary.participantsCount))

    const urls = formatList(summary.monitoredUrls)
    if (urls && urls.length > 0) {
      lines.push('• *🌐 URLs monitoradas:*')
      urls.forEach((url) => lines.push(`  - ${url}`))
    } else {
      pushField('URLs monitoradas', 'Não informado')
    }

    const attendees = formatList(summary.attendees?.map((person) => formatAttendee(person)))

    lines.push('')
    lines.push('👥 *Quem está participando*')
    if (attendees && attendees.length > 0) {
      attendees.forEach((entry) => lines.push(`• ${entry}`))
    } else {
      lines.push('• Não informado')
    }

    return lines.join('\n')
  }
}
