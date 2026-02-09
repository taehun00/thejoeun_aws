import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pet: null,
  loading: false,
  error: null,
};

const petSlice = createSlice({
  name: "pet",
  initialState,
  reducers: {
    getPetRequest: (state) => {
      state.loading = true;
    },
    getPetSuccess: (state, action) => {
      state.loading = false;
      state.pet = action.payload;
    },
    getPetFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updatePetRequest: (state) => {
      state.loading = true;
    },
    updatePetSuccess: (state, action) => {
      state.loading = false;
      state.pet = action.payload;
    },
    updatePetFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deletePetRequest: (state) => {
      state.loading = true;
    },
    deletePetSuccess: (state) => {
      state.loading = false;
      state.pet = null;
    },
    deletePetFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getPetRequest,
  getPetSuccess,
  getPetFailure,
  updatePetRequest,
  updatePetSuccess,
  updatePetFailure,
  deletePetRequest,
  deletePetSuccess,
  deletePetFailure,
} = petSlice.actions;

export default petSlice.reducer;
