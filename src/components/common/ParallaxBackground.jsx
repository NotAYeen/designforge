import React, { useState, useEffect } from 'react';

export default function ParallaxBackground({ image, opacity = 0.15, blendMode = 'lighten', position = 'center' }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div 
        className="animate-helicopter"
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      >
        <div 
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: position,
            mixBlendMode: blendMode, opacity: opacity, filter: 'blur(1px)',
            transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)`,
            transition: 'transform 0.1s ease-out'
          }} 
        />
      </div>
    </div>
  );
}
