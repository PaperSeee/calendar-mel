"use client"

import type { ReactNode } from "react"
import { Calendar, Heart, MessageCircle } from "lucide-react"
import type { User } from "@/lib/user-storage"

interface MainLayoutProps {
  children: ReactNode
  currentUser: User
  activeTab: "calendar" | "timer" | "messages"
  onTabChange: (tab: "calendar" | "timer" | "messages") => void
}

export function MainLayout({ children, currentUser, activeTab, onTabChange }: MainLayoutProps) {
  const tabs = [
    { id: "calendar" as const, label: "Calendrier", icon: Calendar },
    { id: "timer" as const, label: "Histoire", icon: Heart },
    { id: "messages" as const, label: "Messages", icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary fill-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Notre Calendrier</h1>
            </div>
            <div className="px-4 py-2 rounded-full bg-muted/50 text-sm font-medium text-foreground capitalize">
              {currentUser}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-6">{children}</main>

      <nav className="bg-card/95 backdrop-blur-sm border-t border-border/50 sticky bottom-0 safe-area-inset-bottom">
        <div className="container mx-auto px-2">
          <div className="flex justify-around items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 transition-all duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={`relative ${isActive ? "scale-110" : ""} transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${isActive ? "fill-primary" : ""}`} />
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
