// Libraries

// Methods / Hooks / Constants / Types / Styles
import { useAppSelector } from "./storeHooks";
import { serviceLevelPermission } from "@/constants/index";

/**
 * Method to check if the given permission is present in userRolePermissions
 * @param {string[]} userRolePermissions - userRolePermissions array
 * @param {string} permissionToCheck - permission that needs to be verified in the userRolePermissions
 * @returns {boolean} boolean value of permission existence in the userRolePermissions.
 */
export function PermCheck( userRolePermissions: string[], permissionToCheck: string, exact?: boolean ): boolean {
  const [ service, permission ] = permissionToCheck.split( "." );
  const filteredUserPermissions = userRolePermissions.filter(( hayItem ) => hayItem.startsWith( service ));
  if ( service === "any" ){
    return true;
  }
  if ( exact ) {
    return userRolePermissions.indexOf( permissionToCheck ) !== -1;
  } else if ( filteredUserPermissions.includes( `${service}.fullaccess` )) {
    return true;
  } else if ( permission === "view" && filteredUserPermissions.includes( `${service}.manage` )) {
    return true;
  } else {
    return filteredUserPermissions.includes( permissionToCheck );
  }
}

/**
 * @param {string[]} key - userRolePermissions array
 */
export const useUserPermission = ( key: string ) => {
  const { RoleId = "" } = useAppSelector(( state ) => ({ RoleId: state.account?.RoleId }));

  if ( serviceLevelPermission[key]) {
    if ( serviceLevelPermission[key][RoleId]) {
      return serviceLevelPermission[key][RoleId];
    } else {
      return [];
    }
  } else {
    return [];
  }
};