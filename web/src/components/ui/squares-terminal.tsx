'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface SquaresTerminalProps {
  direction?: 'diagonal' | 'up' | 'down' | 'left' | 'right';
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  backgroundColor?: string;
  glowColor?: string;
  flickerRate?: number; // 0 to 1, probability of a square flickering
  flickerColor?: string;
  scanlines?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * SquaresTerminal - React Bits Pro Inspired Component
 * A terminal-style grid of squares that flicker on and off like retro CRT phosphor/digital data matrices.
 */
export function SquaresTerminal({
  direction = 'diagonal',
  speed = 0.5,
  borderColor = 'rgba(217, 249, 157, 0.08)',
  squareSize = 32,
  hoverFillColor = 'rgba(217, 249, 157, 0.25)',
  backgroundColor = 'transparent',
  glowColor = 'rgba(16, 185, 129, 0.3)',
  flickerRate = 0.04,
  flickerColor = 'rgba(52, 211, 153, 0.18)',
  scanlines = true,
  className = '',
  children,
}: SquaresTerminalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<{ x: number; y: number } | null>(null);

  // Keep track of flickering cells
  const flickeringCellsRef = useRef<Map<string, { opacity: number; duration: number; maxOpacity: number }>>(new Map());

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const colIndex = Math.floor(mouseX / squareSize);
    const rowIndex = Math.floor(mouseY / squareSize);

    setHoveredSquare({ x: colIndex, y: rowIndex });
  }, [squareSize]);

  const handleMouseLeave = useCallback(() => {
    setHoveredSquare(null);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    let offsetX = 0;
    let offsetY = 0;
    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // Handle directions
      if (direction === 'right') offsetX += speed;
      else if (direction === 'left') offsetX -= speed;
      else if (direction === 'up') offsetY -= speed;
      else if (direction === 'down') offsetY += speed;
      else if (direction === 'diagonal') {
        offsetX += speed * 0.7;
        offsetY += speed * 0.7;
      }

      if (offsetX > squareSize) offsetX = 0;
      if (offsetX < -squareSize) offsetX = 0;
      if (offsetY > squareSize) offsetY = 0;
      if (offsetY < -squareSize) offsetY = 0;

      const startX = (offsetX % squareSize) - squareSize;
      const startY = (offsetY % squareSize) - squareSize;

      const numCols = Math.ceil(width / squareSize) + 2;
      const numRows = Math.ceil(height / squareSize) + 2;

      // Update active flickering cells
      const activeFlickers = flickeringCellsRef.current;

      // Randomly spawn new flickering cells
      if (Math.random() < flickerRate * 10) {
        const randCol = Math.floor(Math.random() * numCols);
        const randRow = Math.floor(Math.random() * numRows);
        const key = `${randCol},${randRow}`;
        if (!activeFlickers.has(key)) {
          activeFlickers.set(key, {
            opacity: 0.1,
            duration: 0.3 + Math.random() * 0.7,
            maxOpacity: 0.15 + Math.random() * 0.35,
          });
        }
      }

      // Decrement flicker durations
      for (const [key, flicker] of activeFlickers.entries()) {
        flicker.duration -= delta * 1.8;
        if (flicker.duration <= 0) {
          activeFlickers.delete(key);
        }
      }

      // Render grid squares
      for (let x = startX, col = 0; x < width + squareSize; x += squareSize, col++) {
        for (let y = startY, row = 0; y < height + squareSize; y += squareSize, row++) {
          const colIndex = Math.floor((x - startX) / squareSize);
          const rowIndex = Math.floor((y - startY) / squareSize);
          const key = `${colIndex},${rowIndex}`;

          // Check if hovering
          const isHovered = hoveredSquare && hoveredSquare.x === colIndex && hoveredSquare.y === rowIndex;

          // Check if flickering
          const flicker = activeFlickers.get(key);

          if (isHovered) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(x, y, squareSize, squareSize);
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 12;
          } else if (flicker) {
            const flickerAlpha = Math.sin((flicker.duration / 0.8) * Math.PI) * flicker.maxOpacity;
            ctx.fillStyle = flickerColor.replace(/[\d\.]+\)$/, `${Math.max(0.05, flickerAlpha)})`);
            ctx.fillRect(x, y, squareSize, squareSize);
          }

          // Stroke square borders
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, squareSize, squareSize);
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    direction,
    speed,
    borderColor,
    squareSize,
    hoverFillColor,
    backgroundColor,
    glowColor,
    flickerRate,
    flickerColor,
    hoveredSquare,
  ]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {scanlines && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))',
            backgroundSize: '100% 3px, 6px 100%',
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

export default SquaresTerminal;
