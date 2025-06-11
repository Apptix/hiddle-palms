export const mfaType = {
  mandatory: "MANDATORY",
  optional: "OPTIONAL",
  off: "OFF"
} as const;

export const REDIRECT_URI_KEY = "redirect_uri";

export const extraOptionParams =
  { maxRetries: 1 };

export const CALLBACK_URI_KEY = "callback_uri";
export const CALLBACK_CLAIMS_KEY = "claims";
export const CALLBACK_APPNAME_KEY = "appname";

export const localStorageRedirectCallBackKey = "arcb";
export const redirectUriKey = "redirect_uri";
export const callBackUriKey = "callback_uri";
export const localStorageCallbackCallBackKey = "accb";
export const callBackClaimsKey = "claims";
export const localStorageCallBackClaimsKey = "accs";
export const callBackAppNameKey = "appname";
export const localStorageCallBackAppNameKey = "acan";

export const REGEX_FULL_NAME = ( fullName: string ) => fullName?.length > 0 && /^[\w\s]+$/.test( fullName );

// eslint-disable-next-line @stylistic/max-len
export const REGEX_VALID_EMAIL = new RegExp( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ );

export const routeActions = {
  edit: "edit",
  create: "create"
} as const;

export const MAX_DESCRIPTION_CHARS = 500;

export type TDefaultRole = "admin" | "user" | "inspector";
export const roles: Record<TDefaultRole, TDefaultRole> = {
  admin: "admin",
  user: "user",
  inspector: "inspector"
};

export const licenseType: Record<string, string> = {
  "importer": "IMPORTER",
  "storage": "STORAGE",
  "wholesale": "WHOLESALE",
  "retail": "RETAIL"
};

export const eventType: Record<string, string> = {
  "outdoor-display": "Outdoor Display of Fireworks",
  "proximate-audience": "Articles Pyrotechnic Before a Proximate Audience"
};

type TPermission = string;
type TRole = "admin" | "user" | "inspector";
type TService = "applications" | "documents" | "users";

type TServiceLevelPermission = {
  [key in TService]?: {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    [key in TRole]?: TPermission[];
  };
};

export const serviceLevelPermission: TServiceLevelPermission = {
  "applications": {
    "admin": ["view"],
    "user": [ "create", "view", "download", "revoke", "edit" ],
    "inspector": [ "view", "approve", "reject", "review" ]
  },
  "documents": {
    "user": [ "create", "view", "download", "delete" ]
  },
  "users": {
    "admin": ["*"]
  }
};

export type TApplicationStatus =
  | "draft"
  | "pending"
  | "submitted"
  | "in-review"
  | "approved"
  | "rejected"
  | "expired";

export const statusColors: Record<TApplicationStatus, string> = {
  "draft": "bg-yellow-100 text-yellow-800",
  "pending": "bg-yellow-300 text-yellow-900",
  "submitted": "bg-blue-100 text-blue-800",
  "in-review": "bg-orange-100 text-orange-800",
  "approved": "bg-green-100 text-green-800",
  "rejected": "bg-red-100 text-red-800",
  "expired": "bg-red-100 text-red-800"
};

export type TDocument = {
  name: string;
  type: string;
  description: string;
};

export function getMiddleEllipsedText( text, maxChars ) {
  if ( !text || text.length <= maxChars ) {
    return text;
  }
  if ( maxChars <= 3 ) {
    return "...";
  }

  const ellipsis = "...";
  const charsToShow = maxChars - ellipsis.length;
  const frontChars = Math.ceil( charsToShow / 2 );
  const backChars = Math.floor( charsToShow / 2 );

  return text.slice( 0, frontChars ) + ellipsis + text.slice( -backChars );
}

export const ACCEPTED_EXTENSIONS = [ ".jpg", ".jpeg", ".png", ".pdf", ".heic" ];

export const MandatoryDocuments = [
  { name: "Certificate Of Fitness", type: "CertificateOfFitness", description: "Upload a clear image or pdf of the your Certificate Of Fitness." },
  { name: "Drivers License Front", type: "DriversLicenseFront", description: "Upload a clear image or pdf of the your Drivers License Front" },
  { name: "Drivers License Back", type: "DriversLicenseBack", description: "Upload a clear image or pdf of the your Drivers License Back" }
];

export const PermitDocuments = [
  { name: "Insurance Certificate or Policy", type: "InsuranceCertificate",
    description: "Upload a clear image or pdf of the your Insurance Certificate or Policy" },
  { name: "Right of Entry", type: "RightOfEntry", description: "Upload a clear image or pdf of the your Right of Entry" },
  { name: "Plot Plan of Firing Area", type: "PlotPlan", description: "Upload a clear image or pdf of the your Plot Plan of Firing Area." }
];

