"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, X, Sparkles, User, Calendar as CalendarIcon, Clock, Check } from "lucide-react"
import { createEvent, deleteEvent, type Event } from "@/app/actions/events"
import { toast } from "sonner"

interface EventDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string
  currentUser: string
  events: Event[]
}

export function EventDialog({ isOpen, onClose, selectedDate, currentUser, events }: EventDialogProps) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("")
  const [isPending, startTransition] = useTransition()

  const dayEvents = events.filter((e) => e.date === selectedDate)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Demain"
    }

    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const eventTitle = title.trim()

    startTransition(async () => {
      try {
        await createEvent({
          title: eventTitle,
          description: description.trim() || undefined,
          date: selectedDate,
          time: time || undefined,
          createdBy: currentUser,
        })
        
        // Afficher un toast de succès
        toast.success("Événement créé !", {
          description: `"${eventTitle}" a été ajouté avec succès.`,
          icon: <Check className="w-4 h-4" />,
          duration: 3000,
        })
        
        // Réinitialiser le formulaire mais le garder ouvert
        setTitle("")
        setDescription("")
        setTime("")
      } catch (error) {
        toast.error("Erreur", {
          description: "Impossible de créer l'événement.",
          duration: 3000,
        })
      }
    })
  }

  const handleDelete = (id: number, eventTitle: string) => {
    startTransition(async () => {
      try {
        await deleteEvent(id)
        toast.success("Événement supprimé", {
          description: `"${eventTitle}" a été supprimé.`,
          duration: 3000,
        })
      } catch (error) {
        toast.error("Erreur", {
          description: "Impossible de supprimer l'événement.",
          duration: 3000,
        })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background p-5 border-b">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold capitalize">{formatDate(selectedDate)}</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {dayEvents.length} événement{dayEvents.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button
                onClick={() => setShowForm(!showForm)}
                size="sm"
                className="rounded-full h-9 px-4 font-semibold shadow-sm text-sm"
              >
                {showForm ? (
                  <>
                    <X className="w-3.5 h-3.5 mr-1.5" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Ajouter
                  </>
                )}
              </Button>
            </div>
          </DialogHeader>
        </div>

        {/* Content scrollable */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Formulaire */}
          {showForm && (
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Titre de l'événement
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Dîner romantique, anniversaire..."
                    required
                    className="rounded-xl h-11 border-primary/20 focus:border-primary"
                    disabled={isPending}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Horaire (optionnel)
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="rounded-xl h-11 border-primary/20 focus:border-primary"
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Description (optionnel)
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ajouter des détails..."
                    rows={3}
                    className="rounded-xl border-primary/20 focus:border-primary resize-none"
                    disabled={isPending}
                  />
                </div>

                <Button type="submit" className="w-full rounded-xl h-11 font-semibold" disabled={isPending}>
                  {isPending ? "Création..." : "Créer l'événement"}
                </Button>
              </form>
            </div>
          )}

          {/* Liste des événements */}
          {dayEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted/50 to-muted/20 mx-auto mb-4 flex items-center justify-center">
                <CalendarIcon className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Aucun événement</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Cliquez sur "Ajouter" pour créer votre premier événement ce jour-là
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="group relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-4 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: "fadeInUp 0.4s ease-out forwards",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base text-foreground mb-1 truncate">{event.title}</h4>
                      
                      {event.time && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground font-medium">{event.time}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        <span className="capitalize font-medium">{event.created_by}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(event.id, event.title)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-9 w-9 flex-shrink-0 transition-all duration-200"
                      disabled={isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
