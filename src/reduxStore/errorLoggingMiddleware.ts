// Libraries
import {
  isRejectedWithValue,
  Middleware
} from "@reduxjs/toolkit";

// Methods / Hooks / Constants / Styles
import { useAstralAlert } from "@/hooks/useAstralAlert";
export const errorLoggingMiddleware: Middleware = () => ( next ) => ( action:any ) => {
  const astralAlert = useAstralAlert();
  if ( action.meta?.arg?.originalArgs?.skipNotification ) {
    return next( action );
  }

  // TODO: add check for isRejected( action ) as well when thunk issues is resolved
  // Currently RTK is firing queries twice, once with isPending and once with isRejected
  // The isRejected check is immediately triggering the notification
  if ( isRejectedWithValue( action )) {
    astralAlert?.error({
      title: "Error",
      description: action.payload?.data?.Message ?? action.payload?.data?.message ?? action.payload?.error ?? "Network Error!"
    });
  }

  return next( action );
};