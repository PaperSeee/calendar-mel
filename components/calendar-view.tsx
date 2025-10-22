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
  const startingDayOfWeek = firstDay.getDay()

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

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

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
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-muted">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="rounded-full h-10 w-10 bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-full h-10 w-10 bg-transparent">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 mb-3">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-3">{days}</div>
    </div>
  )
}
