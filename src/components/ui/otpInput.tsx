import React, { useCallback, useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";

interface IOTPInputProps {
  value: string;
  length?: number;
  onChange: ( value: string ) => void;
  onResend?: () => void;
  disabled?: boolean;
}

export const OTPInput: React.FC<IOTPInputProps> = ({
  value,
  length = 6,
  onChange,
  disabled = false
}) => {
  const inputRefs = useRef<( HTMLInputElement | null )[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice( 0, length );
  }, [length]);

  const handleChange = useCallback(( e: React.ChangeEvent<HTMLInputElement>, index: number ) => {
    const input = e.target.value;

    // Only allow numbers
    if ( !/^\d*$/.test( input )) {
      return;
    }

    // Update the OTP value
    const newValue = value.split( "" );
    newValue[index] = input;
    const otpString = newValue.join( "" );
    onChange( otpString );

    // Auto-focus next input
    if ( input && index < length - 1 ) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [ value, length, onChange ]);

  const handleKeyDown = useCallback(( e: React.KeyboardEvent<HTMLInputElement>, index: number ) => {
    // Handle backspace
    if ( e.key === "Backspace" && !value[index] && index > 0 ) {
      inputRefs.current[index - 1]?.focus();
      // Handle delete
    } else if ( e.key === "Delete" && index < length - 1 ) {
      inputRefs.current[index + 1]?.focus();
      // Handle left arrow
    } else if ( e.key === "ArrowLeft" && index > 0 ) {
      inputRefs.current[index - 1]?.focus();
      // Handle right arrow
    } else if ( e.key === "ArrowRight" && index < length - 1 ) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [ value, length ]);

  const handlePaste = useCallback(( e: React.ClipboardEvent<HTMLInputElement> ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData( "text" );

    // Only allow numbers
    if ( !/^\d*$/.test( pastedData )) {
      return;
    }

    // Fill the OTP with pasted data
    const newValue = value.split( "" );
    for ( let i = 0; i < pastedData.length && i < length; i++ ) {
      newValue[i] = pastedData[i];
    }
    onChange( newValue.join( "" ));
  }, [ value, length, onChange ]);

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map(( _, i ) => (
        <Input
          key={i}
          ref={el => inputRefs.current[i] = el}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-10 h-10 text-center"
          value={value[i] || ""}
          onChange={( e ) => handleChange( e, i )}
          onKeyDown={( e ) => handleKeyDown( e, i )}
          onPaste={handlePaste}
          disabled={disabled}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};
