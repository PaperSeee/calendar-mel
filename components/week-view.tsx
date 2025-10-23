"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Event } from "@/app/actions/events"

interface WeekViewProps {
  events: Event[]
  onDateSelect: (date: string) => void
  selectedDate: string | null
}

export function WeekView({ events, onDateSelect, selectedDate }: WeekViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Lundi comme premier jour
    return new Date(today.setDate(diff))
  })

  const getWeekDays = (startDate: Date) => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  const weekDays = getWeekDays(currentWeekStart)
  const weekEnd = new Date(currentWeekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const previousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const nextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeekStart(newDate)
  }

  const formatWeekRange = () => {
    const start = currentWeekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    const end = weekEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    return `${start} - ${end}`
  }

  const getDateString = (date: Date) => {
    // Utiliser la date locale sans conversion UTC (comme dans calendar-view.tsx)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const getEventsForDate = (date: Date) => {
    const dateString = getDateString(date)
    return events.filter((e) => e.date === dateString)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate === getDateString(date)
  }

  const weekEventsCount = weekDays.reduce((count, day) => {
    return count + getEventsForDate(day).length
  }, 0)

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-card via-card to-card/80 rounded-3xl p-5 shadow-lg border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground capitalize">{formatWeekRange()}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {weekEventsCount} événement{weekEventsCount !== 1 ? "s" : ""} cette semaine
            </p>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={previousWeek}
              className="rounded-full h-9 w-9 hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextWeek}
              className="rounded-full h-9 w-9 hover:bg-primary/10 hover:border-primary/30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDate(day)
            const today = isToday(day)
            const selected = isSelected(day)

            return (
              <Card
                key={index}
                className={`
                  border-0 shadow-sm transition-all duration-200 cursor-pointer
                  hover:shadow-md hover:scale-[1.01]
                  ${today ? "bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-l-primary" : ""}
                  ${selected ? "ring-2 ring-primary/50" : ""}
                `}
                onClick={() => onDateSelect(getDateString(day))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-12 h-12 rounded-xl flex flex-col items-center justify-center
                        ${today ? "bg-primary text-white" : "bg-muted/50"}
                      `}>
                        <span className={`text-xs ${today ? "text-white/70" : "text-muted-foreground"}`}>
                          {day.toLocaleDateString("fr-FR", { weekday: "short" })}
                        </span>
                        <span className={`text-lg font-bold ${today ? "text-white" : ""}`}>
                          {day.getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground capitalize">
                          {day.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dayEvents.length > 0 
                            ? `${dayEvents.length} événement${dayEvents.length > 1 ? "s" : ""}`
                            : "Aucun événement"
                          }
                        </p>
                      </div>
                    </div>
                    {dayEvents.length > 0 && (
                      <div className="flex items-center gap-1">
                        {dayEvents.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-accent" />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-xs text-muted-foreground ml-1">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {dayEvents.length > 0 && (
                    <div className="space-y-1.5 mt-3 pl-0">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div key={event.id} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                          <Calendar className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="text-sm text-foreground truncate font-medium">{event.title}</span>
                          {event.time && (
                            <span className="text-xs text-muted-foreground ml-auto">{event.time}</span>
                          )}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-xs text-muted-foreground pl-2">
                          +{dayEvents.length - 2} autre{dayEvents.length - 2 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
