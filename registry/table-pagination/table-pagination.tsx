"use client"

import React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

function getPageNumbers(params: {
  currentPage: number
  pageSize: number
  total: number
}): (number | "...")[] {
  const { currentPage, pageSize, total } = params
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages: (number | "...")[] = [1]
  if (currentPage > 3) pages.push("...")
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (currentPage < totalPages - 2) pages.push("...")
  pages.push(totalPages)
  return pages
}

export interface TablePaginationProps {
  /** Total number of records across all pages. */
  total: number
  /** Default page size when the `pageSize` URL param is absent. Defaults to 20. */
  defaultPageSize?: number
  /**
   * Label appended after the total count in the results line (e.g. "results" → "42 results").
   * Defaults to "results".
   */
  resultsLabel?: string
}

export function TablePagination({
  total,
  defaultPageSize = 20,
  resultsLabel = "results",
}: TablePaginationProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPage = Number(searchParams.get("page")) || 1
  const pageSize = Number(searchParams.get("pageSize")) || defaultPageSize
  const isLastPage = currentPage * pageSize >= total
  const pageNumbers = getPageNumbers({ currentPage, pageSize, total })

  const navigateToPage = (page: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      <div className="md:flex-1 text-sm text-muted-foreground text-center md:mb-0 mb-2 md:text-left hidden md:block">
        {total} {resultsLabel}
      </div>

      <Pagination className="w-auto">
        <PaginationContent>
          <PaginationItem>
            {currentPage !== 1 ? (
              <PaginationLink size={undefined}>
                <button
                  onClick={() => navigateToPage(currentPage - 1)}
                  className="w-9 h-9 flex justify-center items-center"
                >
                  <ChevronLeft size={15} />
                </button>
              </PaginationLink>
            ) : (
              <PaginationLink size={undefined} className="text-muted-foreground pointer-events-none">
                <ChevronLeft size={15} />
              </PaginationLink>
            )}
          </PaginationItem>

          {pageNumbers.length ? (
            pageNumbers.map((pageNumber, i) =>
              pageNumber === "..." ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNumber}>
                  {pageNumber === currentPage ? (
                    <PaginationLink size={undefined} isActive>
                      {pageNumber}
                    </PaginationLink>
                  ) : (
                    <PaginationLink size={undefined}>
                      <button
                        onClick={() => navigateToPage(pageNumber)}
                        className="w-9 h-9 flex justify-center items-center"
                      >
                        {pageNumber}
                      </button>
                    </PaginationLink>
                  )}
                </PaginationItem>
              )
            )
          ) : (
            <PaginationItem>
              <PaginationLink size={undefined} isActive>1</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            {!isLastPage ? (
              <PaginationLink size={undefined}>
                <button
                  onClick={() => navigateToPage(currentPage + 1)}
                  className="w-9 h-9 flex justify-center items-center"
                >
                  <ChevronRight size={15} />
                </button>
              </PaginationLink>
            ) : (
              <PaginationLink size={undefined} className="text-muted-foreground pointer-events-none">
                <ChevronRight size={15} />
              </PaginationLink>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
