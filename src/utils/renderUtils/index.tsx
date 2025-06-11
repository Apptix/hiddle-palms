import { Label } from "@/components/ui/label";
import { FieldErrorsImpl } from "react-hook-form";

interface ILabeledDataProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export const LabeledData = ({ label, value, className = "" }: ILabeledDataProps ) => (
  <div className={className}>
    <Label className="text-xs text-muted-foreground uppercase tracking-wider">{label}</Label>
    <div className="text-sm font-medium mt-1">{value || "-"}</div>
  </div>
);

export const getObjValue = ( obj: Record<string, any>, path: string ): Record<string, any> | undefined => {
  path = path.replace( /\[(\w+)\]/g, ".$1" ); // convert indexes to properties
  path = path.replace( /^\./, "" ); // strip a leading dot
  const a = path.split( "." );
  for ( let i = 0, n = a.length; i < n; ++i ) {
    const k = a[i];
    if ( obj && k in obj ) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
};

export interface IFieldErrorProps {
  error: boolean;
  helperText: JSX.Element;
}

/**
 * Generates error props for form fields based on react-hook-form errors
 *
 * @param {Partial<FieldErrorsImpl<{ [x: string]: any }>>} errors - The errors object from react-hook-form
 * @param {string} key - The field key to check for errors
 * @returns {Object|null} Returns an object with error props if there's an error, null otherwise
 */
export const getFieldErrorProps = ( errors: Partial<FieldErrorsImpl<{ [x: string]: any; }>>,
  key: string, additionalHelperText?: string ): any => {
  const value = getObjValue( errors, key );
  if ( value?.message ) {
    return {
      error: true,
      helperText: (
        <div>
          {/* <ADPIcon size="xs" icon="alert-filled" className="dark:text-warning-500" /> */}
          <div className="flex flex-col">
            <div>{value.message}</div>
            {additionalHelperText && <div>{additionalHelperText}</div>}
          </div>
        </div>
      )
    };
  } else {
    return null;
  };
};
