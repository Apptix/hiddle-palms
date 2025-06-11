// Libraries
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const customizationsBaseApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${window.location.origin}/customizations/` }),
  reducerPath: "customizationsBaseApi",
  endpoints: () => ({})
});

export default customizationsBaseApi;