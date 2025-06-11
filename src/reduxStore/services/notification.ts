import baseApi from "./baseApi";
import { tagTypes } from "./tagTypes";
import { urlBuilder } from "#utils/browserUtils";
import { extraOptionParams } from "#constants/index";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: ( build ) => ({
    getRecentNotifications: build.query<void, any>({
      query: ( queryParams: any ) => urlBuilder([ "notifications", "events" ], queryParams ),
      providesTags: [tagTypes.eventNotifications]
    }),
    updateRecentEventNotifications: build.mutation<void, any>({
      query: ( requestBody: any ) => ({
        url: urlBuilder([ "notifications", "events" ]),
        method: "PUT",
        body: requestBody
      }),
      extraOptions: extraOptionParams,
      async onQueryStarted({ NotificationEventIds }:any, { dispatch, queryFulfilled, ...rest }) {
        //eslint-disable-next-line
        const { queries }:any = rest.getState()?.baseApi;

        const { originalArgs = {},
          data: NotificationData = {} } = queries["getRecentNotifications({\"limit\":24,\"offset\":1,\"read\":\"no\",\"sortorder\":\"desc\"})"] ?? {};
        const isAllNotifications = NotificationEventIds[0] === "all";
        let patchResult;
        if ( isAllNotifications ){
          patchResult = dispatch(
            notificationApi.util.updateQueryData( "getRecentNotifications", originalArgs, ( draft:any ) => {
              draft = { ...NotificationData,
                NotificationEvents: [] };
              return draft;
            })
          );
        } else {
          patchResult = dispatch(
            notificationApi.util.updateQueryData( "getRecentNotifications", originalArgs, ( draft:any ) => {
              draft = { ...NotificationData,
                NotificationEvents: NotificationData.NotificationEvents.filter(( item:any ) => !NotificationEventIds.includes( item.NotificationId )) };
              return draft;
            })
          );
        }
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ( result ) => result ? [tagTypes.notifications] : []
    })
  }),
  overrideExisting: true
});

export const { useGetRecentNotificationsQuery, useUpdateRecentEventNotificationsMutation } = notificationApi;
