'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { DateRange } from 'react-day-picker'
import { format } from 'date-fns'

/**
 * Centralised hook for URL search param management with debounced batching.
 * All updates within a 300ms window are grouped into a single router.replace call.
 *
 * @param options.resetPageSize - When true (default), resetting the page also resets pageSize to '20'.
 *                                Pass false for features that don't use pageSize.
 */
export function useURLParams(options?: { resetPageSize?: boolean }) {
  const resetPageSize = options?.resetPageSize ?? true

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pendingUpdatesRef = useRef<Map<string, string | null>>(new Map())
  const isInitialMountRef = useRef(true)

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current)
    }
  }, [])

  /**
   * Queues a single param update.
   * Supports string, string[], DateRange (splits into `{key}From` / `{key}To`), or null to delete.
   */
  const updateParam = (
    key: string,
    value: string | string[] | DateRange | null,
    options?: { resetPage?: boolean; immediate?: boolean }
  ) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current)

    if (typeof value === 'string') {
      pendingUpdatesRef.current.set(key, value || null)
    } else if (Array.isArray(value)) {
      pendingUpdatesRef.current.set(key, value.length > 0 ? value.join(',') : null)
    } else if (value && typeof value === 'object' && 'from' in value) {
      pendingUpdatesRef.current.set(
        `${key}From`,
        value.from ? format(value.from as Date, 'yyyy-MM-dd') : null
      )
      pendingUpdatesRef.current.set(
        `${key}To`,
        value.to ? format(value.to as Date, 'yyyy-MM-dd') : null
      )
    } else {
      pendingUpdatesRef.current.set(key, null)
      if (key.includes('At')) {
        pendingUpdatesRef.current.set(`${key}From`, null)
        pendingUpdatesRef.current.set(`${key}To`, null)
      }
    }

    if (options?.resetPage) {
      pendingUpdatesRef.current.set('page', '1')
      if (resetPageSize) pendingUpdatesRef.current.set('pageSize', '20')
    }

    const applyUpdates = () => {
      const params = new URLSearchParams(searchParams.toString())
      pendingUpdatesRef.current.forEach((value, key) => {
        if (value === null) params.delete(key)
        else params.set(key, value)
      })
      pendingUpdatesRef.current.clear()
      const next = params.toString()
      if (next !== searchParams.toString()) router.replace(`${pathname}?${next}`)
    }

    if (options?.immediate || isInitialMountRef.current) {
      if (isInitialMountRef.current) {
        setTimeout(() => { isInitialMountRef.current = false; applyUpdates() }, 0)
      } else {
        applyUpdates()
      }
      return
    }

    updateTimeoutRef.current = setTimeout(applyUpdates, 300)
  }

  /**
   * Queues multiple param updates in one call.
   */
  const updateParams = (
    updates: Record<string, string | string[] | DateRange | null>,
    options?: { resetPage?: boolean; immediate?: boolean }
  ) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current)

    Object.entries(updates).forEach(([key, value]) => {
      if (typeof value === 'string') {
        pendingUpdatesRef.current.set(key, value || null)
      } else if (Array.isArray(value)) {
        pendingUpdatesRef.current.set(key, value.length > 0 ? value.join(',') : null)
      } else if (value && typeof value === 'object' && 'from' in value) {
        pendingUpdatesRef.current.set(
          `${key}From`,
          value.from ? format(value.from as Date, 'yyyy-MM-dd') : null
        )
        pendingUpdatesRef.current.set(
          `${key}To`,
          value.to ? format(value.to as Date, 'yyyy-MM-dd') : null
        )
      } else {
        pendingUpdatesRef.current.set(key, null)
        if (key.includes('At')) {
          pendingUpdatesRef.current.set(`${key}From`, null)
          pendingUpdatesRef.current.set(`${key}To`, null)
        }
      }
    })

    if (options?.resetPage) {
      pendingUpdatesRef.current.set('page', '1')
      if (resetPageSize) pendingUpdatesRef.current.set('pageSize', '20')
    }

    const applyUpdates = () => {
      const params = new URLSearchParams(searchParams.toString())
      pendingUpdatesRef.current.forEach((value, key) => {
        if (value === null) params.delete(key)
        else params.set(key, value)
      })
      pendingUpdatesRef.current.clear()
      const next = params.toString()
      if (next !== searchParams.toString()) router.replace(`${pathname}?${next}`)
    }

    if (options?.immediate) { applyUpdates(); return }
    updateTimeoutRef.current = setTimeout(applyUpdates, 300)
  }

  /** Reads a single URL param. */
  const getParam = (key: string): string | null => searchParams.get(key)

  /** Reads multiple URL params at once. */
  const getParams = (keys: string[]): Record<string, string | null> => {
    return Object.fromEntries(keys.map(k => [k, searchParams.get(k)]))
  }

  return { updateParam, updateParams, getParam, getParams, searchParams }
}
