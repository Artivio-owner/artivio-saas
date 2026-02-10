/**
 * ============================================
 * ARTIVIO — CAMERA SCANNER HOOK
 * ============================================
 */

import { useEffect } from 'react';
import jsQR from 'jsqr';

export function useScanner(
  videoRef: React.RefObject<HTMLVideoElement>,
  onScan: (value: string) => void,
) {
  useEffect(() => {
    let stream: MediaStream;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const tick = () => {
      if (!videoRef.current || !ctx) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      const image = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const code = jsQR(image.data, canvas.width, canvas.height);
      if (code?.data) {
        onScan(code.data);
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);
}