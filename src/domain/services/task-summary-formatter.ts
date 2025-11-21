import {
  EnvironmentSummaryPayload,
  TaskSummaryPayload,
} from '../entities/task-summary.js'

type Primitive = string | number | boolean | undefined | null

const asText = (value: Primitive): string => {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

const formatDurationHMS = (milliseconds?: number): string => {
  if (
    typeof milliseconds !== 'number' ||
    Number.isNaN(milliseconds) ||
    milliseconds < 0
  ) {
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

const numberField = (value?: number): string =>
  typeof value === 'number' && value >= 0 ? String(value) : ''

const formatList = (entries?: (string | undefined | null)[]): string[] =>
  entries
    ?.map((value) => value?.trim())
    .filter((value): value is string => Boolean(value)) ?? []

export class TaskSummaryFormatter {
  buildMessage({ environmentSummary }: TaskSummaryPayload): string {
    const summary = environmentSummary ?? {}
    const lines: string[] = ['✨ *Resumo de QA*', '']

    const addLine = (label: string, value?: Primitive): void => {
      const content = asText(value)
      if (content) {
        lines.push(`• *${label}:* ${content}`)
      }
    }

    addLine('Ambiente', summary.identifier)

    const totalTime = summary.totalTime || formatDurationHMS(summary.totalTimeMs)
    if (totalTime) {
      addLine('Tempo total', totalTime)
    }

    const totalScenarios = numberField(summary.scenariosCount)
    addLine('Cenários', totalScenarios)

    const executedMessage =
      asText(summary.executedScenariosMessage) ||
      (typeof summary.executedScenariosCount === 'number'
        ? `${summary.executedScenariosCount} ${
            summary.executedScenariosCount === 1
              ? 'cenário executado'
              : 'cenários executados'
          }`
        : '')

    addLine('Execução', executedMessage)

    const fixTypeLabel = summary.fix?.type === 'storyfixes' ? 'Storyfixes' : 'Bugs'
    const fixesRegistered = numberField(summary.fix?.value)
    if (fixesRegistered) {
      addLine(`${fixTypeLabel} registrados`, fixesRegistered)
    }

    addLine('Jira', summary.jira)

    const suiteName = asText(summary.suiteName)
    const suiteDetails = asText(summary.suiteDetails)
    if (suiteName || suiteDetails) {
      addLine('Suíte', suiteDetails ? `${suiteName} — ${suiteDetails}` : suiteName)
    }

    addLine('Participantes', numberField(summary.participantsCount))

    const urls = formatList(summary.monitoredUrls)
    if (urls.length > 0) {
      lines.push('• *🌐 URLs monitoradas:*')
      urls.forEach((url) => lines.push(`  - ${url}`))
    }

    const attendees = formatList(
      summary.attendees?.map((person) => formatAttendee(person)),
    )

    if (attendees.length > 0) {
      lines.push('')
      lines.push('👥 *Quem está participando*')
      attendees.forEach((entry) => lines.push(`• ${entry}`))
    }

    return lines.join('\n')
  }
}
