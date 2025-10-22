export interface Event {
  id: string
  title: string
  description?: string
  date: string // ISO date string
  createdBy: "ilias" | "melissa"
  createdAt: string
}

const EVENTS_KEY = "couple-calendar-events"

export function getEvents(): Event[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(EVENTS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function addEvent(event: Omit<Event, "id" | "createdAt">): Event {
  const events = getEvents()
  const newEvent: Event = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  events.push(newEvent)
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  return newEvent
}

export function deleteEvent(id: string): void {
  const events = getEvents()
  const filtered = events.filter((e) => e.id !== id)
  localStorage.setItem(EVENTS_KEY, JSON.stringify(filtered))
}

export function getEventsByDate(date: string): Event[] {
  const events = getEvents()
  return events.filter((e) => e.date === date)
}
