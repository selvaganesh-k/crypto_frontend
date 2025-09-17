import {
  type Action,
  configureStore,
  type ThunkAction,
} from "@reduxjs/toolkit";

// Basic reducer to fix the store configuration
const rootReducer = (state = {}, action: Action) => {
  return state;
};

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
