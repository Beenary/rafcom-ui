"use client"

import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface NavSubItem {
  title: string
  url: string
  permission?: boolean
}

export interface NavMainItem {
  title: string
  url: string
  icon?: React.ElementType
  isActive?: boolean
  permission?: boolean
  items?: NavSubItem[]
}

export interface NavMainProps {
  sectionName: string
  items: NavMainItem[]
}

export function NavMain({ items, sectionName }: NavMainProps) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="px-5 group-data-[collapsible=icon]:px-2">
      <SidebarGroupLabel>{sectionName}</SidebarGroupLabel>
      <SidebarMenu className="gap-2">
        {items.map((item) => {
          const isItemActive = pathname.includes(item.url)
          const activeVariant = isItemActive
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground active:bg-primary active:text-primary-foreground"
            : "default"

          // Direct link — no sub-items
          if ((!item.items || item.items.length === 0) && item.permission !== false) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  variant="ghost"
                  className={activeVariant + " h-9"}
                >
                  <Link href={item.url} scroll={true}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Collapsible with sub-items
          if (item.items && item.permission !== false) {
            const isSubActive = item.items.some((subItem) =>
              pathname.includes(subItem.url)
            )
            const collapsibleVariant = isSubActive
              ? "bg-primary text-primary-foreground hover:!bg-primary hover:!text-primary-foreground active:!bg-primary active:!text-primary-foreground"
              : "default"

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`${collapsibleVariant} h-9`}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="mr-0 pr-0">
                      {item.items?.map((subItem) => {
                        if (subItem.permission === false) return null
                        const isSubItemActive = pathname.includes(subItem.url)
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={(isSubItemActive ? "font-bold" : "default") + " h-9"}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return null
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
