import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { pdfjs, Document, Page } from "react-pdf";
import React, { useState, useMemo } from "react";

// @ts-expect-error This does not exist outside of polyfill which this is doing
if ( typeof Promise.withResolvers === "undefined" ) {
  if ( window ) {
  // @ts-expect-error This does not exist outside of polyfill which this is doing
    window.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise(( res, rej ) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}

// or you can use this
pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.8.69/legacy/build/pdf.worker.min.mjs";

const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
  const [ pages, setPages ] = useState<number>( 1 );

  const file = useMemo(() => ({ url: fileUrl }), [fileUrl]);

  return (
    <Document
      file={file}
      onLoadSuccess={({ numPages }: { numPages: number }) => setPages( numPages )}
    >
      {Array.from({ length: pages }, ( _, index ) => (
        <Page key={index} pageNumber={index + 1} />
      ))}
    </Document>
  );
};

export default React.memo( PdfViewer );