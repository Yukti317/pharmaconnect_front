const { createSlice } = require("@reduxjs/toolkit");
const initialState = {}

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user
        }
    }
})

export const { setUser } = UserSlice.actions;
export default UserSlice.reducer;