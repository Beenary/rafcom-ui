import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  IconCircleCheck,
  IconEdit,
  IconRestore,
  IconCirclePlus,
  IconX,
  IconBellX,
  IconCalculator,
  IconBellPlus,
  IconBellCheck,
  IconArrowsExchange,
} from "@tabler/icons-react"

// Default icon/color mapping keyed by event type string.
// Consumers can extend or override via the `iconMap` prop.
export interface EventIconConfig {
  icon: React.ElementType
  color: string
}

export type DefaultEventType =
  | "STOCK_CREATED"
  | "RECOUNT"
  | "QUANTITY_ADJUSTED"
  | "UPDATED_FIELDS"
  | "DELETED"
  | "MM_QUANTITY_ADJUSTED"
  | "MM_CREATED"
  | "FINDING_CREATED"
  | "FINDING_DELETED"
  | "RECOUNT_REQUESTED"
  | "RECOUNT_ASSIGNED"
  | "FINDING_RESOLVED"
  | "MM_BALANCE_ADJUSTED"

const DEFAULT_ICON_MAP: Record<string, EventIconConfig> = {
  STOCK_CREATED: {
    icon: IconCircleCheck,
    color: "text-green-500 dark:text-green-400",
  },
  RECOUNT: {
    icon: IconRestore,
    color: "text-yellow-500 dark:text-yellow-400",
  },
  QUANTITY_ADJUSTED: {
    icon: IconEdit,
    color: "text-blue-500 dark:text-blue-400",
  },
  DELETED: {
    icon: IconX,
    color: "text-red-500 dark:text-red-400",
  },
  MM_QUANTITY_ADJUSTED: {
    icon: IconEdit,
    color: "text-yellow-500 dark:text-yellow-400",
  },
  MM_CREATED: {
    icon: IconCirclePlus,
    color: "text-green-500 dark:text-green-400",
  },
  FINDING_DELETED: {
    icon: IconBellX,
    color: "text-red-500 dark:text-red-400",
  },
  RECOUNT_REQUESTED: {
    icon: IconCalculator,
    color: "text-blue-500 dark:text-blue-400",
  },
  RECOUNT_ASSIGNED: {
    icon: IconCalculator,
    color: "text-yellow-500 dark:text-yellow-400",
  },
  FINDING_CREATED: {
    icon: IconBellPlus,
    color: "text-green-500 dark:text-green-400",
  },
  FINDING_RESOLVED: {
    icon: IconBellCheck,
    color: "text-green-500 dark:text-green-400",
  },
  UPDATED_FIELDS: {
    icon: IconEdit,
    color: "text-blue-500 dark:text-blue-400",
  },
  MM_BALANCE_ADJUSTED: {
    icon: IconArrowsExchange,
    color: "text-yellow-500 dark:text-yellow-400",
  },
}

export interface BadgeLogEventsStatusProps {
  /** The event type string to render (e.g. "STOCK_CREATED"). */
  eventType: string
  /**
   * Human-readable labels keyed by event type.
   * If a label is not provided for a given event type, the raw eventType string is shown.
   */
  translations?: Record<string, string>
  /**
   * Override or extend the default icon/color map for specific event types.
   * Merged on top of the built-in defaults.
   */
  iconMap?: Record<string, EventIconConfig>
  className?: string
}

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ")
}

export function BadgeLogEventsStatus({
  eventType,
  translations,
  iconMap,
  className,
}: BadgeLogEventsStatusProps) {
  const resolvedIconMap = iconMap
    ? { ...DEFAULT_ICON_MAP, ...iconMap }
    : DEFAULT_ICON_MAP

  const config = resolvedIconMap[eventType]
  const Icon = config?.icon
  const label = translations?.[eventType] ?? eventType

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-muted-foreground px-1.5 flex gap-2 w-fit whitespace-nowrap shrink-0",
        className
      )}
    >
      {Icon && (
        <Icon
          className={cn(config.color)}
          size={12}
        />
      )}
      {label}
    </Badge>
  )
}
