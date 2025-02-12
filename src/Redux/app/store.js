// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import authrouteReducer, { authrouteSlice } from "../features/AuthRouteSlice"; // Import the default export correctly
// import storage from "redux-persist/lib/storage";
// import {persistStore, persistReducer} from 'redux-persist'

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const rootReducer = combineReducers({
//   authroute: authrouteReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   // reducer: {
//   //   authroute: authrouteReducer, // Use the correct imported name
//   // },

//   reducer: persistedReducer,
//   middleware: (getdefaultMiddleware) =>
//     getdefaultMiddleware({ serializableCheck: false }),
// });

// export const persistor = persistStore(store)

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authrouteReducer, { authrouteSlice } from "../features/AuthRouteSlice";
export const store = configureStore({
  reducer: {
    authroute: authrouteReducer,
  },
});


