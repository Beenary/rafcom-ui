"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react"
import { useSortFields, type SortProperty } from "./use-sort-fields"

export interface SortDropdownTranslations {
  /** Button label when no sort is active. Defaults to "Add sort". */
  addSort?: string
  /** Separator label between direction arrows and field name. Defaults to "|". */
  /** Label prefix for direction selector. Defaults to "Sort". */
  sortDirection?: string
  /** Label for the add field button. Defaults to "Add field". */
  addField?: string
  /** Label for the clear all button. Defaults to "Clear sort". */
  clearSort?: string
  /** Placeholder for the field search input. Defaults to "Search field...". */
  searchPlaceholder?: string
  /** Message when no fields match the search. Defaults to "No results found." */
  notFound?: string
  /** Suffix shown when multiple fields are selected, e.g. "2 fields". Defaults to "fields". */
  fieldsSuffix?: string
}

export interface SortDropdownProps {
  /**
   * Available properties the user can sort by.
   */
  sortProperties: SortProperty[]
  /**
   * Called whenever the active sort configuration changes.
   * `sortBy` is null when no fields are selected.
   * `sortOrder` is null when no fields are selected.
   */
  onSortChange: (params: {
    sortBy: string | null
    sortOrder: "asc" | "desc" | null
  }) => void
  /**
   * Initial sort state, useful when reading from URL params on mount.
   */
  initialSortBy?: string
  initialSortOrder?: "asc" | "desc"
  /** i18n strings. All keys are optional — sensible English defaults are used. */
  translations?: SortDropdownTranslations
}

export function SortDropdown({
  sortProperties,
  onSortChange,
  initialSortBy,
  initialSortOrder,
  translations = {},
}: SortDropdownProps) {
  const t: Required<SortDropdownTranslations> = {
    addSort: translations.addSort ?? "Add sort",
    sortDirection: translations.sortDirection ?? "Sort",
    addField: translations.addField ?? "Add field",
    clearSort: translations.clearSort ?? "Clear sort",
    searchPlaceholder: translations.searchPlaceholder ?? "Search field...",
    notFound: translations.notFound ?? "No results found.",
    fieldsSuffix: translations.fieldsSuffix ?? "fields",
  }

  // Build initial fields from prop
  const initialFields = React.useMemo(() => {
    if (!initialSortBy) return []
    return initialSortBy
      .split(",")
      .map((id) => sortProperties.find((p) => p.id === id))
      .filter((p): p is SortProperty => Boolean(p))
  }, []) // intentionally run only on mount

  const {
    sortDirection,
    setSortDirection,
    sortFields,
    addSortField,
    removeSortField,
    removeAllSortFields,
  } = useSortFields(initialFields)

  // Initialise direction from prop
  React.useEffect(() => {
    if (initialSortOrder) {
      setSortDirection(initialSortOrder)
    }
  }, []) // intentionally run only on mount

  const [propertySearchValue, setPropertySearchValue] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const [isNestedOpen, setIsNestedOpen] = React.useState(false)

  // Notify parent whenever sort state changes
  const isFirstRender = React.useRef(true)
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (sortFields.length === 0) {
      onSortChange({ sortBy: null, sortOrder: null })
    } else {
      onSortChange({
        sortBy: sortFields.map((f) => f.id).join(","),
        sortOrder: sortDirection,
      })
    }
  }, [sortDirection, sortFields]) // onSortChange intentionally omitted to avoid stale-closure churn

  const availableProperties = sortProperties.filter(
    (property) => !sortFields.some((field) => field.id === property.id)
  )

  const clearSortAndClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      removeAllSortFields()
    }, 0)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {sortFields.length === 0 ? (
          <Button variant="ghost" className="gap-1 p-2 h-8 text-muted-foreground">
            <Plus className="ml-1 h-3.5 w-3.5" />
            {t.addSort}
          </Button>
        ) : (
          <Button variant="outline" className="gap-1 p-2 h-8">
            {sortDirection === "asc" ? (
              <IconArrowUp className="w-4 h-4" />
            ) : (
              <IconArrowDown className="w-4 h-4" />
            )}
            <span className="mx-2">|</span>
            {sortFields.length === 1
              ? sortFields[0].name
              : `${sortFields.length} ${t.fieldsSuffix}`}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        {sortFields.length === 0 ? (
          <Command>
            <CommandInput
              placeholder={t.searchPlaceholder}
              value={propertySearchValue}
              onValueChange={setPropertySearchValue}
            />
            <CommandList>
              <CommandEmpty>{t.notFound}</CommandEmpty>
              <CommandGroup>
                {availableProperties.map((property) => (
                  <CommandItem
                    key={property.id}
                    onSelect={() => {
                      addSortField(property)
                      setPropertySearchValue("")
                    }}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-1">{property.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <>
            {/* Direction selector */}
            <div className="flex items-center gap-2 px-2 py-1">
              <span className="text-sm">{t.sortDirection}:</span>
              <Button
                variant={sortDirection === "asc" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSortDirection("asc")}
              >
                <IconArrowUp className="w-4 h-4" />
              </Button>
              <Button
                variant={sortDirection === "desc" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSortDirection("desc")}
              >
                <IconArrowDown className="w-4 h-4" />
              </Button>
            </div>
            <div className="border-t my-2" />
            {/* Selected fields list */}
            {sortFields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-2 px-2 py-1">
                <span className="flex-1">{field.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (sortFields.length === 1) {
                      setIsOpen(false)
                      setTimeout(() => removeSortField(idx), 150)
                    } else {
                      removeSortField(idx)
                    }
                  }}
                  className="gap-1 p-2 h-6 w-6 text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {/* Add more fields */}
            {availableProperties.length > 0 && (
              <DropdownMenu open={isNestedOpen} onOpenChange={setIsNestedOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start border border-transparent text-muted-foreground"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    {t.addField}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[240px]">
                  <Command>
                    <CommandInput
                      placeholder={t.searchPlaceholder}
                      value={propertySearchValue}
                      onValueChange={setPropertySearchValue}
                    />
                    <CommandList>
                      <CommandEmpty>{t.notFound}</CommandEmpty>
                      <CommandGroup>
                        {availableProperties.map((property) => (
                          <CommandItem
                            key={property.id}
                            onSelect={() => {
                              addSortField(property)
                              setPropertySearchValue("")
                              setIsNestedOpen(false)
                            }}
                            className="flex items-center gap-2"
                          >
                            <span className="flex-1">{property.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {/* Clear all */}
            <Button
              variant="ghost"
              className="w-full justify-start border border-transparent text-muted-foreground mt-2"
              onClick={clearSortAndClose}
            >
              {t.clearSort}
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
