"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export interface AppSwitcherItem {
  name: string
  logo: React.ElementType
  image?: string
  description?: string
  url: string
}

export interface AppSwitcherProps {
  apps: AppSwitcherItem[]
  /** Called when the user switches to a different app. If not provided, uses window.location.href. */
  onAppChange?: (app: AppSwitcherItem) => void
}

export function AppSwitcher({ apps, onAppChange }: AppSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeApp, setActiveApp] = React.useState<AppSwitcherItem>(apps[0])

  const handleAppSelect = (app: AppSwitcherItem) => {
    setActiveApp(app)
    if (onAppChange) {
      onAppChange(app)
    } else {
      window.location.href = app.url
    }
  }

  const Logo = activeApp.logo

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg border">
                {activeApp.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeApp.image}
                    width={20}
                    height={20}
                    alt={activeApp.name}
                    className="size-5 object-contain"
                  />
                ) : (
                  <Logo className="size-4 shrink-0" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeApp.name}</span>
                {activeApp.description && (
                  <span className="truncate text-xs">{activeApp.description}</span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Apps
            </DropdownMenuLabel>
            {apps
              .filter((app) => app.name !== activeApp.name)
              .map((app, index) => {
                const AppLogo = app.logo
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => handleAppSelect(app)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      {app.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={app.image}
                          width={16}
                          height={16}
                          alt={app.name}
                          className="size-4 object-contain"
                        />
                      ) : (
                        <AppLogo className="size-4 shrink-0" />
                      )}
                    </div>
                    {app.name}
                  </DropdownMenuItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
