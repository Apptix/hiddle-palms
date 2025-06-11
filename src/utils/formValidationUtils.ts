import { REGEX_VALID_EMAIL } from "@/constants";
import i18n from "@/i18n/i18nConfig";

export const ComposeValidators = ( ...validators: Array<( ...args: any[]) => any> ) => ( value?: number | string | Date | string[]) =>
  validators.reduce(( error, validator ) => error || validator( value ), undefined );

/** Checks a finite string value only. Only for string values */
export const Validate_Required = ( label: string, type?: string ) => ( value?: unknown ): string | undefined => {
  const returnValue = undefined;
  if ( typeof value === "string" && value?.trim()?.length > 0 ) {
    return returnValue;
  } else if ( typeof value === "boolean" && [ true, false ].includes( value )) {
    return returnValue;
  } else if ( typeof value === "number" && !isNaN( value )) {
    return returnValue;
  } else if ( Array.isArray( value ) && value.length > 0 ) {
    return returnValue;
  } else if ( value instanceof Date ) {
    return returnValue;
  } else if ( typeof value === "object" ) {
    return returnValue;
  } else {
    return i18n.t( type === "select" ? "validationMessages.requiredDropdown" : "common.messages.textFieldRequired", { label, name: label });
  }
};

export const RegexValidator = ( regExLiterals: Record<string, any> = {}, value: string ): string | undefined => {
  if ( Validate_Required( "" )( value ) === i18n.t( "validationMessages.required" )) {
    return "Required";
  } else {
    const { initAlpha = true, allowChars = "", min = 0, max = 100000 } = regExLiterals;
    const initAlphaCheck = new RegExp( /^[a-zA-Z]/ );
    const lengthCheck = new RegExp( `^.{${min},${max}}$`, "g" );
    const regexCheck = new RegExp( `^${initAlpha ? "[a-zA-Z]" : ""}[a-zA-Z0-9${allowChars}]{${initAlpha ? min - 1 : min},${max}}$`, "g" );
    if ( !regexCheck.test( value )) {
      if ( !lengthCheck.test( value )) {
        return "Must be 3-50 characters";
      } else if ( initAlpha && !initAlphaCheck.test( value )) {
        return "Must start with an alphabet character";
      } else {
        return `Must have ${[ "alpha-numeric",
          allowChars.split( "" ).join( ", " )
            .replace( "-", "Hyphen (-)" )
            .replace( "_", "Underscore (_)" )
        ].join( ", " )} characters only`;
      }
    }
  }
  return undefined;
};

export const Alphanumeric_Underscore_3_50 =
  ( value: string ) => RegexValidator({ allowChars: "_", min: 3, max: 50 }, value );

export const Validate_ConfirmPassword = ( password: string ) => ( value?: unknown ): string | undefined => {
  const returnValue = undefined;

  if (
    typeof value === "string" &&
    value?.trim()?.length > 0 &&
    value === password
  ) {
    return returnValue;
  } else if ( !value ) {
    return i18n.t( "validationMessages.required", { label: "Confirm Password" });
  } else {
    return i18n.t( "validationMessages.passwordMismatch" );
  }
};

export const ComparePassword = ( testValue?: string | number ) => ( value?: string | number ): string | number | undefined =>
  testValue !== value ? i18n.t( "validationMessages.pwdMustBeSame" ) : undefined;

export const Validate_OTP_Length = ( otpLength: number ) => ( value?: string | null ): string | undefined => {
  if ( value?.length !== otpLength ) {
    return i18n.t( "validationMessages.completeOTP" );
  }
};

export const Validate_UserName_Pattern = ( value: string ): string | undefined => {
  if ( !/^[a-zA-Z][a-zA-Z0-9]{2,19}$/.test( value )) {
    if ( !/^.{3,20}$/.test( value )) {
      return i18n.t( "validationMessages.usernameMustBeCharsLong" );
    } else if ( !/^[a-zA-Z]/.test( value )) {
      return i18n.t( "validationMessages.usernameMustStartWithAlphabet" );
    } else {
      return i18n.t( "validationMessages.alphanumericCharsOnly" );
    }
  }
};
export const Validate_FullName = ( value: string ): string | undefined => {
  const REGEX_VALID_FULLNAME = new RegExp( /^[a-zA-Z0-9.\s]*$/ );
  if ( !REGEX_VALID_FULLNAME.test( value )) {
    return i18n.t( "validationMessages.cannotContainSpecialChars" );
  }
};

export const Validate_Email = ( value: string ): string | undefined => {
  if ( !REGEX_VALID_EMAIL.test( value )) {
    return i18n.t( "validationMessages.invalidEmailAddrFormat" );
  }
};

export const Validate_Password = ( value?: string ): string | undefined => {
  const REGEX_VALID_PASSWORD = new RegExp( /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-!@#%&/\\><':;|_~`])(?=.{12,99})/ );

  if ( !value?.length ) {
    return undefined;
  }

  if ( value && !REGEX_VALID_PASSWORD.test( value )) {
    return i18n.t( "validationMessages.pwdDoesntMeetReq" );
  }
};

export const Validate_MFA_Code = ( codeLength: number ) => ( value: string ): string | undefined => {
  const exp = `^[0-9]{${codeLength}}$`;
  const regex = new RegExp( exp );
  if ( value && !regex.test( value )) {
    return i18n.t( "validationMessages.invalidCode" );
  }
};

export const Validate_Age = ( minimum: string, maximum: string ) => ( value?: string ): string | undefined => {
  if ( !value ) {
    return; // If no value is provided, skip validation (e.g., for optional fields)
  }

  const num = !isNaN( parseInt( value, 10 )) ? parseInt( value, 10 ) : NaN;
  const validNum = num === 0 || !isNaN( num ); // Check if it's a valid number (including 0)

  // If not a valid number, or if the number is out of the allowed range
  if ( !validNum || num <= 18 || num >= 130 ) {
    return i18n.t( "validationMessages.age", { minimum, maximum }); // Error message if not valid or out of range
  }
};