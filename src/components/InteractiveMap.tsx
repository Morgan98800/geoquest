import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Country } from '../types';
import { COUNTRIES_BY_ID } from '../data/countries';
import { worldFeatures, countryPaths, projection, MAP_WIDTH, MAP_HEIGHT } from '../data/worldGeo';
import { sound } from '../utils/audio';

interface InteractiveMapProps {
  onCountryClick?: (country: Country) => void;
  targetCountry?: Country | null;
  highlightedCountryId?: string | null;
  visitedCountryIds?: string[];
  countryMastery?: Record<string, number>;
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
  countryMastery = {},
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
      centerOnTarget();
    }
  }, [focusTrigger, targetCountry, centerOnTarget]);

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
      className={`relative w-full overflow-hidden select-none bg-[#16202c] rounded-2xl sm:rounded-3xl border border-slate-800/80 shadow-md touch-none ${className}`}
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
      onDoubleClick={handleReset}
    >
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
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#16202c" />
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
            const isHovered = hoveredCountry?.id === id;

            // StudyGe flat tactical palette with 3-tier country mastery
            const timesDiscovered = countryMastery[id] || (visitedSet.has(id) ? 1 : 0);
            let fillColor = '#273749';
            let strokeColor = '#3d5269';
            let strokeWidth = 0.7 / Math.sqrt(scale);

            if (timesDiscovered >= 5) {
              // Mastered (⭐⭐⭐) - Vibrant emerald with gold border
              fillColor = '#10b981';
              strokeColor = '#fbbf24';
              strokeWidth = 1.1 / Math.sqrt(scale);
            } else if (timesDiscovered >= 3) {
              // Advanced (⭐⭐) - Solid emerald
              fillColor = '#059669';
              strokeColor = '#34d399';
              strokeWidth = 0.9 / Math.sqrt(scale);
            } else if (timesDiscovered >= 1) {
              // Discovered (⭐) - Lagoon teal
              fillColor = '#0d9488';
              strokeColor = '#5eead4';
              strokeWidth = 0.8 / Math.sqrt(scale);
            }

            if (isHovered) {
              fillColor = timesDiscovered > 0 ? '#047857' : '#0284c7';
              strokeColor = '#ffffff';
              strokeWidth = 1.3 / Math.sqrt(scale);
            }

            if (isHighlighted) {
              fillColor = '#eab308';
              strokeColor = '#ffffff';
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

          {/* Touch targets for small countries & hint markers (No random spoiler pins during quiz) */}
          {worldFeatures.map((feature) => {
            const id = feature.id;
            const country = COUNTRIES_BY_ID[id];
            if (!country) return null;

            const [ptX, ptY] = projection(country.coordinates) || [0, 0];
            if (!ptX || !ptY) return null;

            const isHighlighted = highlightedCountryId === id;
            // Small territories and islands that benefit from enlarged touch hitboxes
            const isSmallCountry = [
              '275', // Palestine
              '158', // Taiwan
              '422', // Lebanon
              '196', // Cyprus
              '626', // Timor-Leste
              '242', // Fiji
              '470', // Malta
              '702', // Singapore
              '096', // Brunei
              '44',  // Bahamas
              '064', // Bhutan
              '417', // Kyrgyzstan
            ].includes(id);

            // 1. Explicit Hint: Only when user tapped Hint button does the country beacon illuminate!
            if (isHighlighted) {
              return (
                <g
                  key={`hint-${id}`}
                  transform={`translate(${ptX}, ${ptY})`}
                  onClick={(e) => handleCountryClick(id, e)}
                  className="cursor-pointer"
                >
                  <circle
                    r={20 / Math.sqrt(scale)}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth={2 / Math.sqrt(scale)}
                    className="animate-ping"
                    opacity={0.8}
                  />
                  <circle
                    r={Math.max(6 / Math.sqrt(scale), 4)}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth={1.5 / Math.sqrt(scale)}
                  />
                  <text
                    y={-12 / Math.sqrt(scale)}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={Math.max(10 / Math.sqrt(scale), 6)}
                    fontWeight="bold"
                    className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] pointer-events-none select-none"
                  >
                    {country.flag} {country.name}
                  </text>
                </g>
              );
            }

            // 2. Invisible touch hit targets for small countries on mobile:
            // Allows effortless finger tapping without cluttering the screen or showing random spoiler pins!
            if (isSmallCountry) {
              return (
                <circle
                  key={`touch-${id}`}
                  cx={ptX}
                  cy={ptY}
                  r={Math.max(24 / Math.sqrt(scale), 14)}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={(e) => handleCountryClick(id, e)}
                />
              );
            }

            return null;
          })}
        </g>
      </svg>
    </div>
  );
};
