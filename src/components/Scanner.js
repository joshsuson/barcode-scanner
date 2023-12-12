import { useZxing } from "react-zxing";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function Scanner({ permission, setResult }) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
    },
    onError(e) {
      console.log(e);
    },
  });

  const onScanSuccess = (qrCodeMessage) => {
    console.log(qrCodeMessage);
    setResult(qrCodeMessage);
  };
  const onScanFailure = (error) => {
    console.log(error);
  };

  useEffect(() => {
    // let html5QrCode;
    // Html5Qrcode.getCameras().then((devices) => {
    //   if (devices && devices.length) {
    //     const cameraId = devices[0].id;
    //     html5QrCode = new Html5Qrcode("reader");
    //     html5QrCode
    //       .start(
    //         cameraId,
    //         {
    //           fps: 10,
    //           qrbox: 250,
    //         },
    //         onScanSuccess,
    //         onScanFailure
    //       )
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
    // });
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
      },
      true
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    // return () => {
    //   // if (!html5QrCode) return;
    //   // html5QrCode.stop().then((ignore) => {
    //   //   // QR Code scanning is stopped.
    //   //   console.log("stopped");
    //   //   html5QrCode = null;
    //   // });
    // };
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  const seeRef = () => {
    console.log(ref.current);
    console.log(ref.current.autoplay);
  };

  return (
    // <div className="relative max-w-fit">
    //   <button onClick={seeRef}>See ref</button>
    //   {permission === "prompt" && (
    //     <div>
    //       <h1>You need to give us access to your camera</h1>
    //       <video autoPlay={false} ref={ref} />
    //     </div>
    //   )}
    //   {permission === "granted" && (
    //     <div className="overlay w-full h-full">
    //       <div className="relative w-full h-full">
    //         <div className="overlay-element top-left" />
    //         <div className="overlay-element top-right" />
    //         <div className="overlay-element bottom-left" />
    //         <div className="overlay-element bottom-right" />
    //       </div>
    //     </div>
    //   )}
    //   <video autoPlay={false} ref={ref} />
    // </div>
    <div>
      <h2>More scanning</h2>
      <div id="reader"></div>
    </div>
  );
}
