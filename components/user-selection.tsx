"use client"

import type { User } from "@/lib/user-storage"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface UserSelectionProps {
  onSelectUser: (user: User) => void
}

export function UserSelection({ onSelectUser }: UserSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-2">
            <Heart className="w-10 h-10 text-primary fill-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Calendar MI</h1>
            <p className="text-lg text-muted-foreground">Bienvenue ! Qui êtes-vous ?</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => onSelectUser("ilias")}
            className="w-full h-16 text-lg font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
            size="lg"
          >
            Ilias
          </Button>
          <Button
            onClick={() => onSelectUser("melissa")}
            className="w-full h-16 text-lg font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
            size="lg"
            variant="secondary"
          >
            Melissa
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Votre choix sera sauvegardé pour les prochaines visites
        </p>
      </div>
    </div>
  )
}
