// Libraries
import { createSlice } from "@reduxjs/toolkit";

// Methods / Hooks / Constants / Styles
import { logoutAction } from "../common/actions";
import type { TAccountState } from "../types/account";

const initialState: TAccountState = {
  fetchingUser: false,
  fetchingRole: false,
  UserId: "",
  UserName: "",
  username: "",
  EmailId: "",
  EmailSubscription: "no",
  Preferences: {},
  RolesAttached: {},
  AwsRoles: {},
  IsActive: "yes",
  DefaultRole: "",
  MfaStatus: "disabled",
  Name: "",
  TnCActionPending: false,
  RoleId: "",
  RoleName: "",
  RolePermissions: [],
  RoleConsolidatedPermissions: [],
  UserDevices: []
};

const account = createSlice({
  name: "account",
  initialState,
  reducers: {
    updateAccount( state, action ) {
      Object.assign( state, action.payload );
    },
    updateAccountInitLogin( state, action ){
      Object.assign( state, action.payload );
    }
  },
  extraReducers: ( builder ) => {
    builder.addMatcher(
      action => logoutAction?.match( action ),
      ( state ) => {
        state = initialState;
        return state;
      }
    );
  }
});

const { reducer } = account;
export const { updateAccount, updateAccountInitLogin } = account.actions;
export default reducer;