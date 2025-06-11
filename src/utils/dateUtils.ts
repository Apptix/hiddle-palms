// Libraries
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ar";

dayjs.extend( relativeTime );
dayjs.extend( utc );
dayjs.extend( timezone );
dayjs.extend( customParseFormat );

export const DefaultTimestampFormat = "DD MMM, YYYY hh:mm A";
export const DefaultDateFormat = "DD MMM, YYYY";

// ------------------------------------------------------------------------------------------------------------------------------------------------------
/*  VERY IMP README (5mins read):
    This note is very important while reconciling in-between UTC and local times with clarity and writting helper utils accurately.
    Difference in-between any value passed to dayjs() & dayjs.utc(), i.e. ['foo' as in `dayjs(foo)` OR `dayjs.utc(foo)`] :
*/
/*
    CASE 1:
    IF `foo` has UTC information [Ex.'Z'(ISO format), JS Date format (new Date()), unix-date/epoch (ticks)] is PRESENT :
    `dayjs(foo)` will churn-out an object with time in users browser timezone, BUT THIS IS CALCULATED from the passed UTC offset internally.
    Meaning, all `dayjs(foo).format(<string>)` will display local time only while
    the `dayjs(foo).toISOString()` will be the represent the time of `foo` itself as originally passed.
    And if any value passed to `dayjs.utc(foo)`, it is treated as UTC time by default and `dayjs.utc(foo).format(<string>)`
    will give only UTC values of the passed `foo`. No local values.
    Ex. uncomment and try this snippet below to see the contrast : (with UTC info)
    console.log( dayjs("2020-01-20T08:37:57.000Z").format(DefaultTimestampFormat), dayjs.utc("2020-01-20T08:37:57.000Z").format(DefaultTimestampFormat)  )
*/
/*
    CASE 2:
    IF the UTC information is ABSENT in `foo` [i.e. its a random string in some format] :
    `dayjs(foo)` returns an object whose time is ASSUMED to be local browser time. The corresponding UTC time is calculated internally but not displayed.
    Meaning, The `dayjs(foo).toISOString()` is different from the time instance that `foo` represents.
    And if the value is passed to `dayjs.utc(foo)` it is treated as UTC time by default and `dayjs.utc(foo).format(<string>)`
    will produce the passed value of `foo` itself. To get the local value it has to be put through `.local()`
    Ex. uncomment and try this snippet below to see the contrast : (No UTC info)
    console.log(dayjs("2020-01-20 08:37:57").format(DefaultTimestampFormat), dayjs.utc("2020-01-20 08:37:57").format(DefaultTimestampFormat))
*/
/*
    In short, we can say from documentation :
    -> By default, Day.js parses and displays in local time.
    -> If you want to parse or display in UTC, you can use dayjs.utc() instead of dayjs().
        Methods:
        dayjs.utc dayjs.utc(dateType?: string | number | Date | Dayjs, format? string)
        Returns a Dayjs object in UTC mode.
        Use UTC time .utc()
        Returns a cloned Dayjs object with a flag to use UTC time.
        Use local time .local()
        Returns a cloned Dayjs object with a flag to use local time.
        isUTC mode .isUTC()
        Returns a boolean indicating current Dayjs object is in UTC mode or not.
*/
// ------------------------------------------------------------------------------------------------------------------------------------------------------

const getResponseDatetimeFormat = ( datetime: string ) => {
  switch ( true ) {
    case /\.\d{2,}$/.test( datetime ):
      return "YYYY-MM-DD HH:mm:ss.SSS";
    case /:\d{2}/.test( datetime ):
      return "YYYY-MM-DD HH:mm:ss";
    default:
      return "YYYY-MM-DD HH:mm:ss";
  }
};

// Since this util is mostly used to convert UTC dates incoming from server to local ones ,
// the mode of parsing `dateValue` is defaulted to be UTC.
export const convertToLocalTime = (
  dateValue: string | number | dayjs.Dayjs | Date | null | undefined,
  formatString = DefaultTimestampFormat,
  type = "absolute" ): string => {

  if ( !dateValue ) {
    return "";
  }
  //utc-parsing mode then converting to local object
  const receivedTime = /^\d{10}$/.test( dateValue as string )
    ? dayjs.unix( Number( dateValue ))
    : dayjs.utc( dateValue, getResponseDatetimeFormat( dateValue as string ) || undefined ).local();
  if ( type === "relative" ) {
    return receivedTime.fromNow();
  } else {
    return receivedTime.format( formatString );
  }
};

