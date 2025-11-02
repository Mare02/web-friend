'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category, Tag, ArticleFilters } from '@/lib/validators/schema'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArticlesFiltersProps {
  categories: Category[]
  tags: Tag[]
  currentFilters: ArticleFilters
  className?: string
}

export function ArticlesFilters({
  categories,
  tags,
  currentFilters,
  className,
}: ArticlesFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (updates: Partial<ArticleFilters>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Update the specific filter
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })

    // Reset to page 1 when filters change
    if (updates.category || updates.tag) {
      params.delete('page')
    }

    const newSearch = params.toString()
    router.push(newSearch ? `/articles?${newSearch}` : '/articles')
  }

  const clearFilters = () => {
    router.push('/articles')
  }

  const hasActiveFilters = currentFilters.category || currentFilters.tag

  return (
    <div className={cn('border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60', className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3">
          {/* Filters section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter by:</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              {/* Category filter */}
              <div className="flex flex-col gap-1 min-w-0 flex-1 sm:flex-initial">
                <Select
                  value={currentFilters.category || undefined}
                  onValueChange={(value) => updateFilters({ category: value || undefined })}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category.slug.current}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag filter */}
              <div className="flex flex-col gap-1 min-w-0 flex-1 sm:flex-initial">
                <Select
                  value={currentFilters.tag || undefined}
                  onValueChange={(value) => updateFilters({ tag: value || undefined })}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="All tags" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag._id} value={tag.slug.current}>
                        {tag.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pb-3">
            {currentFilters.category && (
              <Badge variant="secondary" className="gap-1">
                {categories.find(c => c.slug.current === currentFilters.category)?.title}
                <button
                  onClick={() => updateFilters({ category: undefined })}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {currentFilters.tag && (
              <Badge variant="secondary" className="gap-1">
                {tags.find(t => t.slug.current === currentFilters.tag)?.title}
                <button
                  onClick={() => updateFilters({ tag: undefined })}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
