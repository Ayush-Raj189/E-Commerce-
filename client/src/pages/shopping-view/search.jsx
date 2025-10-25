import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getSearchResults,
    resetSearchResults,
} from "@/store/shop/search-slice";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom";
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { addToCart } from '@/store/shop/cart-slice'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { fetchProductDetails } from '@/store/shop/product-slice';



const SearchProducts = () => {
    const [keyword, setKeyword] = useState("");
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { searchResults } = useSelector((state) => state.shopSearch);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);
    const { productDetails } = useSelector((state) => state.shopProduct);

    useEffect(() => {
        if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
                dispatch(getSearchResults(keyword));
            }, 1000);
        }
        else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
            dispatch(resetSearchResults())
        }
    }, [keyword]);

    console.log(searchResults, 'searchResults');

    function handleAddToCart(getCurrentProductId, getTotalStock) {
        console.log(cartItems);
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


    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId))
    }

    useEffect(() => {
        if (productDetails && productDetails._id) {
            setOpenDetailsDialog(true);
        }
    }, [productDetails]);


    return (
        <div className="container mx-auto md:px-6 px-4 py-8">
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <Input
                        value={keyword}
                        name="keyword"
                        onChange={(event) => setKeyword(event.target.value)}
                        className="py-6"
                        placeholder="Search Products..."
                    />
                </div>
            </div>
            {!searchResults.length ? (
                <h1 className="text-5xl font-extrabold">No result found!</h1>
            ) : null}
            <div className="grid grid-cols-1 sm:grid-cols-2
             md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((item) => (
                    <ShoppingProductTile
                        handleAddToCart={handleAddToCart}
                        handleGetProductDetails={handleGetProductDetails}
                        product={item}
                    />
                ))}
            </div>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    )
}

export default SearchProducts
