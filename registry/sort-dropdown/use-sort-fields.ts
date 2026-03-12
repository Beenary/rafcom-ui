import * as React from "react"

export interface SortProperty {
  id: string
  name: string
  value: string
}

export function useSortFields(initialFields: SortProperty[] = []) {
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [sortFields, setSortFields] = React.useState<SortProperty[]>(initialFields)

  const addSortField = (property: SortProperty) => {
    setSortFields((prev) => [...prev, property])
  }

  const removeAllSortFields = () => {
    setSortFields([])
  }

  const removeSortField = (index: number) => {
    setSortFields((prev) => prev.filter((_, i) => i !== index))
  }

  return {
    sortDirection,
    setSortDirection,
    sortFields,
    addSortField,
    removeSortField,
    removeAllSortFields,
  }
}
