import { createSlice } from '@reduxjs/toolkit'
import { fetchAllProducts, searchProducts } from './homepageThunk'

const initialState = {
    productList: [], // products from /products/all
    loading: false,
    error: null,
}

const homepageSlice = createSlice({
    name: 'homepage',
    initialState,
    reducers: {
        clearSearch(state) {
            state.searchResults = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchAllProducts
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false
                console.log("action", action.payload?.hits?.hits);
                state.productList = action.payload?.hits?.hits || []

            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error?.message
            })

            // searchProducts
            .addCase(searchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.loading = false
                console.log("action", action.payload?.hits?.hits);
                state.productList = action.payload?.hits?.hits || []
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error?.message
            })
    },
})

export const { clearSearch } = homepageSlice.actions

export default homepageSlice.reducer
