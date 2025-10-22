"use client"

import { useMemo, useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Trash2, User, ChevronRight, Sparkles, CalendarDays, CalendarClock, CalendarCheck, Archive } from "lucide-react"
import type { Event } from "@/app/actions/events"
import { deleteEvent } from "@/app/actions/events"

interface MyEventsTabProps {
  events: Event[]
  currentUser: string
}

export function MyEventsTab({ events, currentUser }: MyEventsTabProps) {
  const [isPending, startTransition] = useTransition()
  const [expandedPeriod, setExpandedPeriod] = useState<string>("today")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteEvent(id)
    })
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setIsDialogOpen(true)
  }

  // Organiser les événements par période
  const organizedEvents = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const monthEnd = new Date(today)
    monthEnd.setMonth(monthEnd.getMonth() + 1)

    // Trier les événements par date (chaîne de caractères)
    const sortedEvents = [...events].sort((a, b) => {
      // S'assurer que date est une chaîne de caractères
      const dateA = typeof a.date === 'string' ? a.date : ''
      const dateB = typeof b.date === 'string' ? b.date : ''
      return dateA.localeCompare(dateB)
    })

    return {
      today: sortedEvents.filter(e => {
        const eventDate = new Date(e.date)
        return eventDate >= today && eventDate < tomorrow
      }),
      thisWeek: sortedEvents.filter(e => {
        const eventDate = new Date(e.date)
        return eventDate >= tomorrow && eventDate < weekEnd
      }),
      thisMonth: sortedEvents.filter(e => {
        const eventDate = new Date(e.date)
        return eventDate >= weekEnd && eventDate < monthEnd
      }),
      later: sortedEvents.filter(e => {
        const eventDate = new Date(e.date)
        return eventDate >= monthEnd
      }),
      past: sortedEvents.filter(e => {
        const eventDate = new Date(e.date)
        return eventDate < today
      })
    }
  }, [events])

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Demain"
    }

    const isThisYear = date.getFullYear() === now.getFullYear()
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      ...(isThisYear ? {} : { year: "numeric" })
    })
  }

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-foreground mb-1 truncate">
              {event.title}
            </h3>
            
            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {event.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatEventDate(event.date)}</span>
              </div>
              {event.time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{event.time}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="capitalize">{event.created_by}</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(event.id)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-9 w-9 flex-shrink-0 transition-all"
            disabled={isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const PeriodSection = ({ 
    title, 
    icon: Icon, 
    events: periodEvents, 
    periodKey,
    color = "primary"
  }: { 
    title: string
    icon: any
    events: Event[]
    periodKey: string
    color?: string
  }) => {
    const isExpanded = expandedPeriod === periodKey
    const colorClasses = {
      primary: "from-primary/10 to-primary/5 text-primary border-primary/20",
      accent: "from-accent/10 to-accent/5 text-accent border-accent/20",
      secondary: "from-secondary/10 to-secondary/5 text-secondary border-secondary/20",
      muted: "from-muted/10 to-muted/5 text-muted-foreground border-muted/20",
      archive: "from-muted/20 to-muted/10 text-muted-foreground border-muted/30"
    }

    if (periodEvents.length === 0) return null

    return (
      <div className="space-y-3">
        <button
          onClick={() => setExpandedPeriod(isExpanded ? "" : periodKey)}
          className={`w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r border transition-all hover:scale-[1.01] ${colorClasses[color as keyof typeof colorClasses]}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="font-bold text-lg">{title}</h2>
              <p className="text-xs opacity-70">
                {periodEvents.length} événement{periodEvents.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </button>

        {isExpanded && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
            {periodEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Résumé en haut
  const totalEvents = events.length
  const upcomingCount = organizedEvents.today.length + organizedEvents.thisWeek.length + organizedEvents.thisMonth.length

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-4 text-center">
            <CalendarCheck className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{totalEvents}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="p-4 text-center">
            <CalendarClock className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-accent">{upcomingCount}</p>
            <p className="text-xs text-muted-foreground">À venir</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-muted/10 to-muted/20">
          <CardContent className="p-4 text-center">
            <Archive className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold text-muted-foreground">{organizedEvents.past.length}</p>
            <p className="text-xs text-muted-foreground">Archivés</p>
          </CardContent>
        </Card>
      </div>

      {/* Affichage selon la vue */}
      <div className="space-y-4">
        {/* Sections temporelles */}
        <PeriodSection
          title="Aujourd'hui"
          icon={Clock}
          events={organizedEvents.today}
          periodKey="today"
          color="primary"
        />

        <PeriodSection
          title="Cette semaine"
          icon={CalendarDays}
          events={organizedEvents.thisWeek}
          periodKey="thisWeek"
          color="accent"
        />

        <PeriodSection
          title="Ce mois"
          icon={CalendarClock}
          events={organizedEvents.thisMonth}
          periodKey="thisMonth"
          color="secondary"
        />

        <PeriodSection
          title="Plus tard"
          icon={CalendarCheck}
          events={organizedEvents.later}
          periodKey="later"
          color="muted"
        />

        {/* Section Archives */}
        <PeriodSection
          title="Archives"
          icon={Archive}
          events={organizedEvents.past}
          periodKey="past"
          color="archive"
        />
      </div>

      {/* Message si aucun événement */}
      {totalEvents === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted/50 to-muted/20 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun événement
            </h3>
            <p className="text-sm text-muted-foreground">
              Créez votre premier événement depuis l'onglet Calendrier
            </p>
          </CardContent>
        </Card>
      )}

      {selectedDate && (
        <EventDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          selectedDate={selectedDate}
          currentUser={currentUser}
          events={events}
        />
      )}
    </div>
  )
}
