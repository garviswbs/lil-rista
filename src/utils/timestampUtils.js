// Utility functions for timestamp formatting

/**
 * Get the most relevant timestamp for an attendee
 * Priority: checkedInAt > badgeReceivedAt > drinkReceivedAt > createdAt
 */
export function getMostRelevantTimestamp(attendee) {
  if (attendee.checkedInAt) {
    return {
      timestamp: attendee.checkedInAt,
      label: 'Checked in',
    }
  }
  if (attendee.badgeReceivedAt) {
    return {
      timestamp: attendee.badgeReceivedAt,
      label: 'Badge received',
    }
  }
  if (attendee.drinkReceivedAt) {
    return {
      timestamp: attendee.drinkReceivedAt,
      label: 'Drink received',
    }
  }
  return {
    timestamp: attendee.createdAt,
    label: 'Created',
  }
}

/**
 * Format timestamp as relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
}

/**
 * Get formatted relative timestamp for display
 */
export function getFormattedTimestamp(attendee) {
  const { timestamp, label } = getMostRelevantTimestamp(attendee)
  const relativeTime = formatRelativeTime(timestamp)
  return `${label} ${relativeTime}`
}

