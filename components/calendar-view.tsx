"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Event } from "@/app/actions/events"

interface CalendarViewProps {
  events: Event[]
  onDateSelect: (date: string) => void
  selectedDate: string | null
}

export function CalendarView({ events, onDateSelect, selectedDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  // Convertir pour que lundi = 0, dimanche = 6
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getDateString = (day: number) => {
    // Utiliser la date locale sans conversion UTC
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const date = new Date(year, month, day)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const hasEvents = (day: number) => {
    const dateString = getDateString(day)
    return events.some((e) => e.date === dateString)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const isSelected = (day: number) => {
    return selectedDate === getDateString(day)
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = getDateString(day)
    const hasEvent = hasEvents(day)
    const today = isToday(day)
    const selected = isSelected(day)

    days.push(
      <button
        key={day}
        onClick={() => onDateSelect(dateString)}
        className={`
          aspect-square p-2 rounded-2xl text-sm font-medium transition-all duration-200
          hover:bg-secondary/50 hover:scale-105 relative
          ${today ? "bg-primary/10 text-primary font-bold ring-2 ring-primary/20" : ""}
          ${selected ? "bg-primary text-white shadow-lg scale-105" : ""}
        `}
      >
        {day}
        {hasEvent && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent shadow-sm" />
        )}
      </button>,
    )
  }

  // Événements du mois actuel
  const monthEvents = events.filter((e) => {
    const eventDate = new Date(e.date)
    return eventDate.getMonth() === month && eventDate.getFullYear() === year
  }).sort((a, b) => {
    const dateA = typeof a.date === 'string' ? a.date : ''
    const dateB = typeof b.date === 'string' ? b.date : ''
    return dateA.localeCompare(dateB)
  })

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-card via-card to-card/80 rounded-3xl p-5 shadow-lg border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {events.filter((e) => {
                const eventDate = new Date(e.date)
                return eventDate.getMonth() === month && eventDate.getFullYear() === year
              }).length} événement{events.filter((e) => {
                const eventDate = new Date(e.date)
                return eventDate.getMonth() === month && eventDate.getFullYear() === year
              }).length !== 1 ? "s" : ""} ce mois
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={previousMonth}
              className="rounded-full h-9 w-9 hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="rounded-full h-9 w-9 hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {dayNames.map((name) => (
            <div
              key={name}
              className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wide py-1.5"
            >
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">{days}</div>
      </div>

      {/* Liste des événements du mois */}
      {monthEvents.length > 0 && (
        <div className="bg-gradient-to-br from-card via-card to-card/80 rounded-3xl p-5 shadow-lg border border-border/50">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Événements de {monthNames[month]} ({monthEvents.length})
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {monthEvents.map((event) => {
              const eventDate = new Date(event.date)
              const isToday = eventDate.toDateString() === new Date().toDateString()
              const isPast = eventDate < new Date()
              
              return (
                <button
                  key={event.id}
                  onClick={() => onDateSelect(event.date)}
                  className={`
                    w-full text-left p-3 rounded-xl transition-all hover:scale-[1.01]
                    ${isToday ? "bg-primary/10 border-2 border-primary/30" : "bg-muted/30 hover:bg-muted/50"}
                    ${isPast && !isToday ? "opacity-60" : ""}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0
                      ${isToday ? "bg-primary text-white" : "bg-primary/10"}
                    `}>
                      <span className={`text-xs font-medium ${isToday ? "text-white/70" : "text-muted-foreground"}`}>
                        {eventDate.toLocaleDateString("fr-FR", { weekday: "short" })}
                      </span>
                      <span className={`text-sm font-bold ${isToday ? "text-white" : "text-primary"}`}>
                        {eventDate.getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {event.time && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground capitalize">
                          • {event.created_by}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
