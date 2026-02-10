/**
 * ============================================
 * ARTIVIO — SCAN PAGE
 * ============================================
 */

import { useRef, useState } from 'react';
import { useScanner } from './useScanner';
import { ScanService } from './scan.service';

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState<any>(null);

  useScanner(videoRef, async (article) => {
    const product = await ScanService.resolve(article);
    setResult(product);
  });

  return (
    <div>
      <h1>Сканирование</h1>
      <video ref={videoRef} style={{ width: '100%' }} />

      {result && (
        <div>
          <h3>{result.name}</h3>
          <p>Артикул: {result.article}</p>
        </div>
      )}
    </div>
  );
}