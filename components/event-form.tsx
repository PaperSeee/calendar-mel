"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createEvent } from "@/app/actions/events"
import { Loader2 } from "lucide-react"

interface EventFormProps {
  selectedDate: string
  currentUser: string
  onCancel: () => void
}

export function EventForm({ selectedDate, currentUser, onCancel }: EventFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    startTransition(async () => {
      await createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        date: selectedDate,
        createdBy: currentUser,
      })
      setTitle("")
      setDescription("")
      onCancel()
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-muted">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-1">Nouvel événement</h3>
        <p className="text-sm text-muted-foreground capitalize">{formatDate(selectedDate)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold">
            Titre
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dîner romantique..."
            required
            className="rounded-2xl h-12 border-muted"
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
            placeholder="Détails de l'événement..."
            rows={3}
            className="rounded-2xl border-muted resize-none"
            disabled={isPending}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1 rounded-2xl h-12 font-semibold" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              "Créer l'événement"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-2xl h-12 px-6 bg-transparent"
            disabled={isPending}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}
