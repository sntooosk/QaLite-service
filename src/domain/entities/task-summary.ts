export interface EnvironmentSummaryAttendee {
  name?: string
  email?: string
}

export interface EnvironmentSummaryPayload {
  identifier?: string
  totalTime?: string
  totalTimeMs?: number
  scenariosCount?: number
  executedScenariosCount?: number
  executedScenariosMessage?: string
  fix?: {
    type?: 'bug' | 'storyfixes'
    value?: number
  }
  jira?: string
  suiteName?: string
  suiteDetails?: string
  participantsCount?: number
  monitoredUrls?: string[]
  attendees?: Array<EnvironmentSummaryAttendee | string>
}

export interface TaskSummaryPayload {
  message?: string
  environmentSummary?: EnvironmentSummaryPayload
}
