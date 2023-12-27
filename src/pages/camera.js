import { useState, useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

export default function CameraPage() {
  const [openCamera, setOpenCamera] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [camerId, setCameraId] = useState("");
  const [cameraError, setCameraError] = useState(null);
  const [results, setResults] = useState([]);
  const [torchOn, setTorchOn] = useState(false);
  const scannerRef = useRef(null);

  const handleProcessed = (result) => {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;
    drawingCtx.font = "24px Arial";
    drawingCtx.fillStyle = "green";

    if (result) {
      // console.warn('* quagga onProcessed', result);
      if (result.codeResult && result.codeResult.code) {
        setResults((prev) => [...prev, result.codeResult.code]);
      }
    }
  };

  useEffect(() => {
    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {});
    };
    const disableCamera = async () => {
      await Quagga.CameraAccess.release();
    };

    const enumerateCameras = async () => {
      const devices = await Quagga.CameraAccess.enumerateVideoDevices();
      console.log("Cameras detected: ", devices);
      return devices;
    };

    enableCamera()
      .then(disableCamera)
      .then(enumerateCameras)
      .then((cameras) => {
        setCameras(cameras);
      })
      .then(() => Quagga.CameraAccess.disableTorch())
      .catch((err) => {
        setCameraError(err);
      });

    return () => {
      disableCamera();
    };
  }, []);

  useEffect(() => {
    let ignoreStart = false;
    const init = async () => {
      // wait for one tick to see if we get unmounted before we can possibly even begin cleanup
      await new Promise((resolve) => setTimeout(resolve, 1));
      if (ignoreStart) {
        return;
      }
      if (openCamera) {
        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: scannerRef.current,
              constraints: {
                width: 640,
                height: 480,
                facingMode: "environment",
              },
              willReadFrequently: true,
            },
            locator: {
              patchSize: "medium",
              halfSample: true,
              willReadFrequently: true,
            },
            decoder: {
              readers: ["ean_reader"],
            },
            locate: true,
          },
          (err) => {
            Quagga.onProcessed(handleProcessed);
            if (err) {
              console.log(err);
              return;
            }
            Quagga.start();
          }
        );
      } else {
        Quagga.stop();
      }
    };
    init();
    return () => {
      Quagga.stop();
    };
  }, [openCamera]);

  useEffect(() => {
    console.log("results", results);
  }, [results]);
  return (
    <div>
      <h1>A camera will be here</h1>
      <button onClick={() => setOpenCamera((prev) => !prev)}>Open</button>
      <div ref={scannerRef} className="relative"></div>
      <ul className="bg-red-500">
        {results.map((result, i) => (
          <li key={`${result} - ${i}`}>{result}</li>
        ))}
      </ul>
    </div>
  );
}
