import React, { useCallback, useEffect, useRef } from "react";

import { Button } from "./button";
import SignatureCanvas from "react-signature-canvas";

interface ISignaturePadProps {
  value?: string
  onChange: ( value: string ) => void
  disabled?: boolean
}

export default function SignaturePad({ value, onChange, disabled }: ISignaturePadProps ) {
  const signaturePad = useRef<SignatureCanvas>( null );

  const handleClear = useCallback(( e?: React.MouseEvent<HTMLButtonElement> ) => {
    e?.preventDefault();
    if ( signaturePad.current ) {
      signaturePad.current.clear();
      onChange( "" );
    }
  }, [onChange]);

  const handleEnd = useCallback(() => {
    if ( signaturePad.current ) {
      const dataUrl = signaturePad.current.toDataURL( "image/png" );
      onChange( dataUrl );
    }
  }, [onChange]);

  useEffect(() => {
    if ( signaturePad.current && value ) {
      signaturePad.current.fromDataURL( value );
    }
  }, [value]);

  return (
    <div className="relative border border-primary-500 rounded">
      {value && (
        <Button
          size="sm"
          variant="link"
          color="secondary"
          onClick={handleClear}
          className="absolute bottom-2 right-2 text-secondary-200"
        >
          Clear
        </Button>
      )}
      <SignatureCanvas
        ref={signaturePad}
        canvasProps={{
          className: "signature-canvas w-full h-[200px] rounded",
          style: {
            background: "#F5F6F7",
            cursor: disabled ? "not-allowed" : "crosshair"
          }
        }}
        onEnd={handleEnd}
        dotSize={2}
        minWidth={2}
        maxWidth={3}
        penColor="black"
      />
    </div>
  );
}