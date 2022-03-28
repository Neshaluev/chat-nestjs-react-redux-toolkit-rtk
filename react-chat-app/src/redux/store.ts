import { combineReducers, configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers";
import { chatApi } from "../service/ChatService";
import { roomsApi } from "../service/RoomsService";

const rootReducer = combineReducers({
  ...reducers,
  [chatApi.reducerPath]: chatApi.reducer,
  [roomsApi.reducerPath]: roomsApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(chatApi.middleware)
        .concat(roomsApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

const store = setupStore();

export default store;
