"use client"

import { useState } from "react"
import { Dashboard } from "@/components/dashboard"
import { AddPassword } from "@/components/add-password"
import { Settings } from "@/components/settings"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CustomConnectButton } from "@/components/custom-connect-button"
import { ModeToggle } from "@/components/mode-toggle"
import { useEnsName, useAccount } from "wagmi"
import { formatAddress } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

export function AppShell() {
  const [activeView, setActiveView] = useState<"dashboard" | "add" | "settings">("dashboard")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })

  const displayName = ensName || (address ? formatAddress(address) : "")

  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row min-h-screen w-full">
        {/* Mobile Sidebar (Slide-in) */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-background w-64 h-full shadow-md md:hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <AppSidebar
                activeView={activeView}
                setActiveView={(view) => {
                  setActiveView(view)
                  setMobileSidebarOpen(false)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:w-64">
          <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1 w-full">
          {/* Top navbar */}
          <header className="w-full sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-3 ">
              {/* Sidebar toggle for mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
                {/* <span className="text-sm  sm:text-base font-medium hidden sm:inline">
                {displayName}
              </span> */}
            </div>
            <div className="flex items-center gap-3">
              <CustomConnectButton />
              <ModeToggle />
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 w-full px-4 sm:px-6 py-6">
            {activeView === "dashboard" && <Dashboard />}
            {activeView === "add" && <AddPassword />}
            {activeView === "settings" && <Settings />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
