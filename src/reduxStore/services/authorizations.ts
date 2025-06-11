import baseApi from "./baseApi";
import { urlBuilder } from "#utils/browserUtils";
import { extraOptionParams } from "#constants/index";
import { tagTypes } from "./tagTypes";

export interface ITag {
  TagKey: string,
  TagValue: string
}

export interface IGetAuthorizedUsersForTagsProps {
  Owner: ITag[] | [];
  Editor: ITag[] | [];
  "Read-only": ITag[] | [];
}

export interface IAddTagsRequestBody {
  AccessType: string | null;
  ResourceIds: string[],
  AccessTags: ITag[],
  AdditionalMetadata?: {
    IsDatasetLevelAccessProvided?: boolean;
    IsDomainAccessRequested?: boolean;
  }
}
export interface IDeleteTagsRequestBody {
  ResourceIds: string[],
  AccessTags: { TagKey: string, TagValue: string }[],
}

export const authorizationApi = baseApi.injectEndpoints({
  endpoints: ( build ) => ({
    getAuthorizedUsersForTags: build.query<
    IGetAuthorizedUsersForTagsProps | any, { serviceName:string, queryParams?: Record<string, any> }
    >({
      query: ({ serviceName, queryParams }) => urlBuilder([ "share", serviceName ], queryParams ),
      providesTags: [{ type: tagTypes.authorization, id: "LIST" }]
    }),
    addTagToAuthorizedResource: build.mutation<any, { serviceName:string, requestBody: IAddTagsRequestBody }>({
      query: ({ serviceName, requestBody }) => ({
        url: urlBuilder([ "share", serviceName ]),
        method: "POST",
        body: requestBody
      }),
      extraOptions: extraOptionParams,
      invalidatesTags: ( result ) => result ? [{ type: tagTypes.authorization, id: "LIST" }] : []
    }),
    deleteTagFromAuthorizedResource: build.mutation<any, { serviceName:string, requestBody: IDeleteTagsRequestBody }>({
      query: ({ serviceName, requestBody }) => ({
        url: urlBuilder([ "share", serviceName ]),
        method: "DELETE",
        body: requestBody
      }),
      extraOptions: extraOptionParams,
      invalidatesTags: ( result ) => result ? [{ type: tagTypes.authorization, id: "LIST" }] : []
    })
  }),
  overrideExisting: true
});

export const {
  useAddTagToAuthorizedResourceMutation,
  useDeleteTagFromAuthorizedResourceMutation,
  useGetAuthorizedUsersForTagsQuery
} = authorizationApi;
