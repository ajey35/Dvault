"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Shield, Home, Plus, Settings, LogOut } from "lucide-react"
import { useDisconnect } from "wagmi"
import { useToast } from "@/components/ui/use-toast"
import {useRouter} from "next/navigation"
import clsx from "clsx"

interface AppSidebarProps {
  activeView: "dashboard" | "add" | "settings"
  setActiveView: (view: "dashboard" | "add" | "settings") => void
}

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  const { disconnect } = useDisconnect()
  const { toast } = useToast()
  const router  = useRouter()

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  const navItems = [
    { key: "dashboard", icon: Home, label: "Dashboard" },
    { key: "add", icon: Plus, label: "Add Password" },
    { key: "settings", icon: Settings, label: "Settings" },
  ] as const

  return (
    <Sidebar className="bg-white dark:bg-zinc-900 border-r shadow-md h-screen md:w-60 w-full z-50">
      <SidebarHeader className="flex h-16 items-center border-b px-6 justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-primary justify-center">
          <Shield className="h-6 w-6 mt-3" />
          <button className="font-bold text-2xl  mt-3" onClick={() => router.push("/")}><span>D Vault</span></button>
        </div>
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between flex-1">
        <SidebarMenu className="py-4">
          {navItems.map(({ key, icon: Icon, label }) => (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                tooltip={label}
                isActive={activeView === key}
                onClick={() => setActiveView(key)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-6 rounded-lg transition-all text-sm font-medium",
                  activeView === key
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarFooter className="p-4 border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleDisconnect}
                  tooltip="Disconnect"
                  className="flex items-center gap-3 px-6 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <LogOut className="h-5 w-5 text-red-600 group-hover:text-red-700 transition-colors duration-200" />
                  <span className="font-medium text-sm">Disconnect</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
