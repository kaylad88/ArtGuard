interface CameraInterfaceProps {
  onClose: () => void;
}

const CameraInterface: React.FC<CameraInterfaceProps> = ({ onClose }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = React.useState(false);

  React.useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        setHasPermission(false);
      }
    };

    setupCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      // Handle the captured image blob
      // You can upload it or process it here
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="relative h-full">
      {hasPermission ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
              onClick={captureImage}
            >
              <div className="w-12 h-12 bg-neon-blue rounded-full" />
            </motion.button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-white text-center">
            Camera access is required
          </p>
        </div>
      )}

      <button
        className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
        onClick={onClose}
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
