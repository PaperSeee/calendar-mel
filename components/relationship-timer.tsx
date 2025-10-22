"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Calendar, Clock, Sparkles } from "lucide-react"

const RELATIONSHIP_START_DATE = new Date("2025-09-19T00:00:00")

interface TimeElapsed {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
}

function calculateTimeElapsed(): TimeElapsed {
  const now = new Date()
  const diff = now.getTime() - RELATIONSHIP_START_DATE.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const totalDays = Math.floor(hours / 24)

  let years = now.getFullYear() - RELATIONSHIP_START_DATE.getFullYear()
  let months = now.getMonth() - RELATIONSHIP_START_DATE.getMonth()
  let days = now.getDate() - RELATIONSHIP_START_DATE.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  return {
    years,
    months,
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    totalDays,
  }
}

export function RelationshipTimer() {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>(calculateTimeElapsed())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const timeUnits = [
    { value: timeElapsed.years, label: timeElapsed.years > 1 ? "Années" : "Année", show: timeElapsed.years > 0 },
    { value: timeElapsed.months, label: "Mois", show: true },
    { value: timeElapsed.days, label: "Jours", show: true },
    { value: timeElapsed.hours, label: "Heures", show: true },
    { value: timeElapsed.minutes, label: "Minutes", show: true },
    { value: timeElapsed.seconds, label: "Secondes", show: true },
  ]

  return (
    <div className="space-y-4 pb-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 overflow-hidden">
        <CardContent className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
              <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Notre Histoire</h2>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <p className="text-sm">Depuis le 19 septembre 2025</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {timeUnits
              .filter((unit) => unit.show)
              .map((unit, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-4 text-center space-y-2 shadow-sm border border-border/50"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary tabular-nums">{unit.value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{unit.label}</div>
                </div>
              ))}
          </div>

          <div className="text-center pt-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-primary tabular-nums">
                {timeElapsed.totalDays.toLocaleString("fr-FR")}
              </span>
              <span className="text-sm font-medium text-muted-foreground">jours</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">Premier jour ensemble</p>
                <p className="text-sm text-muted-foreground">19 septembre 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-accent fill-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">Jours de bonheur</p>
                <p className="text-sm text-muted-foreground">{timeElapsed.totalDays} jours ensemble</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-secondary fill-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">Notre amour grandit</p>
                <p className="text-sm text-muted-foreground">Chaque seconde compte</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