export const LicenseDocuments = [
  { name: "Federal Storage License", type: "FederalStorageLicense", description: "Upload a clear image or pdf of the your Federal Storage License" },
  { name: "Federal Import License", type: "FederalImportLicense", description: "Upload a clear image or pdf of the Federal Import License" }
];

export const ValidatePhoneNumber = ( e: any, field: any ) => { //FormatePhoneNumber
  // Get cursor position
  const cursorPosition = e.target.selectionStart ?? 0;
  let value = e.target.value.replace( /\D/g, "" );
  if ( value.length > 10 ) {
    value = value.slice( 0, 10 );
  }

  // Format (XXX) XXX-XXXX
  if ( value.length >= 7 ) {
    value = `(${value.slice( 0, 3 )}) ${value.slice( 3, 6 )}-${value.slice( 6 )}`;
  } else if ( value.length >= 4 ) {
    value = `(${value.slice( 0, 3 )}) ${value.slice( 3 )}`;
  } else if ( value.length > 0 ) {
    value = `(${value}`;
  }

  // Preserve cursor position
  const diff = value.length - e.target.value.length;
  e.target.value = value;
  e.target.setSelectionRange( cursorPosition + diff, cursorPosition + diff );
  field.onChange( e );
};

/**
* Removes all formatting from a phone number string, returning only the numeric digits.
*
* @param {string} phoneNumber - The formatted phone number string to unformat
* @returns {string} The unformatted phone number containing only numeric digits
*
* @example
* // Returns "1234567890"
* removePhoneNumberFormatting("(123) 456-7890")
*
* @example
* // Returns "1234567890"
* removePhoneNumberFormatting("123-456-7890")
*/
export const removePhoneNumberFormatting = ( phoneNumber: string ) => {
  return phoneNumber?.replace( /\D/g, "" );
};

/**
 * Formats a phone number string by adding formatting characters.
 *
 * @param {string} phoneNumber - The phone number string to format
 * @returns {string} The formatted phone number string
 *
 * @example
 * // Returns "(123) 456-7890"
 * formatPhoneNumber("1234567890")
 */
export const formatPhoneNumber = ( phoneNumber: string ) => {
  return phoneNumber?.replace( /\D/g, "" ).replace( /(\d{3})(\d{3})(\d{4})/, "($1) $2-$3" );
};

export const sanitizeInputValue = ( value: string ): string => {
  return value.replace( /[\r\n\t]+/g, " " ).replace( /\s\s+/g, " " ).trim();
};

export const EntityType = [
  {
    label: "Sole Proprietory",
    value: "sole-proprietor",
    id: "1"
  },
  {
    label: "Partnership",
    value: "partnership",
    id: "2"
  },
  {
    label: "Corporation",
    value: "corporation",
    id: "3"
  }
];

export const licensType = [
  {
    label: "Importer",
    value: "importer",
    id: "1"
  },
  {
    label: "Storage",
    value: "storage",
    id: "2"
  },
  {
    label: "Wholesale",
    value: "wholesale",
    id: "3"
  },
  {
    label: "Retail",
    value: "retail",
    id: "4"
  }
];

export const counties = [
  "Honolulu",
  "Hawaii",
  "Maui",
  "Kauai"
];

export const HAWAII_CONTACT_INFO = {
  email: "dle.palms@hawaii.gov",
  address: "PO Box 110, Honolulu, HI 96801"
};

export const HAWAII_MAILING_ADDRESS = {
  honolulu: {
    line1: "Honolulu Fire Department",
    line2: "636 South Street",
    line3: "Honolulu, HI 96813"
  },
  hawaii: {
    line1: "Honolulu Fire Department",
    line2: "636 South Street",
    line3: "Hawaii, HI 96899"
  },
  maui: {
    line1: "Honolulu Fire Department",
    line2: "636 South Street",
    line3: "Maui, HI 96700"
  },
  kauai: {
    line1: "Honolulu Fire Department",
    line2: "636 South Street",
    line3: "Kauai, HI 96703"
  }
};

export const HAWAII_PAYMENT_INSTRUCTIONS = {
  payableTo: "City & County of",
  amount: {
    permit: {
      inspectionFee : "200.00",
      permitFee: "110.00"
    },
    license: {
      importer: "3,000.00",
      wholesale: "2,000.00",
      storage: "1,000.00",
      retail: "500.00"
    }
  }
};

export const DEADLINE_BUSINESS_DAYS = 30;
export const CONFIRMATION_BUSINESS_DAYS = 5;

export const APP_VERSION = {
  number: "1.0",
  lastUpdated: "April 2025"
};
