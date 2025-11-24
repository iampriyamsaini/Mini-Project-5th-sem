import React, { useRef, useEffect, useState } from 'react';
import { Camera, StopCircle } from 'lucide-react';
import { aiService } from '../services/aiService';

interface CameraCaptureProps { 
  onEmotionDetected: (result: any) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onEmotionDetected, 
  isScanning, 
  setIsScanning 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureEmotion = async () => {
    if (!videoRef.current || !stream) {
      setError('Camera not started');
      return;
    }

    setIsScanning(true);
    setError('');

    try {
      // Initialize AI model if not already
      await aiService.initialize();

      // Detect emotion from video
      const result = await aiService.detectEmotionFromVideo(videoRef.current);
      
      onEmotionDetected(result);
      setIsScanning(false);
    } catch (err: any) {
      setError(err.message || 'Failed to detect emotion');
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-80 bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {!stream && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4" />
              <p>Camera not started</p>
            </div>
          </div>
        )}

        {isScanning && (
          <div className="absolute inset-0 bg-indigo-500 bg-opacity-30 flex items-center justify-center">
            <div className="text-white text-xl font-semibold">
              Analyzing facial expression...
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {!stream ? (
          <button
            onClick={startCamera}
            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={captureEmotion}
              disabled={isScanning}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              {isScanning ? 'Analyzing...' : 'Detect Emotion'}
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <StopCircle className="w-5 h-5" />
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
};


export default CameraCapture;

