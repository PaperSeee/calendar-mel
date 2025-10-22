"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Clock, Sparkles } from "lucide-react"
import type { Event } from "@/app/actions/events"

interface EventsWeekViewProps {
  events: Event[]
}

export function EventsWeekView({ events }: EventsWeekViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(today.setDate(diff))
  })

  const getWeekDays = (startDate: Date) => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day)
    }
    return days
  }

  const weekDays = getWeekDays(currentWeekStart)

  const previousWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() - 7)
    setCurrentWeekStart(newStart)
  }

  const nextWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() + 7)
    setCurrentWeekStart(newStart)
  }

  const getDateString = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getEventsForDate = (date: Date) => {
    const dateString = getDateString(date)
    return events.filter((e) => e.date === dateString)
  }

  const formatWeekRange = () => {
    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    
    return `${currentWeekStart.toLocaleDateString("fr-FR", { 
      day: "numeric", 
      month: "long" 
    })} - ${weekEnd.toLocaleDateString("fr-FR", { 
      day: "numeric", 
      month: "long",
      year: "numeric"
    })}`
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec navigation */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {formatWeekRange()}
              </h2>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={previousWeek}
                className="rounded-full h-9 w-9"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextWeek}
                className="rounded-full h-9 w-9"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jours de la semaine */}
      <div className="space-y-3">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDate(day)
          const today = isToday(day)

          return (
            <Card
              key={day.toISOString()}
              className={`border-0 shadow-sm transition-all ${
                today ? "bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-l-primary" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Date */}
                  <div
                    className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                      today ? "bg-primary text-white" : "bg-muted/50"
                    }`}
                  >
                    <span className={`text-xs font-medium ${today ? "text-white/70" : "text-muted-foreground"}`}>
                      {day.toLocaleDateString("fr-FR", { weekday: "short" })}
                    </span>
                    <span className={`text-2xl font-bold ${today ? "text-white" : "text-foreground"}`}>
                      {day.getDate()}
                    </span>
                  </div>

                  {/* Événements */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2 capitalize">
                      {day.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h3>

                    {dayEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun événement</p>
                    ) : (
                      <div className="space-y-2">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-foreground truncate">
                                {event.title}
                              </p>
                              {event.time && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{event.time}</span>
                                </div>
                              )}
                              {event.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
