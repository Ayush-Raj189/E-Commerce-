import React, { Fragment, useState } from 'react'
import { filterOptions } from '../config'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { ChevronDown, ChevronUp, Filter as FilterIcon, X } from 'lucide-react'
import { Button } from '../ui/button'

const ProductFilter = ({ filters, handleFilter }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
  })

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  // Fixed: Check if any filter array has items
  const hasActiveFilters = filters && Object.values(filters).some(filterArray => 
    Array.isArray(filterArray) && filterArray.length > 0
  )

  const clearAllFilters = () => {
    sessionStorage.removeItem("filters")
    window.location.reload()
  }

  return (
    <div className="bg-card rounded-xl border-2 shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FilterIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Filters</h2>
              <p className="text-xs text-muted-foreground">Refine your search</p>
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 text-xs gap-1 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="divide-y">
        {Object.keys(filterOptions).map((KeyItem) => {
          const isExpanded = expandedSections[KeyItem] !== false
          const activeCount = (filters?.[KeyItem] && Array.isArray(filters[KeyItem])) 
            ? filters[KeyItem].length 
            : 0

          return (
            <Fragment key={KeyItem}>
              <div className="transition-all">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(KeyItem)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold capitalize text-foreground group-hover:text-primary transition-colors">
                      {KeyItem}
                    </h3>
                    {activeCount > 0 && (
                      <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                        {activeCount}
                      </span>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all" />
                  )}
                </button>

                {/* Filter Options */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {filterOptions[KeyItem].map((options) => {
                      const isChecked =
                        filters &&
                        filters[KeyItem] &&
                        Array.isArray(filters[KeyItem]) &&
                        filters[KeyItem].indexOf(options.id) > -1

                      return (
                        <Label
                          key={options.id}
                          className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => handleFilter(KeyItem, options.id)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {options.label}
                          </span>
                        </Label>
                      )
                    })}
                  </div>
                )}
              </div>
            </Fragment>
          )
        })}
      </div>

      {/* Clear All Filters Button */}
      {hasActiveFilters && (
        <div className="p-4 sm:p-5 border-t bg-muted/30">
          <Button
            onClick={clearAllFilters}
            variant="outline"
            className="w-full gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
          >
            <X className="h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductFilter
