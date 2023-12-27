import { BrowserMultiFormatReader } from "@zxing/library";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCartContext } from "@/useCartContext";
import axios from "axios";
import { useRouter } from "next/router";

let deviceId;

const constraints = {
  audio: false,
  video: { facingMode: "environment" },
};

export default function CustomScanner({ setCameraOpen }) {
  const [cameraLoaded, setCameraLoaded] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const { addToCart } = useCartContext();
  const router = useRouter();

  const multiFormatReader = useMemo(() => {
    const instance = new BrowserMultiFormatReader();
    instance.timeBetweenDecodingAttempts = 300;
    return instance;
  }, []);

  const initCamera = () => {
    console.log("navigator", navigator);
  };

  useEffect(() => {
    initCamera();
  }, []);

  const videoRef = useCallback((node) => {
    if (node !== null) {
      console.log("node running", node.autoplay);
      if (node.autoplay === true) {
        setCameraLoaded(true);
      }
    } else {
      console.log("null");
    }
  }, []);

  const startScanner = useCallback(async () => {
    try {
      if (deviceId) {
        await multiFormatReader.decodeFromVideoDevice(
          deviceId,
          "customScanner",
          (result, error) => {
            if (result) {
              console.log(result);
            }
            if (error) {
              console.log(error);
            }
          }
        );
      } else {
        await multiFormatReader.decodeFromConstraints(
          constraints,
          "customScanner",
          async (result, error) => {
            if (!cameraLoaded) {
              setCameraLoaded(true);
            }
            if (result) {
              console.log(result);
            }
            if (error) {
              console.log(error);
            }
            // if (result) {
            //   setScanned(true);
            //   setLoading(true);
            //   try {
            //     const { data } = await axios.get(
            //       "https://openlibrary.org/search.json",
            //       {
            //         params: {
            //           q: result.getText(),
            //         },
            //       }
            //     );
            //     if (data.docs.length > 0) {
            //       setBook(data.docs[0]);
            //       addToCart({
            //         title: data.docs[0].title,
            //         cover: `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`,
            //         isbn: data.docs[0].isbn[0],
            //         quantity: 1,
            //       });
            //       setLoading(false);
            //       setCameraOpen(false);
            //       router.push("/cart");
            //     } else {
            //       setError(true);
            //       setMessage("No book found");
            //       setLoading(false);
            //     }
            //   } catch (err) {
            //     console.log(err);
            //     setError(true);
            //     setMessage("Something went wrong");
            //     setLoading(false);
            //   }
            // }
          }
        );
      }
    } catch (error) {
      console.log("erroring");
      console.log(error);
    }
  }, [multiFormatReader]);

  const stopScanner = useCallback(async () => {
    multiFormatReader.reset();
    setCameraLoaded(false);
    setScanned(false);
  }, [multiFormatReader]);

  useEffect(() => {
    console.log("scanned", scanned);
  }, [scanned]);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 h-screen w-full bg-blue-500 grid place-content-center">
      <button
        onClick={() => setCameraOpen(false)}
        className="absolute top-4 right-4 text-white z-20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="max-w-3xl relative">
        <div id="cameraContainer" className="relative">
          {cameraLoaded && (
            <div
              id="cameraOverlay"
              className={`w-full h-full overlay z-10 ${
                scanned ? "success" : ""
              }`}
            >
              <div className="w-full h-full">
                <div className="overlay-element top-left" />
                <div className="overlay-element top-right" />
                <div className="overlay-element bottom-left" />
                <div className="overlay-element bottom-right" />
              </div>
            </div>
          )}
          <div className="">
            <video
              className="w-full h-full object-cover aspect-video"
              ref={videoRef}
              id="customScanner"
            ></video>
          </div>
        </div>
        <div className="bg-white w-full z-20 py-10">
          {loading && <p>Loading...</p>}
          {error && <p>{message}</p>}
          {book && (
            <div>
              <p>{book.title}</p>
            </div>
          )}
          {!loading && !error && !book && <p>Scan book barcode to find book</p>}
        </div>
      </div>
    </div>
  );
}
