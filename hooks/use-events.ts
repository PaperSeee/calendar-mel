"use client"

import { useState, useEffect } from "react"
import { getEvents, addEvent, deleteEvent, type Event } from "@/lib/events-storage"

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    setEvents(getEvents())
  }, [])

  const createEvent = (event: Omit<Event, "id" | "createdAt">) => {
    const newEvent = addEvent(event)
    setEvents((prev) => [...prev, newEvent])
    return newEvent
  }

  const removeEvent = (id: string) => {
    deleteEvent(id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  return { events, createEvent, removeEvent }
}
