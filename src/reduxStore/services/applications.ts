import baseApi from "./baseApi";
import { tagTypes } from "./tagTypes";
import { urlBuilder } from "@/utils/index";

export const applicationsApi = baseApi.injectEndpoints({
  endpoints: ( build ) => ({
    getApplications: build.query({
      query: ({ requestParams } : { requestParams?: Record<string, string> }) => urlBuilder( "applications", requestParams, false ),
      providesTags: [tagTypes.applications]
    }),
    getApplicationMetrics: build.query({
      query: () => urlBuilder([ "applications", "metrics" ]),
      providesTags: [tagTypes.metrics],
      keepUnusedDataFor: 0
    }),
    getApplicationDocuments: build.query({
      query: ({ applicationId }) => ({
        url: urlBuilder([ "applications", applicationId ], { get_documents: "yes" })
      }),
      providesTags: [tagTypes.documents]
    }),
    getApplicationById: build.query({
      query: ({ applicationId, requestParams }) => urlBuilder([ "applications", applicationId ], requestParams ),
      providesTags: [tagTypes.applications]
    }),
    getAppById: build.mutation({
      query: ({ applicationId, requestParams }) => urlBuilder([ "applications", applicationId ], requestParams )
    }),
    downloadDocument: build.query({
      query: ( document ) => urlBuilder([ "DocumentType", document ]),
      providesTags: [tagTypes.applications]
    }),
    deleteApplication: build.mutation({
      query: ({ applicationId }) => ({
        url: urlBuilder([ "applications", applicationId ]),
        method: "DELETE"
      }),
      invalidatesTags: [tagTypes.applications]
    }),
    manageApplication: build.mutation({
      query: ({ applicationId, body }) => ({
        url: urlBuilder([ "applications", applicationId, "manage" ]),
        method: "PUT",
        body
      })
    }),
    submitApplications: build.mutation<any, { requestBody: any, requestParams?: Record<string, string> }>({
      query: ({ requestBody, requestParams }) => ({
        url: urlBuilder( "applications", requestParams ),
        method: "POST",
        body: requestBody
      }),
      invalidatesTags: [tagTypes.applications]
    }),
    editApplication: build.mutation<any, { requestBody: any, applicationId: string }>({
      query: ({ requestBody, applicationId }) => ({
        url: urlBuilder([ "applications", applicationId ]),
        method: "PUT",
        body: requestBody
      }),
      invalidatesTags: [tagTypes.applications]
    })
  }),
  overrideExisting: true
});

export const {
  useGetApplicationsQuery,
  useGetApplicationMetricsQuery,
  useGetApplicationDocumentsQuery,
  useGetApplicationByIdQuery,
  useGetAppByIdMutation,
  useManageApplicationMutation,
  useSubmitApplicationsMutation,
  useDownloadDocumentQuery,
  useDeleteApplicationMutation,
  useEditApplicationMutation
} = applicationsApi;