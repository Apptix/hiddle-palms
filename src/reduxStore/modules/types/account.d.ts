export type TAccountState = {
  fetchingUser: boolean;
  silentFetchUser?: boolean;
  fetchingUserError?: string;
  fetchingRole: boolean;
  roleDetails?: Record<string, unknown>;
  fetchingUserError?: string;
  UserId: string;
  UserName: string;
  username: string;
  EmailId: string;
  Name: string;
  RoleId: string;
  UserName: string;
  FirstName?: string,
  LastName?: string,
  PhoneNumber?: string,
  Address?: string,
  CurrentRole?: string,
  UserCreationTime?: string,
  LastModifiedTime?: string,
  LastModifiedBy?: string,
  UserSignature?: string
  DocumentsUploaded?: {
    DriversLicenseFront?: string,
    FederalImportLicense?: string,
    DriversLicenseBack?: string,
    CertificateOfFitness?: string,
    FederalStorageLicense?: string
  }
  County?: string,
  Preferences?: any
};