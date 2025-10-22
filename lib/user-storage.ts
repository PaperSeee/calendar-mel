export type User = "ilias" | "melissa"

const USER_KEY = "couple-calendar-user"

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(USER_KEY)
  return stored as User | null
}

export function setCurrentUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, user)
}

export function clearCurrentUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
}
