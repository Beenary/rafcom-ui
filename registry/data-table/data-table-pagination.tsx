"use client"

import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface DataTablePaginationProps {
  /** Total number of records across all pages. */
  total: number
  /** Currently active page (1-indexed). */
  currentPage: number
  /** Number of records per page. */
  pageSize: number
  /**
   * Called when the user navigates to a new page.
   * The consumer is responsible for updating the URL or state.
   */
  onPageChange: (page: number) => void
  /** Label shown before the total count. Defaults to showing just the count. */
  resultsLabel?: string
  className?: string
}

function getPageNumbers(params: {
  currentPage: number
  pageSize: number
  total: number
}): (number | "...")[] {
  const { currentPage, pageSize, total } = params
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: (number | "...")[] = [1]
  if (currentPage > 3) pages.push("...")
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (currentPage < totalPages - 2) pages.push("...")
  pages.push(totalPages)
  return pages
}

export function DataTablePagination({
  total,
  currentPage,
  pageSize,
  onPageChange,
  resultsLabel,
  className,
}: DataTablePaginationProps) {
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage * pageSize >= total
  const pageNumbers = getPageNumbers({ currentPage, pageSize, total })

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between gap-2${className ? ` ${className}` : ""}`}
    >
      {/* Results count */}
      <div className="hidden md:block text-sm text-muted-foreground">
        {resultsLabel ? `${total} ${resultsLabel}` : total}
      </div>

      <Pagination className="w-auto">
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationLink
              size={undefined}
              onClick={!isFirstPage ? () => onPageChange(currentPage - 1) : undefined}
              className={
                isFirstPage ? "text-muted-foreground pointer-events-none" : "cursor-pointer"
              }
              aria-disabled={isFirstPage}
            >
              <ChevronLeft size={15} />
            </PaginationLink>
          </PaginationItem>

          {/* Page numbers */}
          {pageNumbers.length ? (
            pageNumbers.map((pageNumber, i) =>
              pageNumber === "..." ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    size={undefined}
                    isActive={pageNumber === currentPage}
                    onClick={
                      pageNumber !== currentPage
                        ? () => onPageChange(pageNumber as number)
                        : undefined
                    }
                    className={pageNumber !== currentPage ? "cursor-pointer" : undefined}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )
          ) : (
            <PaginationItem>
              <PaginationLink size={undefined} isActive>
                1
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationLink
              size={undefined}
              onClick={!isLastPage ? () => onPageChange(currentPage + 1) : undefined}
              className={
                isLastPage ? "text-muted-foreground pointer-events-none" : "cursor-pointer"
              }
              aria-disabled={isLastPage}
            >
              <ChevronRight size={15} />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
