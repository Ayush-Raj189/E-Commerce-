import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    addressList: [],
    loading: false
}
export const addNewAddress = createAsyncThunk("address/addNewAddress", async (formData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/address/add`, formData)
    return response.data
})

export const fetchAllAddress = createAsyncThunk("address/fetchAllAddress", async (userId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/address/get/${userId}`)
    return response.data
})

export const editAddress = createAsyncThunk("address/editAddress", async ({ userId, addressId, formData }) => {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/address/update/${userId}/${addressId}`, formData)
    return response.data
})

export const deleteAddress = createAsyncThunk("address/deleteAddress", async ({ userId, addressId }) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/address/delete/${userId}/${addressId}`)
    return response.data
})

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(addNewAddress.pending, (state) => {
            state.loading = true
        })
        builder.addCase(addNewAddress.fulfilled, (state,action) => {
            state.loading = false
        })
        builder.addCase(addNewAddress.rejected, (state)=>{
            state.loading=false
        })
        builder.addCase(fetchAllAddress.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchAllAddress.fulfilled, (state,action) => {
            state.loading = false
            state.addressList=action.payload.data
        })
        builder.addCase(fetchAllAddress.rejected, (state)=>{
            state.loading=false
            state.addressList=[]
        })
    }
})

export default addressSlice.reducer


