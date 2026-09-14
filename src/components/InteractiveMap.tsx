import React, { useState, useRef, useCallback } from 'react';
import { Country } from '../types';
import { COUNTRIES_BY_ID } from '../data/countries';
import { worldFeatures, countryPaths, projection, MAP_WIDTH, MAP_HEIGHT } from '../data/worldGeo';
import { ZoomIn, ZoomOut, RotateCcw, Compass } from 'lucide-react';
import { sound } from '../utils/audio';

interface InteractiveMapProps {
  onCountryClick?: (country: Country) => void;
  targetCountry?: Country | null;
  highlightedCountryId?: string | null;
  visitedCountryIds?: string[];
  mode?: 'quiz' | 'atlas';
  feedbackState?: {
    countryId: string;
    isCorrect: boolean;
  } | null;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onCountryClick,
  targetCountry,
  highlightedCountryId,
  visitedCountryIds = [],
  mode = 'atlas',
  feedbackState,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch gesture state for mobile pinch & pan
  const touchState = useRef<{
    initialDist?: number;
    initialScale?: number;
    lastX?: number;
    lastY?: number;
  }>({});

  const visitedSet = new Set(visitedCountryIds);

  // Zoom handlers
  const handleZoom = (factor: number) => {
    setScale((prevScale) => {
      const nextScale = Math.min(Math.max(prevScale * factor, 0.9), 10);
      return nextScale;
    });
  };

