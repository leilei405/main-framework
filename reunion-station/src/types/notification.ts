export interface Notification {
  id: string
  userId: string
  type: "match" | "message" | "system" | "audit" | "reminder"
  title: string
  content: string
  data?: any
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationSettings {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  matchNotifications: boolean
  messageNotifications: boolean
  systemNotifications: boolean
  auditNotifications: boolean
  reminderNotifications: boolean
}

export interface CreateNotificationRequest {
  userId: string
  type: Notification["type"]
  title: string
  content: string
  data?: any
}

export interface NotificationFilter {
  type?: Notification["type"]
  isRead?: boolean
  startDate?: string
  endDate?: string
}