// Since this util is mostly used to convert local dates to UTC ones and pass to server,
//  the mode of parsing `dateValue` is defaulted to be local.
export const convertToUTCTime = (
  dateValue: string | number | dayjs.Dayjs | Date | null | undefined,
  formatString = DefaultTimestampFormat ): string => {
  if ( !dateValue ) {
    return "";
  }
  //local-parsing mode then converting to utc object
  const receivedTime = dayjs( dateValue ).utc();
  // Since ISO is a standard format to be passed to server, it stands out as a built-in format.
  return formatString === "iso" ? receivedTime.toISOString() : receivedTime.format( formatString );
};

export const validateTimestamp = ( dateValue: string | number | dayjs.Dayjs | Date | null | undefined ): boolean => {
  if ( typeof dateValue === "undefined" ) {
    return false;
  }
  try {
    return dayjs( dateValue ).isValid();

  } catch {
    console.error( "Error validating timestamp" );
    return false;
  }
};

export const sortTimestamps = (
  a: string | number | dayjs.Dayjs | Date | null | undefined,
  b: string | number | dayjs.Dayjs | Date | null | undefined, order = "desc" ): 1 | 0 | -1 => {
  if ( validateTimestamp( a ) && validateTimestamp( b )) {
    return order === "desc" ? (( dayjs( b ).isAfter( dayjs( a ))) ? 1
      : ( dayjs( a ).isAfter( dayjs( b )) ? -1 : 0 ))
      : (( dayjs( a ).isAfter( dayjs( b ))) ? 1
        : ( dayjs( b ).isAfter( dayjs( a )) ? -1 : 0 ));
  } else {
    return 0;
  }
};

export const toMoment = (
  dateValue: string | number | dayjs.Dayjs | Date | null | undefined,
  type: "obj" | "epoch" = "obj",
  formatString = "none" ): string | number | dayjs.Dayjs => {
  const momentObj = dateValue ? dayjs( dateValue ) : dayjs();
  return type === "epoch" ? momentObj.valueOf() : ( formatString === "none" ? momentObj : momentObj.format( formatString ));
};

export const xDaysFromNow = ( x: number ): Date => {
  // Create new Date instance
  const date = new Date();
  // Add x days
  date.setDate( date.getDate() + x );
  return date;
};

export const xHoursFromNow = ( x: number ): Date => {
  // Create new Date instance
  const date = new Date();
  // Add x hours
  date.setHours( date.getHours() + x );
  return date;
};

export const xDaysBeforeNow = ( x: number ): Date => {
  // Create new Date instance
  const date = new Date();
  // Add x days
  date.setDate( date.getDate() - x );
  return date;
};

export const configureDayJSLocale = ( lang:string ):void => {
  dayjs.locale( lang );
};

export const getDate = ( inDays:number, plusMinus:number ) => {
  const today = new Date();
  return new Date( today.getFullYear(),
    today.getMonth(),
    today.getDate() + ( inDays * plusMinus ));
};

export const filterPassedTime = ( daysFromNow: number ) => {
  return function filterTime( time: Date ) {
    const currentDate = new Date();
    const endDate = xDaysFromNow( daysFromNow );
    const selectedDate = new Date( time );

    return ( selectedDate.getTime() < endDate.getTime() && currentDate.getTime() < selectedDate.getTime());
  };
};

export const formatDateTime = ( dateValue: string | number | dayjs.Dayjs | Date | null | undefined ): { date: string, time: string } => {
  if ( !dateValue ) {
    return { date: "", time: "" };
  }

  const receivedTime = dayjs( dateValue );

  const formattedDate = receivedTime.format( "YYYY-MM-DD" );
  const formattedTime = receivedTime.format( "HH:mm:ss" );

  return { date: formattedDate, time: formattedTime };
};

export function getNowHSTDateTime() {
  // Create date object for current time
  const now = new Date();

  // Convert to HST (UTC-10:00, no daylight saving)
  // HST is always UTC-10, so we just subtract 10 hours
  const hstOffset = -10 * 60 * 60 * 1000; // -10 hours in milliseconds
  const hstTime = new Date( now.getTime() + hstOffset );

  // Extract components
  const year = hstTime.getUTCFullYear();
  const month = String( hstTime.getUTCMonth() + 1 ).padStart( 2, "0" );
  const day = String( hstTime.getUTCDate()).padStart( 2, "0" );
  const hours = String( hstTime.getUTCHours()).padStart( 2, "0" );
  const minutes = String( hstTime.getUTCMinutes()).padStart( 2, "0" );
  const seconds = String( hstTime.getUTCSeconds()).padStart( 2, "0" );

  // Format as requested
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}