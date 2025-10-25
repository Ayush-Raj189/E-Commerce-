import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "react-router-dom"
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProductDetailsDialog from '@/components/shopping-view/product-details'
import { fetchProductDetails } from '@/store/shop/product-slice'
import { Search, Package, Loader2 } from 'lucide-react'

const SearchProducts = () => {
    const [keyword, setKeyword] = useState("")
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch()
    const { searchResults } = useSelector((state) => state.shopSearch)
    const { cartItems } = useSelector((state) => state.shopCart)
    const { user } = useSelector((state) => state.auth)
    const { productDetails } = useSelector((state) => state.shopProduct)

    useEffect(() => {
        if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
            setIsSearching(true)
            const timer = setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
                dispatch(getSearchResults(keyword)).finally(() => {
                    setIsSearching(false)
                })
            }, 1000)
            return () => clearTimeout(timer)
        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            dispatch(resetSearchResults())
            setIsSearching(false)
        }
    }, [keyword])

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

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId))
    }

    useEffect(() => {
        if (productDetails && productDetails._id) {
            setOpenDetailsDialog(true)
        }
    }, [productDetails])

    return (
        <div className="min-h-screen bg-background">
            {/* Search Header */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
                <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
                            Search Products
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground text-center mb-6">
                            Find exactly what you're looking for
                        </p>
                        
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                value={keyword}
                                name="keyword"
                                onChange={(event) => setKeyword(event.target.value)}
                                className="pl-12 pr-12 py-6 text-base sm:text-lg rounded-xl border-2 focus:border-primary transition-all"
                                placeholder="Search products..."
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
                            )}
                        </div>
                        
                        {/* Search Info */}
                        {keyword && keyword.trim().length > 0 && keyword.trim().length <= 3 && (
                            <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
                                Type at least 4 characters to search
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
                {/* Results Count */}
                {keyword && keyword.trim().length > 3 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            <span className="font-medium">
                                {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
                                {keyword && ` for "${keyword}"`}
                            </span>
                        </div>
                    </div>
                )}

                {/* No Results State */}
                {keyword && keyword.trim().length > 3 && !isSearching && searchResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
                        <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-muted flex items-center justify-center mb-6">
                            <Search className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">No Results Found</h2>
                        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md">
                            We couldn't find any products matching "{keyword}". Try different keywords or browse our categories.
                        </p>
                    </div>
                )}

                {/* Initial State - No Search Yet */}
                {!keyword && (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
                        <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <Search className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Start Searching</h2>
                        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md">
                            Enter a product name or keyword to find what you're looking for
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {isSearching && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary animate-spin mb-4" />
                        <p className="text-sm sm:text-base text-muted-foreground">Searching products...</p>
                    </div>
                )}

                {/* Products Grid */}
                {!isSearching && searchResults.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                        {searchResults.map((item) => (
                            <ShoppingProductTile
                                key={item._id}
                                handleAddToCart={handleAddToCart}
                                handleGetProductDetails={handleGetProductDetails}
                                product={item}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ProductDetailsDialog 
                open={openDetailsDialog} 
                setOpen={setOpenDetailsDialog} 
                productDetails={productDetails} 
            />
        </div>
    )
}

export default SearchProducts
