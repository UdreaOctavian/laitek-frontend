import React, { useContext, useState } from "react"

const UserContext = React.createContext()

export function useAuthUser() {
  return useContext(UserContext)
}

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()

  const value = {
    currentUser,
    setCurrentUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}