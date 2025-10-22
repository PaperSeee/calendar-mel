"use client"

import { useState } from "react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { UserSelection } from "@/components/user-selection"
import { MainLayout } from "@/components/main-layout"
import { CalendarTab } from "@/components/calendar-tab"
import { RelationshipTimer } from "@/components/relationship-timer"
import { MessagingTab } from "@/components/messaging-tab"
import { MyEventsTab } from "@/components/my-events-tab"
import type { Event } from "@/app/actions/events"
import type { Message } from "@/app/actions/messages"

interface HomeClientProps {
  events: Event[]
  messages: Message[]
}

export function HomeClient({ events, messages }: HomeClientProps) {
  const { user, selectUser, isLoading } = useCurrentUser()
  const [activeTab, setActiveTab] = useState<"calendar" | "timer" | "messages" | "events">("calendar")

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <UserSelection onSelectUser={selectUser} />
  }

  return (
    <MainLayout currentUser={user} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-4xl mx-auto">
        {activeTab === "calendar" && <CalendarTab currentUser={user} events={events} />}
        {activeTab === "events" && <MyEventsTab currentUser={user} events={events} />}
        {activeTab === "timer" && <RelationshipTimer />}
        {activeTab === "messages" && <MessagingTab currentUser={user} messages={messages} />}
      </div>
    </MainLayout>
  )
}
