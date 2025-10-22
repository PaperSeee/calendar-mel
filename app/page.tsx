import { getEvents } from "@/app/actions/events"
import { getMessages } from "@/app/actions/messages"
import { HomeClient } from "@/components/home-client"

export default async function Home() {
  const [events, messages] = await Promise.all([getEvents(), getMessages()])

  return <HomeClient events={events} messages={messages} />
}

// function HomeClient({ events, messages }: { events: any[]; messages: any[] }) {
//   "use client"
//
//   const { user, selectUser, isLoading } = useCurrentUser()
//   const [activeTab, setActiveTab] = useState<"calendar" | "timer" | "messages">("calendar")
//
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
//           <p className="text-muted-foreground font-medium">Chargement...</p>
//         </div>
//       </div>
//     )
//   }
//
//   if (!user) {
//     return <UserSelection onSelectUser={selectUser} />
//   }
//
//   return (
//     <MainLayout currentUser={user} activeTab={activeTab} onTabChange={setActiveTab}>
//       <div className="max-w-4xl mx-auto">
//         {activeTab === "calendar" && <CalendarTab currentUser={user} events={events} />}
//         {activeTab === "timer" && <RelationshipTimer />}
//         {activeTab === "messages" && <MessagingTab currentUser={user} messages={messages} />}
//       </div>
//     </MainLayout>
//   )
// }
