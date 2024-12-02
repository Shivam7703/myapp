// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    error?: string;
    screenshot?: string;
  } | null>(null);

  // Client-side fullscreen method
  const enterClientFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      (element as any).mozRequestFullScreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  };

  // Automation run method
  const runAutomation = async () => {
    try {
      const response = await fetch('/api/fullscreen', {
        cache: 'no-store',
        method: 'GET'
      });

      const data = await response.json();

      // Attempt client-side fullscreen as a fallback
      if (response.ok) {
        enterClientFullscreen();
      }

      setResult({
        success: response.ok,
        message: data.message || 'Unknown result',
        error: data.error,
        screenshot: data.screenshot
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to run automation',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };


  useEffect(() => {
    runAutomation(); // Automatically run the automation on component load
  }, []); 

  // Optional: Exit fullscreen
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Fullscreen Automation
        </h1>
        
        <div className="space-y-4">
          <button 
            onClick={runAutomation}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Run Fullscreen Automation
          </button>

          <button 
            onClick={exitFullscreen}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Exit Fullscreen
          </button>
        </div>

        {result && (
          <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className={`${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.message}
            </p>
            {result.error && (
              <p className="text-sm text-red-600 mt-2">Error: {result.error}</p>
            )}
            {result.screenshot && (
              <div className="mt-4">
                <p className="text-sm mb-2">Screenshot:</p>
                <img 
                  src={`data:image/png;base64,${result.screenshot}`} 
                  alt="Automation Screenshot" 
                  className="max-w-full rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
