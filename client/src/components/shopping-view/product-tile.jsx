import React from 'react'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { categoryOptionsMap, brandOptionsMap } from '../config'
import { ShoppingCart, Eye } from 'lucide-react'

const ShoppingProductTile = ({ product, handleGetProductDetails, handleAddToCart }) => {
  return (
    <Card className='w-full max-w-sm mx-auto group overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20'>
      <div 
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        {/* Product Image */}
        <div className='relative overflow-hidden bg-gray-100'>
          <img
            src={product?.image}
            alt={product?.title}
            className='w-full h-[240px] sm:h-[280px] md:h-[300px] object-cover transition-transform duration-300 group-hover:scale-105'
          />
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button 
              variant="secondary" 
              size="sm"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleGetProductDetails(product?._id);
              }}
            >
              <Eye className="h-4 w-4" />
              Quick View
            </Button>
          </div>

          {/* Status Badge */}
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-xs sm:text-sm font-semibold shadow-lg">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm font-semibold shadow-lg">
              Only {product?.totalStock} left
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600 text-xs sm:text-sm font-semibold shadow-lg">
              Sale
            </Badge>
          ) : null}

          {/* Discount Percentage Badge */}
          {product?.salePrice > 0 && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-lg">
              {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
            </Badge>
          )}
        </div>

        {/* Product Details */}
        <CardContent className='p-3 sm:p-4'>
          {/* Product Title */}
          <h2 className='text-base sm:text-lg font-semibold mb-2 line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem] hover:text-primary transition-colors'>
            {product?.title}
          </h2>

          {/* Category and Brand */}
          <div className='flex flex-wrap gap-2 mb-3'>
            <Badge variant="outline" className="text-xs">
              {categoryOptionsMap[product?.category]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {brandOptionsMap[product?.brand]}
            </Badge>
          </div>

          {/* Price Section */}
          <div className='flex items-baseline gap-2 flex-wrap'>
            {product?.salePrice > 0 ? (
              <>
                <span className="text-lg sm:text-xl font-bold text-primary">
                  ${product?.salePrice}
                </span>
                <span className="text-sm sm:text-base text-muted-foreground line-through">
                  ${product?.price}
                </span>
              </>
            ) : (
              <span className="text-lg sm:text-xl font-bold text-primary">
                ${product?.price}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* Add to Cart Button */}
      <CardFooter className="p-3 sm:p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button 
            disabled
            className="w-full opacity-60 cursor-not-allowed"
          >
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddToCart(product?._id, product?.totalStock)}
            className="w-full gap-2 font-semibold hover:shadow-md transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ShoppingProductTile
