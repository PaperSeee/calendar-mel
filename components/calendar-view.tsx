"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
    return new Date(year, month, day).toISOString().split("T")[0]
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

  return (
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
  )
}
