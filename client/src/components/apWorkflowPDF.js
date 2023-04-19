import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { DispatchUserContexts, ShowUserContexts } from "../App";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
function WorkflowPDF({ invoice }) {
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  });
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    invoice && (
      <div>
        <Document file={invoice.url} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} renderTextLayer={false} />
        </Document>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    )
  );
}

export default WorkflowPDF;
