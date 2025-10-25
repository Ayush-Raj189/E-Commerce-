import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { StarIcon } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/shop/cart-slice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { fetchCartItems } from '@/store/shop/cart-slice';
import { setProductDetails } from '@/store/shop/product-slice';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import StarRatingComponent from '../common/starRating';
import { useState, useEffect } from 'react';
import { addReview } from '@/store/shop/review-slice';
import { getReviews } from '@/store/shop/review-slice';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {
  const [reviewMsg, setReviewMsg] = useState('');
  const [rating, setRating] = useState(0);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reviews } = useSelector((state) => state.shopReview);

  const handleRatingChange = (getRating) => {
    setRating(getRating);
  };

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );
          return;
        }
      }
    }
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        dispatch(fetchCartItems(user?.id))
      }
    });
  }

  function handleDialogClose() {
    setOpen(false)
    dispatch(setProductDetails())
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview(getProductId) {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast.success('Review Added Successfully');
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-12 max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] max-h-[90vh] overflow-y-auto">
        {/* Accessibility Title - Visually Hidden but available for screen readers */}
        <VisuallyHidden>
          <DialogTitle>Product Details</DialogTitle>
        </VisuallyHidden>

        {/* Accessibility Description */}
        <DialogDescription className="sr-only">
          Details of the product: {productDetails?.title}, description, price, sale price, and reviews.
        </DialogDescription>

        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg w-full">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-4">
          {/* Title and Description */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold">
              {productDetails?.title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-2 sm:mt-3">
              {productDetails?.description}
            </p>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p
              className={`text-xl sm:text-2xl lg:text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-sm sm:text-base text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-2">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed" disabled>
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>

          <Separator className="my-2" />

          {/* Reviews Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg sm:text-xl font-bold">Reviews</h2>

            {/* Reviews List */}
            <div className="max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] overflow-auto">
              <div className="grid gap-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem, index) => (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border flex-shrink-0">
                        <AvatarFallback>
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-base truncate">
                            {reviewItem?.userName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent rating={reviewItem?.reviewValue} />
                        </div>
                        <p className="text-muted-foreground text-xs sm:text-sm break-words">
                          {reviewItem?.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No Reviews Found</p>
                )}
              </div>
            </div>

            {/* Write Review Section */}
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Label className="text-sm sm:text-base">Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>

              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
                className="text-sm sm:text-base"
              />
              <Button
                disabled={reviewMsg.trim() === ""}
                onClick={() => handleAddReview(productDetails?._id)}
                className="w-full"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
