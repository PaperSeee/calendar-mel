"use client"

import { useState } from "react"
import { CalendarView } from "@/components/calendar-view"
import { EventForm } from "@/components/event-form"
import { EventList } from "@/components/event-list"
import type { Event } from "@/app/actions/events"

interface CalendarTabProps {
  currentUser: string
  events: Event[]
}

export function CalendarTab({ currentUser, events }: CalendarTabProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setShowEventForm(false)
  }

  return (
    <div className="space-y-6">
      <CalendarView events={events} onDateSelect={handleDateSelect} selectedDate={selectedDate} />

      {selectedDate && (
        <>
          {showEventForm ? (
            <EventForm selectedDate={selectedDate} currentUser={currentUser} onCancel={() => setShowEventForm(false)} />
          ) : (
            <EventList events={events} selectedDate={selectedDate} onAddEvent={() => setShowEventForm(true)} />
          )}
        </>
      )}
    </div>
  )
}
