import { useState } from "react";
import { useZxing } from "react-zxing";
import PermissionDenied from "./PermissionDenied";
import Scanner from "./Scanner";
import CustomScanner from "./CustomScanner";

export default function BarcodeScanner({
  result,
  setResult,
  permission,
  setCameraOpen,
}) {
  return (
    <>
      {permission === "denied" ? (
        <PermissionDenied />
      ) : (
        // <Scanner permission={permission} setResult={setResult} />
        <CustomScanner setCameraOpen={setCameraOpen} />
      )}
    </>
  );
}
