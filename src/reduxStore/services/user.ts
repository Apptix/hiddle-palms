import baseApi from "./baseApi";
import { extraOptionParams } from "@/constants/index";
import { loadUserAccount } from "../modules/account/actions";
import { tagTypes } from "./tagTypes";
import { updateAccount } from "@/reduxStore/modules/account/slice";
import { urlBuilder } from "@/utils/index";

export const userApi = baseApi.injectEndpoints({
  endpoints: ( build ) => ({
    loadAccount: build.query({
      queryFn: async ({ username, isAppsOnlyUser, action }, _api, _extraOptions, fetchWithBQ ) => {
        try {
          if ( username ) {
            const { data } = await fetchWithBQ({
              url: urlBuilder([ "users", username ], { action :action || undefined }),
              method: "GET",
              ...isAppsOnlyUser ? { headers: { is_apps_only_user: "yes" } } : {}
            }) as any;
            if ( data ){
              return { data: { ...data ?? {} } };
            }
          }
          return { data: null };
        } catch ( err:any ){
          return { error: err.message };
        }
      },
      keepUnusedDataFor: 3600,
      providesTags: ( result, _error, username ) => result ? [{ type: tagTypes.user, id: username }] : []
    }),
    createUser: build.mutation({
      query: ({ userId }) => ({
        url: userId ? urlBuilder([ "users", userId, "update" ], { operation: "user-agreement" }) : urlBuilder( "users" ),
        method: userId ? "PUT" : "POST"
      }),
      extraOptions: extraOptionParams
    }),
    createUserByAdmin: build.mutation({
      query: ({ requestBody }) => ({
        url: urlBuilder([ "users", "create-user" ]),
        body: requestBody,
        method: "POST"
      }),
      extraOptions: extraOptionParams,
      invalidatesTags: result => result ? [{ type: tagTypes.user, id: "List" }] : []
    }),
    updateUser: build.mutation({
      query: ({ requestBody, userId }) => ({
        url: urlBuilder([ "users", userId ]),
        body: requestBody,
        method: "PUT"
      }),
      extraOptions: extraOptionParams,
      async onQueryStarted({ userId, ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          updateAccount({ Preferences: { ...patch?.requestBody } })
        );
        try {
          await queryFulfilled;
        } catch {
          // patchResult.undo();
          dispatch( updateAccount({ Preferences: { ...patch?.requestBody, darkMode: !patch?.requestBody?.darkMode } }));
        } finally {
          dispatch( loadUserAccount( userId, false, true ));
        }
      }
    }),
    updateUserRole: build.mutation({
      query: ( requestBody ) => ({
        url: urlBuilder( "roles" ),
        body: requestBody,
        method: "PUT"
      }),
      extraOptions: extraOptionParams,
      invalidatesTags: ( result, _error, { userId }) => result ? [{ type: tagTypes.user, id: userId }] : []
    }),
    deleteUser: build.mutation<any, any>({
      query: ({ userId, requestBody, isAppsOnlyUser }) => ({
        url: urlBuilder([ "users", userId ]),
        method: "DELETE",
        body: requestBody,
        headers: isAppsOnlyUser ? { is_apps_only_user: "yes" } : {}
      }),
      extraOptions: extraOptionParams,
      invalidatesTags: result => result ? [{ type: tagTypes.user, id: "List" }] : []
    }),
    updateMFAStatus: build.mutation<any, { userId: string, status: "enabled" | "disabled" }>({
      query: ({ userId, status }) => ({
        url: urlBuilder([ "users", userId, "preferences?operation=set-mfa" ]),
        method: "PUT",
        params: { mfaStatus: status }
      }),
      invalidatesTags: ( result, _error, { userId }) => result ? [{ type: tagTypes.user, id: userId }] : []
    }),
    getUsers: build.query({
      query: ({ requestParams }: { requestParams?: Record<string, string> }) => urlBuilder( "users", requestParams, false ),
      providesTags: [tagTypes.users]
    }),
    getUserDocuments: build.query({
      query: ({ userName }) => ({
        url: urlBuilder([ "users", userName ], { get_documents: "yes" })
      }),
      providesTags: [tagTypes.documents],
      keepUnusedDataFor: 0
    })
  }),
  overrideExisting: true
});

export const {
  useLoadAccountQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useUpdateMFAStatusMutation,
  useCreateUserByAdminMutation,
  useGetUsersQuery,
  useGetUserDocumentsQuery
} = userApi;
