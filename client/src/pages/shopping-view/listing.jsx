import ProductFilter from '@/components/shopping-view/filter'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import React, { useState, useEffect } from 'react'
import { ArrowUpDown, Filter, Package, SlidersHorizontal } from 'lucide-react'
import { sortOptions } from '@/components/config'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/product-slice'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { useSearchParams } from 'react-router-dom'
import ProductDetailsDialog from '@/components/shopping-view/product-details'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ShoppingListing = () => {
  const dispatch = useDispatch()
  const { cartItems } = useSelector((state) => state.shopCart)
  const { productsList, productDetails } = useSelector((state) => state.shopProduct)
  const { user } = useSelector((state) => state.auth)
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState("price-lowtohigh")
  const [searchParams, setSearchParams] = useSearchParams()
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const categorySearchParams = searchParams.get("category")

  const handleSort = (sortValue) => {
    setSort(sortValue)
  }

  function createSearchParamsHelper(filterParams) {
    const queryParams = []

    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",")
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
      }
    }

    return queryParams.join("&")
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters }
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId)

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      }
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption)

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption)
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1)
    }

    setFilters(cpyFilters)
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters))
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId))
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || []

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      )
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} quantity can be added for this item`)
          return
        }
      }
    }
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message)
        dispatch(fetchCartItems(user?.id))
      }
    })
  }

  // Initialize filters from sessionStorage
  useEffect(() => {
    const savedFilters = JSON.parse(sessionStorage.getItem("filters")) || {}
    setFilters(savedFilters)
  }, [categorySearchParams])

  // Update URL params when filters change
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters)
      setSearchParams(new URLSearchParams(createQueryString))
    }
  }, [filters])

  // Fetch products when sort or filters change
  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }))
  }, [dispatch, sort, filters])

  // Open details dialog when product details are loaded
  useEffect(() => {
    if (productDetails && productDetails._id) {
      setOpenDetailsDialog(true)
    }
  }, [productDetails])

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1">
                All Products
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Discover our complete collection
              </p>
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden xs:inline">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[300px] p-0">
                <SheetHeader className="px-4 py-5 border-b bg-gradient-to-r from-primary/10 to-transparent">
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    Filter Products
                  </SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto h-[calc(100vh-80px)] p-4">
                  <ProductFilter filters={filters} handleFilter={handleFilter} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-20">
              <ProductFilter filters={filters} handleFilter={handleFilter} />
            </div>
          </aside>

          {/* Products Section */}
          <div className="w-full">
            {/* Toolbar */}
            <div className="bg-card rounded-lg border-2 shadow-sm mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-sm sm:text-base font-medium text-muted-foreground">
                    {productsList?.length || 0} Products Found
                  </span>
                </div>
                
                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">
                        {sortOptions.find(option => option.id === sort)?.label || 'Sort by'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                      {sortOptions.map(sortItem => (
                        <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                          {sortItem.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Products Grid */}
            {productsList && productsList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {productsList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddToCart={handleAddToCart}
                    key={productItem._id}
                    product={productItem}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-muted flex items-center justify-center mb-4 sm:mb-6">
                  <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Products Found</h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center max-w-sm">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  )
}

export default ShoppingListing