  const handleReset = () => {
    sound.playClick();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Center on a specific coordinate
  const centerOnCoordinates = useCallback((coords: [number, number], targetZoom = 3.5) => {
    const pt = projection(coords);
    if (!pt) return;
    const [targetX, targetY] = pt;

    const newX = (MAP_WIDTH / 2 - targetX) * targetZoom;
    const newY = (MAP_HEIGHT / 2 - targetY) * targetZoom;

    setScale(targetZoom);
    setPosition({ x: newX, y: newY });
  }, []);

  const centerOnTarget = () => {
    if (targetCountry) {
      sound.playSparkle();
      centerOnCoordinates(targetCountry.coordinates, 3.2);
    }
  };

  // Mouse Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mobile Touch Gestures (Pan & Pinch-to-Zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchState.current.lastX = e.touches[0].clientX - position.x;
      touchState.current.lastY = e.touches[0].clientY - position.y;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      touchState.current.initialDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchState.current.initialScale = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      if (touchState.current.lastX !== undefined && touchState.current.lastY !== undefined) {
        setPosition({
          x: x - touchState.current.lastX,
          y: y - touchState.current.lastY,
        });
      }
    } else if (e.touches.length === 2 && touchState.current.initialDist && touchState.current.initialScale) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const factor = dist / touchState.current.initialDist;
      const newScale = Math.min(Math.max(touchState.current.initialScale * factor, 0.9), 10);
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchState.current.initialDist = undefined;
    touchState.current.initialScale = undefined;
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    handleZoom(factor);
  };

  // Country click
  const handleCountryClick = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const country = COUNTRIES_BY_ID[id];
    if (country && onCountryClick) {
      sound.playClick();
      onCountryClick(country);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 rounded-3xl border border-sky-800/40 shadow-2xl touch-none ${className}`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDragging(false);
        setHoveredCountry(null);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Map Floating Controls - thumb-friendly */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 sm:gap-2 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg">
        <button
          onClick={() => {
            sound.playClick();
            handleZoom(1.35);
          }}
          className="p-2 sm:p-2.5 rounded-xl hover:bg-white/10 active:bg-sky-500/20 text-sky-200 hover:text-white transition-all active:scale-90"
          title="Zoomer (+)"
          aria-label="Zoomer"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            sound.playClick();
            handleZoom(0.75);
          }}
          className="p-2 sm:p-2.5 rounded-xl hover:bg-white/10 active:bg-sky-500/20 text-sky-200 hover:text-white transition-all active:scale-90"
          title="Dézoomer (-)"
          aria-label="Dézoomer"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 sm:p-2.5 rounded-xl hover:bg-white/10 active:bg-sky-500/20 text-sky-200 hover:text-white transition-all active:scale-90"
          title="Réinitialiser la vue"
          aria-label="Réinitialiser la vue"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        {targetCountry && (
          <button
            onClick={centerOnTarget}
            className="p-2 sm:p-2.5 rounded-xl bg-amber-500/25 hover:bg-amber-500/35 active:bg-amber-500/40 text-amber-300 transition-all active:scale-90 border border-amber-500/40 shadow-md shadow-amber-500/20"
            title="Indice : Cadrer sur la région du pays"
            aria-label="Cadrer sur la région"
          >
            <Compass className="w-5 h-5 animate-pulse" />
          </button>
        )}
      </div>

      {/* Floating Hover Tooltip (desktop/tablet) */}
      {hoveredCountry && (
        <div
          className="pointer-events-none hidden sm:flex absolute z-30 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-sky-400/30 text-xs font-semibold shadow-xl text-white transform -translate-x-1/2 -translate-y-full mb-2 whitespace-nowrap transition-transform duration-75 items-center gap-2"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y - 12}px`,
          }}
        >
          <span className="text-base leading-none">{hoveredCountry.flag}</span>
          <span>{mode === 'quiz' ? 'Pays du Monde' : hoveredCountry.name}</span>
          {visitedSet.has(hoveredCountry.id) && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              Découvert ⭐
            </span>
          )}
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full h-full block"
        style={{ minHeight: '340px', maxHeight: '680px' }}
      >
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.05" />
          </radialGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#oceanGlow)" />
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />

        <g
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
          }}
        >
          {worldFeatures.map((feature) => {
            const id = feature.id;
            const pathD = countryPaths[id];
            if (!pathD) return null;

            const country = COUNTRIES_BY_ID[id];
            const isHighlighted = highlightedCountryId === id;
            const isVisited = visitedSet.has(id);
            const isHovered = hoveredCountry?.id === id;

            let fillColor = '#1e293b';
            let strokeColor = '#334155';
            let strokeWidth = 0.5 / Math.sqrt(scale);

            if (isVisited) {
              fillColor = '#065f46';
              strokeColor = '#10b981';
            }

            if (isHovered) {
              fillColor = isVisited ? '#047857' : '#38bdf8';
              strokeColor = '#f8fafc';
              strokeWidth = 1.2 / Math.sqrt(scale);
            }

            if (isHighlighted) {
              fillColor = '#f59e0b';
              strokeColor = '#ffffff';
              strokeWidth = 1.5 / Math.sqrt(scale);
            }

            if (feedbackState && feedbackState.countryId === id) {
              if (feedbackState.isCorrect) {
                fillColor = '#22c55e';
                strokeColor = '#ffffff';
                strokeWidth = 2 / Math.sqrt(scale);
              } else {
                fillColor = '#ef4444';
                strokeColor = '#fca5a5';
                strokeWidth = 2 / Math.sqrt(scale);
              }
            }

            return (
              <path
                key={id}
                d={pathD}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="transition-colors duration-150 outline-none cursor-pointer"
                onMouseEnter={() => country && setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={(e) => handleCountryClick(id, e)}
              />
            );
          })}

          {/* Interactive touch targets / markers for small countries & territories like Palestine and Taiwan */}
          {worldFeatures.map((feature) => {
            const id = feature.id;
            const country = COUNTRIES_BY_ID[id];
            if (!country) return null;

            const [ptX, ptY] = projection(country.coordinates) || [0, 0];
            if (!ptX || !ptY) return null;

            const isTarget = targetCountry && targetCountry.id === id;
            const isHighlighted = highlightedCountryId === id;
            const isVisited = visitedSet.has(id);

            const isSmallCountry = ['275', '158', '422', '196', '626', '242'].includes(id);

            if (isTarget || isHighlighted || (scale > 2.0 && isSmallCountry)) {
              return (
                <g
                  key={`marker-${id}`}
                  transform={`translate(${ptX}, ${ptY})`}
                  onClick={(e) => handleCountryClick(id, e)}
                  className="cursor-pointer"
                >
                  {/* Invisible generous touch hit box for phone fingers */}
                  <circle
                    r={22 / Math.sqrt(scale)}
                    fill="transparent"
                  />
                  {/* Visible pulsing indicator */}
                  <circle
                    r={Math.max(6 / Math.sqrt(scale), 4)}
                    fill={isTarget ? '#f59e0b' : isVisited ? '#10b981' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth={1.5 / Math.sqrt(scale)}
                    className="animate-pulse"
                  />
                  {scale > 2.6 && (
                    <text
                      y={-10 / Math.sqrt(scale)}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={Math.max(8 / Math.sqrt(scale), 5)}
                      fontWeight="bold"
                      className="drop-shadow-md pointer-events-none select-none"
                    >
                      {country.flag} {country.name}
                    </text>
                  )}
                </g>
              );
            }
            return null;
          })}
        </g>
      </svg>
    </div>
  );
};
