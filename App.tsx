"use client"

import type React from "react"
import { useState } from "react"
import ChatWindow from "./components/ChatWindow"
import Sidebar from "./components/Sidebar"

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-sans overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <ChatWindow toggleSidebar={toggleSidebar} />
      </main>
    </div>
  )
}

export default App
