import React, { memo, useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = memo(({ adKey, width, height, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // We use srcDoc to isolate the ad script execution (document.write) from the main React app.
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
    </body>
    </html>
  `;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        // Check parent width to determine if scaling is needed
        const parent = containerRef.current.parentElement;
        if (parent) {
           // Use parent width but ensure we don't scale up past 1
           const availableWidth = parent.clientWidth - 16; // 16px padding safety
           const newScale = Math.min(1, availableWidth / width);
           setScale(newScale > 0 ? newScale : 1);
        }
      }
    };

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current?.parentElement) {
        observer.observe(containerRef.current.parentElement);
    }
    
    // Initial calculation
    updateScale();
    window.addEventListener('resize', updateScale);

    return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateScale);
    };
  }, [width]);

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col items-center justify-center ${className}`}
    >
      {/* Label outside the scaled area */}
      <span className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest font-medium">
        Advertisement
      </span>

      {/* Ad Container */}
      <div 
        className="bg-gray-100 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden transition-all duration-300 shadow-sm"
        style={{ 
          width: width * scale, 
          height: height * scale,
          position: 'relative'
        }}
      >
        <div style={{
          width: width,
          height: height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}>
           <iframe
              title={`ad-${adKey}`}
              srcDoc={srcDoc}
              width={width}
              height={height}
              style={{ border: 'none', overflow: 'hidden', display: 'block' }}
              scrolling="no"
              loading="lazy"
          />
        </div>
      </div>
    </div>
  );
});

export default AdUnit;