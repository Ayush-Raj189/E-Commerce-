import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import bannerFour from "../../assets/banner-4.png";
import bannerFive from "../../assets/banner-5.webp";
import { ChevronLeftIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import { BabyIcon, CloudLightning, WatchIcon, UmbrellaIcon, ShirtIcon } from "lucide-react";
import { Shirt } from "lucide-react";
import { WashingMachine } from "lucide-react";
import { ShoppingBasket } from "lucide-react";
import { Airplay } from "lucide-react";
import { Images } from "lucide-react";
import { Heater } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from '@/store/shop/product-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from "react-router-dom";
import { fetchProductDetails } from '@/store/shop/product-slice';
import { addToCart } from '@/store/shop/cart-slice';
import { fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { getFeatureImages } from '@/store/common-slice';

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { productsList, productDetails } = useSelector((state) => state.shopProduct)
  const { user } = useSelector((state) => state.auth)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const slides = [bannerOne, bannerTwo, bannerThree, bannerFour, bannerFive]
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { featureImageList } = useSelector((state) => state.commonFeature)

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId))
  }

  function handleAddToCart(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        dispatch(fetchCartItems(user?.id))

      }
    });
  }


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [slides]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }))
  }, [dispatch])

  useEffect(() => {
    if (productDetails && productDetails._id) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
  ];

  const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Shirt },
    { id: "adidas", label: "Adidas", icon: WashingMachine },
    { id: "puma", label: "Puma", icon: ShoppingBasket },
    { id: "levi", label: "Levi's", icon: Airplay },
    { id: "zara", label: "Zara", icon: Images },
    { id: "h&m", label: "H&M", icon: Heater },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % slides.length
            )
          }
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % slides.length
            )
          }
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>

      </div>
      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Shop by Category</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {
              categoriesWithIcon.map(categoryItem =>
                <Card onClick={() => handleNavigateToListingPage(categoryItem, 'category')} key={categoryItem.id} className='cursor-pointer hover:shadow-lg transition-shadow '>
                  <CardContent className='flex flex-col items-center justify-center p-6'>
                    <categoryItem.icon className='w-12 h-12 text-primary mb-4' />
                    <span className='text-lg font-semibold'>{categoryItem.label}</span>
                  </CardContent>

                </Card>)
            }
          </div>
        </div>
      </section>

      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Shop by Brand</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {
              brandsWithIcon.map(brandItem =>
                <Card onClick={() => handleNavigateToListingPage(brandItem, 'brand')} key={brandItem.id} className='cursor-pointer hover:shadow-lg transition-shadow '>
                  <CardContent className='flex flex-col items-center justify-center p-6'>
                    <brandItem.icon className='w-12 h-12 text-primary mb-4' />
                    <span className='text-lg font-semibold'>{brandItem.label}</span>
                  </CardContent>

                </Card>)
            }
          </div>
        </div>
      </section>

      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
              productsList && productsList.length > 0 ? productsList.map((productItem) =>
                <ShoppingProductTile key={productItem?._id} handleGetProductDetails={handleGetProductDetails} handleAddToCart={handleAddToCart} product={productItem} />
              ) : null
            }
          </div>

        </div>
      </section>
      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  )
}

export default ShoppingHome
