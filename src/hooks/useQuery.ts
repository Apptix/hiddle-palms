import React from "react";
import { useLocation } from "react-router";

// A custom hook that builds on useLocation to parse
// the query string for you.
export function useQuery(): URLSearchParams {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams( search ), [search]);
}
