"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, setCurrentUser, type User } from "@/lib/user-storage"

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getCurrentUser()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  const selectUser = (selectedUser: User) => {
    setCurrentUser(selectedUser)
    setUser(selectedUser)
  }

  return { user, selectUser, isLoading }
}
