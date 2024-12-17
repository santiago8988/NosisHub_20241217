'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Pagination = ({ currentPage, totalItems, itemsPerPage }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [page, setPage] = useState(currentPage)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (page !== 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }
    router.push(`${pathname}?${params.toString()}`)
  }, [page, router, pathname, searchParams])

  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)))
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={i === page ? 'default' : 'outline'}
          className="mx-1"
        >
          {i}
        </Button>
      )
    }

    return pageNumbers
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          variant="outline"
        >
          Anterior
        </Button>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          variant="outline"
        >
          Siguiente
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> a{' '}
            <span className="font-medium">{Math.min(page * itemsPerPage, totalItems)}</span> de{' '}
            <span className="font-medium">{totalItems}</span> resultados
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              variant="outline"
              className="rounded-l-md"
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
            {renderPageNumbers()}
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              variant="outline"
              className="rounded-r-md"
            >
              <span className="sr-only">Siguiente</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Pagination