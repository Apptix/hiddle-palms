// Libraries
import { shallowEqual, TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Methods / Hooks / Constants / Styles
import type { TRootState, TAppDispatch } from "../types";

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<TAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<TRootState> = ( selectorFn ) => useSelector( selectorFn, shallowEqual );