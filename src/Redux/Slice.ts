import { configureStore, createSlice } from "@reduxjs/toolkit";

type modeType = {
    mode: boolean
}
const initialState: modeType = {
    mode: false
}

const MainSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        ModeSwicher: state => {
            state.mode = !state.mode;
        }
    }
})

export const { ModeSwicher } = MainSlice.actions
const reduc =  MainSlice.reducer

export const store = configureStore({
    reducer: {
        store: reduc
    }
})

export type RootState = ReturnType<typeof store.getState>;

