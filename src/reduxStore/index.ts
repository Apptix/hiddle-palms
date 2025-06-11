// Libraries
import { configureStore, UnknownAction } from "@reduxjs/toolkit";
import { createStateSyncMiddleware } from "redux-state-sync";
import {
  persistStore,
  persistCombineReducers,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Methods / Hooks / Constants / Styles
import reducers from "./reducers";
import type { IRootState } from "./types/reducers";
import baseApi from "./services/baseApi";
import customizationsBaseApi from "./services/customizationsBaseApi";
import { errorLoggingMiddleware } from "./errorLoggingMiddleware";

const combinedReducer = persistCombineReducers<IRootState, UnknownAction>(
  { key: "adcv3", storage, blacklist: [ baseApi.reducerPath, customizationsBaseApi.reducerPath, "globalFormManager" ] },
  reducers
);

const middlewaresList = [
  errorLoggingMiddleware,
  createStateSyncMiddleware({
    // Following actions won't be triggered in other tabs
    blacklist: [ FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER ],
    // This function will selectively sync actions inbetween open browser tabs
    predicate: ( action ) => {
      let isActionPass = false;
      const [ reducerName, actionName ] = typeof action.type === "string" ? action.type.split( "/" ) : "";

      // This condition prevents tab sync while initial login
      // by blocking the action name updateAccountInitLogin wiz. used during
      // initial login only.
      if (["updateAccountInitLogin"].includes( actionName )){
        return isActionPass;
        // This condition is to track any RBAC changes that affects user Profile/account info
      } else if ([ "common", "auth", "account" ].includes( reducerName )) {
        isActionPass = true;
      }
      return isActionPass;

    },
    broadcastChannelOption: { type: "localstorage" }
  }),
  baseApi.middleware,
  customizationsBaseApi.middleware
];

// https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
export const store = configureStore({
  reducer: combinedReducer,
  // @ts-expect-error We'll correct the type error soon
  middleware: ( getDefaultMiddleware ) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [ FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER ],
        ignoredActionPaths: [
          "meta.baseQueryMeta.request",
          "meta.baseQueryMeta.response"
        ]
      }
    }).concat( middlewaresList )
});

export const persistor = persistStore( store );
