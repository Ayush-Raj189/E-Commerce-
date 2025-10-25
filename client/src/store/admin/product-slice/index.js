import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    productsList: [],
    loading: false,
    error: null,
}

export const addNewProduct=createAsyncThunk("products/addNewProduct",async(formData,{rejectWithValue})=>{
    try {
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/add`,formData,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        })
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const fetchAllProducts=createAsyncThunk("products/fetchAllProducts",async(_, {rejectWithValue})=>{
    try {
        const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/get`,{
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        })
        return response?.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const editProduct = createAsyncThunk(
    "/products/editProduct",
    async ({ id, formData }) => {
      const result = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data;
    }
  );

export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",
    async (id) => {
      const result = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`,
      );
      return result?.data;
    }
  );


const AdminProductSlice = createSlice({
    name: "adminProduct",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchAllProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.productsList=action.payload.data;
        })
        .addCase(fetchAllProducts.rejected,(state,action)=>{
            state.loading=false;
            state.productsList=[];
        })
    }
})

export default AdminProductSlice.reducer

