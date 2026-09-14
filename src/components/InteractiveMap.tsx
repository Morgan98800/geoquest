import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  focusTrigger?: number;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onCountryClick,
  targetCountry,
  highlightedCountryId,
  visitedCountryIds = [],
  mode = 'atlas',
  feedbackState,
  focusTrigger = 0,
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

  const centerOnTarget = useCallback(() => {
    if (targetCountry) {
      sound.playSparkle();
      centerOnCoordinates(targetCountry.coordinates, 3.2);
    }
  }, [targetCountry, centerOnCoordinates]);

  // Center when external focus trigger changes
  useEffect(() => {
    if (focusTrigger > 0 && targetCountry) {
      centerOnCoordinates(targetCountry.coordinates, 3.2);
    }
  }, [focusTrigger, targetCountry, centerOnCoordinates]);

  // Auto-center on target in Atlas mode when user selects a country
  useEffect(() => {
    if (mode === 'atlas' && targetCountry) {
      centerOnCoordinates(targetCountry.coordinates, 2.8);
    }
  }, [targetCountry?.id, mode, centerOnCoordinates]);

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
      className={`relative w-full overflow-hidden select-none bg-[#091422] rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl touch-none ${className}`}
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
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex flex-col gap-1 sm:gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border border-slate-750 shadow-lg">
        <button
          onClick={() => {
            sound.playClick();
            handleZoom(1.35);
          }}
          className="p-2 rounded-xl hover:bg-slate-800 active:bg-sky-600/30 text-slate-200 hover:text-white transition-all active:scale-90 touch-manipulation cursor-pointer"
          title="Zoomer (+)"
          aria-label="Zoomer"
        >
          <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => {
            sound.playClick();
            handleZoom(0.75);
          }}
          className="p-2 rounded-xl hover:bg-slate-800 active:bg-sky-600/30 text-slate-200 hover:text-white transition-all active:scale-90 touch-manipulation cursor-pointer"
          title="Dézoomer (-)"
          aria-label="Dézoomer"
        >
          <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-xl hover:bg-slate-800 active:bg-sky-600/30 text-slate-200 hover:text-white transition-all active:scale-90 touch-manipulation cursor-pointer"
          title="Réinitialiser la vue"
          aria-label="Réinitialiser la vue"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        {targetCountry && (
          <button
            onClick={centerOnTarget}
            className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:bg-amber-500/40 text-amber-300 transition-all active:scale-90 border border-amber-500/40 shadow-sm touch-manipulation cursor-pointer"
            title="Indice : Cadrer sur le pays"
            aria-label="Cadrer sur le pays"
          >
            <Compass className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-amber-400" />
          </button>
        )}
      </div>

      {/* Floating Hover Tooltip (desktop/tablet) */}
      {hoveredCountry && (
        <div
          className="pointer-events-none hidden sm:flex absolute z-30 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold shadow-xl text-white transform -translate-x-1/2 -translate-y-full mb-2 whitespace-nowrap transition-transform duration-75 items-center gap-2"
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
        className="w-full h-full block select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#10233b" />
            <stop offset="100%" stopColor="#081422" />
          </radialGradient>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#oceanGlow)" />
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />

        <g
          transform={`translate(${position.x}, ${position.y}) translate(${MAP_WIDTH / 2}, ${MAP_HEIGHT / 2}) scale(${scale}) translate(${-MAP_WIDTH / 2}, ${-MAP_HEIGHT / 2})`}
          style={{
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
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

            // StudyGe natural cartographic palette
            let fillColor = '#1f344e';
            let strokeColor = '#3a5476';
            let strokeWidth = 0.6 / Math.sqrt(scale);

            if (isVisited) {
              fillColor = '#0d8058';
              strokeColor = '#34d399';
            }

            if (isHovered) {
              fillColor = isVisited ? '#059669' : '#0284c7';
              strokeColor = '#e0f2fe';
              strokeWidth = 1.3 / Math.sqrt(scale);
            }

            if (isHighlighted) {
              fillColor = '#d97706';
              strokeColor = '#fef08a';
              strokeWidth = 1.8 / Math.sqrt(scale);
            }

            if (feedbackState && feedbackState.countryId === id) {
              if (feedbackState.isCorrect) {
                fillColor = '#16a34a';
                strokeColor = '#86efac';
                strokeWidth = 2.2 / Math.sqrt(scale);
              } else {
                fillColor = '#dc2626';
                strokeColor = '#fca5a5';
                strokeWidth = 2.2 / Math.sqrt(scale);
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

            // Small countries / islands that need visual pins
            const isSmallCountry = ['275', '158', '422', '196', '626', '242', '470', '702', '44'].includes(id);

            if (isTarget || isHighlighted || (scale > 2.0 && isSmallCountry)) {
              return (
                <g
                  key={`marker-${id}`}
                  transform={`translate(${ptX}, ${ptY})`}
                  onClick={(e) => handleCountryClick(id, e)}
                  className="cursor-pointer"
                >
                  {/* Generous touch hit box for phone fingers (56px effective touch diameter) */}
                  <circle
                    r={28 / Math.sqrt(scale)}
                    fill="transparent"
                  />
                  {/* Glowing pulsing beacon */}
                  <circle
                    r={12 / Math.sqrt(scale)}
                    fill="none"
                    stroke={isTarget ? '#fbbf24' : isVisited ? '#34d399' : '#38bdf8'}
                    strokeWidth={1.5 / Math.sqrt(scale)}
                    className="animate-ping"
                    opacity={0.7}
                  />
                  <circle
                    r={Math.max(5.5 / Math.sqrt(scale), 3.5)}
                    fill={isTarget ? '#f59e0b' : isVisited ? '#10b981' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth={1.5 / Math.sqrt(scale)}
                  />
                  {scale > 2.5 && (
                    <text
                      y={-10 / Math.sqrt(scale)}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={Math.max(8.5 / Math.sqrt(scale), 5.5)}
                      fontWeight="bold"
                      className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] pointer-events-none select-none"
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
