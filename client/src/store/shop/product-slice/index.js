import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState={
    productsList:[],
    productDetails:[],
    loading:false
}
export const fetchAllFilteredProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async ({ filterParams, sortParams }) => {
  
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });
  
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`
      );
  
      return result?.data;
    }
  );

  export const fetchProductDetails = createAsyncThunk(
    "/products/fetchProductDetails",
    async (id) => {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`
      );
  
      return result?.data;
    }
  );
  

const shoppingProductsSlice=createSlice({
    name:"shoppingProducts",
    initialState,
    reducers:{
      setProductDetails:(state,action)=>{
        state.productDetails=null
      }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAllFilteredProducts.pending,(state)=>{
            state.loading=true
        })
        .addCase(fetchAllFilteredProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.productsList=action.payload.data
        })
        .addCase(fetchAllFilteredProducts.rejected,(state,action)=>{
            state.loading=false;
            state.productsList=[];
        })
        .addCase(fetchProductDetails.pending,(state)=>{
            state.loading=true
        })
        .addCase(fetchProductDetails.fulfilled,(state,action)=>{
            state.loading=false;
            state.productDetails=action.payload.data
        })
        .addCase(fetchProductDetails.rejected,(state,action)=>{
            state.loading=false;
            state.productDetails=null
        })
    }
})

export const {setProductDetails}=shoppingProductsSlice.actions
export default shoppingProductsSlice.reducer