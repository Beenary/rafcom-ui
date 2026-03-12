import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { AppSwitcher } from "./app-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export interface AppItem {
  name: string
  logo: React.ElementType
  image?: string
  description?: string
  url: string
}

export interface NavItem {
  title: string
  url: string
  icon?: React.ElementType
  isActive?: boolean
  permission?: boolean
  items?: {
    title: string
    url: string
    permission?: boolean
  }[]
}

export interface NavSection {
  sectionName: string
  items: NavItem[]
}

export interface SidebarUser {
  name: string
  email: string
  avatar?: string
}

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  apps: AppItem[]
  navSections: NavSection[]
  user: SidebarUser
  onLogout?: () => void
  onSettingsClick?: () => void
}

export function AppSidebar({
  apps,
  navSections,
  user,
  onLogout,
  onSettingsClick,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <AppSwitcher apps={apps} />
      </SidebarHeader>
      <SidebarContent>
        {navSections.map((section) => (
          <NavMain
            key={section.sectionName}
            items={section.items}
            sectionName={section.sectionName}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser
          user={user}
          onLogout={onLogout}
          onSettingsClick={onSettingsClick}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
