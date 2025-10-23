"use client"

import type { ReactNode } from "react"
import { Calendar, Heart, MessageCircle, Sparkles } from "lucide-react"
import type { User } from "@/lib/user-storage"

interface MainLayoutProps {
  children: ReactNode
  currentUser: User
  activeTab: "calendar" | "timer" | "messages" | "events"
  onTabChange: (tab: "calendar" | "timer" | "messages" | "events") => void
}

export function MainLayout({ children, currentUser, activeTab, onTabChange }: MainLayoutProps) {
  const tabs = [
    { id: "calendar" as const, label: "Calendrier", icon: Calendar },
    { id: "events" as const, label: "Événements", icon: Sparkles },
    { id: "timer" as const, label: "Histoire", icon: Heart },
    { id: "messages" as const, label: "Messages", icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header moderne */}
      <header className="bg-card/95 backdrop-blur-xl border-b border-border/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Calendar MI</h1>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Notre histoire</p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-muted to-muted/50 text-sm font-semibold text-foreground capitalize shadow-sm border border-border/50">
              {currentUser}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      {/* Navigation moderne */}
      <nav className="bg-card/98 backdrop-blur-xl border-t border-border/60 sticky bottom-0 safe-area-inset-bottom shadow-lg">
        <div className="container mx-auto px-3 py-2">
          <div className="flex justify-around items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex-1 flex flex-col items-center gap-1 py-2.5 px-3 rounded-2xl transition-all duration-300
                    ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }
                  `}
                >
                  <div className={`relative transition-all duration-300 ${isActive ? "scale-110" : "scale-100"}`}>
                    <Icon className={`w-5 h-5 ${isActive ? "fill-primary/20" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[11px] font-semibold tracking-tight ${isActive ? "" : "font-medium"}`}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
