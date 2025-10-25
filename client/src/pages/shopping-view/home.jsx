import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, BabyIcon, CloudLightning, WatchIcon, UmbrellaIcon, ShirtIcon, Shirt, WashingMachine, ShoppingBasket, Airplay, Images, Heater, Sparkles } from "lucide-react"
import { Card, CardContent } from '@/components/ui/card'
import { useDispatch, useSelector } from "react-redux"
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/product-slice'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { useNavigate } from "react-router-dom"
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProductDetailsDialog from '@/components/shopping-view/product-details'
import { getFeatureImages } from '@/store/common-slice'

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { productsList, productDetails } = useSelector((state) => state.shopProduct)
  const { user } = useSelector((state) => state.auth)
  const { featureImageList } = useSelector((state) => state.commonFeature)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters")
    const currentFilter = {
      [section]: [getCurrentItem.id],
    }
    sessionStorage.setItem("filters", JSON.stringify(currentFilter))
    navigate(`/shop/listing`)
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId))
  }

  function handleAddToCart(getCurrentProductId) {
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message)
        dispatch(fetchCartItems(user?.id))
      }
    })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % (featureImageList?.length || 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [featureImageList])

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }))
  }, [dispatch])

  useEffect(() => {
    if (productDetails && productDetails._id) {
      setOpenDetailsDialog(true)
    }
  }, [productDetails])

  useEffect(() => {
    dispatch(getFeatureImages())
  }, [dispatch])

  const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
  ]

  const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Shirt },
    { id: "adidas", label: "Adidas", icon: WashingMachine },
    { id: "puma", label: "Puma", icon: ShoppingBasket },
    { id: "levi", label: "Levi's", icon: Airplay },
    { id: "zara", label: "Zara", icon: Images },
    { id: "h&m", label: "H&M", icon: Heater },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner Carousel */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              alt={`Banner ${index + 1}`}
              className={`${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              } absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ease-in-out`}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/70">
            <div className="text-center text-white">
              <Sparkles className="h-16 w-16 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Welcome to Our Store</h2>
              <p className="text-sm sm:text-base mt-2 opacity-90">Discover amazing products</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg h-8 w-8 sm:h-10 sm:w-10 backdrop-blur-sm"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + (featureImageList?.length || 1)) % (featureImageList?.length || 1)
            )
          }
        >
          <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg h-8 w-8 sm:h-10 sm:w-10 backdrop-blur-sm"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % (featureImageList?.length || 1)
            )
          }
        >
          <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {featureImageList?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Shop by Category Section */}
      <section className='py-8 sm:py-10 md:py-12 bg-gradient-to-b from-background to-muted/20'>
        <div className='container mx-auto px-3 sm:px-4 md:px-6'>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2'>Shop by Category</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Explore our diverse collection</p>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6'>
            {categoriesWithIcon.map(categoryItem => (
              <Card 
                onClick={() => handleNavigateToListingPage(categoryItem, 'category')} 
                key={categoryItem.id} 
                className='cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary/50 group'
              >
                <CardContent className='flex flex-col items-center justify-center p-4 sm:p-5 md:p-6'>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                    <categoryItem.icon className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary group-hover:scale-110 transition-transform' />
                  </div>
                  <span className='text-sm sm:text-base md:text-lg font-semibold text-center'>{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Brand Section */}
      <section className='py-8 sm:py-10 md:py-12 bg-muted/30'>
        <div className='container mx-auto px-3 sm:px-4 md:px-6'>
          <div className="text-center mb-6 sm:mb-8">
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2'>Shop by Brand</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Your favorite brands in one place</p>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6'>
            {brandsWithIcon.map(brandItem => (
              <Card 
                onClick={() => handleNavigateToListingPage(brandItem, 'brand')} 
                key={brandItem.id} 
                className='cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary/50 group'
              >
                <CardContent className='flex flex-col items-center justify-center p-4 sm:p-5 md:p-6'>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                    <brandItem.icon className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary group-hover:scale-110 transition-transform' />
                  </div>
                  <span className='text-sm sm:text-base md:text-lg font-semibold text-center'>{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='py-8 sm:py-10 md:py-12 lg:py-16'>
        <div className='container mx-auto px-3 sm:px-4 md:px-6'>
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2'>Featured Products</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Handpicked items just for you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {productsList && productsList.length > 0 ? (
              productsList.map((productItem) => (
                <ShoppingProductTile 
                  key={productItem?._id} 
                  handleGetProductDetails={handleGetProductDetails} 
                  handleAddToCart={handleAddToCart} 
                  product={productItem} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 sm:py-16">
                <ShoppingBasket className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-base sm:text-lg text-muted-foreground">No products available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  )
}

export default ShoppingHome
