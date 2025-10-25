import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice'
import adminProductReducer from './admin/product-slice'
import shopProductReducer from './shop/product-slice'
import shopCartSlice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice'
import shopOrderSlice from './shop/order-slice'
import adminOrderSlice from './admin/order-slice'
import shopSearchSlice from './shop/search-slice'
import shopReviewSlice from './shop/review-slice'
import commonFeatureSlice from './common-slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProduct: adminProductReducer,
    shopProduct: shopProductReducer,
    shopCart: shopCartSlice,
    shopAddress:shopAddressSlice,
    shopOrder:shopOrderSlice,
    adminOrder:adminOrderSlice,
    shopSearch:shopSearchSlice, 
    shopReview:shopReviewSlice,
    commonFeature:commonFeatureSlice,
  },
})