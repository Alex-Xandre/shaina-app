// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './state/AuthReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,

    // Add other reducers if needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
