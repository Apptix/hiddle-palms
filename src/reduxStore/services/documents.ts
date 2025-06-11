import baseApi from "./baseApi";
import { urlBuilder } from "@/utils/index";

export const applicationsApi = baseApi.injectEndpoints({
  endpoints: ( build ) => ({
    getPreSignedUrl: build.mutation({
      query: ( requestBody: {
        DocumentType: string,
        FileName: string,
        ApplicationId: string
      }) => ({
        url: urlBuilder(["documents"]),
        method: "POST",
        body: requestBody
      })
    }),
    getDocumentUrl: build.query({
      query: ( queryParams: {
        DocumentType: string,
        ApplicationId?: string,
      }) => ({
        url: urlBuilder(["documents"], queryParams ),
        method: "GET"
      }),
      keepUnusedDataFor: 0
    }),
    deleteDocument: build.mutation({
      query: ( queryParams ) => ({
        url: urlBuilder(["documents"], queryParams ),
        method: "DELETE"
      })
    })
  }),
  overrideExisting: true
});

export const {
  useGetPreSignedUrlMutation,
  useDeleteDocumentMutation,
  useGetDocumentUrlQuery
} = applicationsApi;