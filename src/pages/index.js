import BarcodeScanner from "@/components/BarcodeScanner";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [result, setResult] = useState("");
  const [permission, setPermission] = useState("");

  async function getPermissions() {
    const permissionStatus = await navigator.permissions.query({
      name: "camera",
    });
    setPermission(permissionStatus.state);
    permissionStatus.onchange = () => {
      console.log("Permission changed to ", permissionStatus.state);
      setPermission(permissionStatus.state);
    };
  }

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    console.log(permission);
  }, [permission]);

  return (
    <main className={`${inter.className} max-w-3xl mx-auto text-center`}>
      <h1 className="text-4xl font-bold my-10">A barcode scanner</h1>
      <h2 className="mb-4 font-bold text-2xl">Find book via barcode</h2>
      <button
        className="bg-emerald-300 p-4 rounded-lg"
        onClick={() => setCameraOpen((prev) => !prev)}
      >
        {cameraOpen ? "Close" : "Open"} camera
      </button>

      {cameraOpen && (
        <BarcodeScanner
          permission={permission}
          result={result}
          setResult={setResult}
          setCameraOpen={setCameraOpen}
        />
      )}
      <p>{result}</p>
    </main>
  );
}
