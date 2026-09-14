import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Country } from '../types';
import { COUNTRIES_BY_ID } from '../data/countries';
import { worldFeatures, countryPaths, projection, MAP_WIDTH, MAP_HEIGHT } from '../data/worldGeo';
import { sound } from '../utils/audio';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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

// Clamping boundary to stop infinite void panning
const clampPosition = (x: number, y: number, currentScale: number) => {
  if (currentScale <= 1.01) {
    return { x: 0, y: 0 };
  }
  const maxOffsetX = ((currentScale - 1) * MAP_WIDTH) / 2;
  const maxOffsetY = ((currentScale - 1) * MAP_HEIGHT) / 2;
  return {
    x: Math.max(-maxOffsetX, Math.min(maxOffsetX, x)),
    y: Math.max(-maxOffsetY, Math.min(maxOffsetY, y)),
  };
};

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

  const touchState = useRef<{
    initialDist?: number;
    initialScale?: number;
    lastX?: number;
    lastY?: number;
  }>({});
  const isTouchDevice = useRef<boolean>(false);
  const dragStartCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartTime = useRef<number>(0);
  const isPanning = useRef<boolean>(false);
  const lastClickTime = useRef<number>(0);
  const lastClickId = useRef<string>('');

  const visitedSet = new Set(visitedCountryIds);

  // Zoom handlers with bounded scale & repositioning
  const handleZoom = (factor: number) => {
    setScale((prevScale) => {
      const nextScale = Math.min(Math.max(prevScale * factor, 1), 8);
      if (nextScale <= 1.01) {
        setPosition({ x: 0, y: 0 });
      } else {
        setPosition((prevPos) => {
          const ratio = nextScale / prevScale;
          return clampPosition(prevPos.x * ratio, prevPos.y * ratio, nextScale);
        });
      }
      return nextScale;
    });
  };

  const handleReset = () => {
    sound.playClick();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Center on a specific coordinate bounded to map canvas
  const centerOnCoordinates = useCallback((coords: [number, number], targetZoom = 3.2) => {
    const pt = projection(coords);
    if (!pt) return;
    const [targetX, targetY] = pt;

    const zoom = Math.min(Math.max(targetZoom, 1), 8);
    const rawX = (MAP_WIDTH / 2 - targetX) * zoom;
    const rawY = (MAP_HEIGHT / 2 - targetY) * zoom;
    const clamped = clampPosition(rawX, rawY, zoom);

    setScale(zoom);
    setPosition(clamped);
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

  // Mouse Dragging bounded by map limits
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    dragStartCoords.current = { x: e.clientX, y: e.clientY };
    isPanning.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dist = Math.hypot(e.clientX - dragStartCoords.current.x, e.clientY - dragStartCoords.current.y);
      if (dist > 8) {
        isPanning.current = true;
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPosition(clampPosition(newX, newY, scale));
      }
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
    if (isPanning.current) {
      setTimeout(() => {
        isPanning.current = false;
      }, 120);
    }
  };

  // Mobile Touch Gestures (Pan & Pinch-to-Zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchDevice.current = true;
    setHoveredCountry(null);
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartCoords.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchStartTime.current = Date.now();
      isPanning.current = false;
      touchState.current.lastX = e.touches[0].clientX - position.x;
      touchState.current.lastY = e.touches[0].clientY - position.y;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      isPanning.current = true;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      touchState.current.initialDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchState.current.initialScale = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    isTouchDevice.current = true;
    setHoveredCountry(null);
    if (e.touches.length === 1 && isDragging) {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dist = Math.hypot(x - dragStartCoords.current.x, y - dragStartCoords.current.y);
      // Natural finger jitter threshold (16px) before initiating map pan
      if (dist > 16) {
        isPanning.current = true;
        if (touchState.current.lastX !== undefined && touchState.current.lastY !== undefined) {
          const rawX = x - touchState.current.lastX;
          const rawY = y - touchState.current.lastY;
          setPosition(clampPosition(rawX, rawY, scale));
        }
      }
    } else if (e.touches.length === 2 && touchState.current.initialDist && touchState.current.initialScale) {
      isPanning.current = true;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const factor = dist / touchState.current.initialDist;
      const newScale = Math.min(Math.max(touchState.current.initialScale * factor, 1), 8);
      setScale(newScale);
      setPosition((prev) => clampPosition(prev.x, prev.y, newScale));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setHoveredCountry(null);
    touchState.current.initialDist = undefined;
    touchState.current.initialScale = undefined;
    if (isPanning.current) {
      setTimeout(() => {
        isPanning.current = false;
      }, 120);
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    handleZoom(factor);
  };

  // Country click (0ms response on mobile touch & protected against drags)
  const handleCountryClick = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (isPanning.current) {
      return;
    }
    const now = Date.now();
    if (lastClickId.current === id && now - lastClickTime.current < 450) {
      return;
    }
    lastClickId.current = id;
    lastClickTime.current = now;

    const country = COUNTRIES_BY_ID[id];
    if (country && onCountryClick) {
      sound.playClick();
      onCountryClick(country);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none bg-[#080d16] rounded-2xl sm:rounded-3xl border border-[#1f2c42] shadow-2xl touch-none ${className}`}
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
      {/* Floating Hover Tooltip (desktop only, atlas mode only) */}
      {hoveredCountry && mode === 'atlas' && !isTouchDevice.current && (
        <div
          className="pointer-events-none hidden sm:flex absolute z-30 px-3 py-1.5 rounded-xl bg-[#0f172a] border border-[#2e4056] text-xs font-bold shadow-2xl text-white transform -translate-x-1/2 -translate-y-full mb-2 whitespace-nowrap transition-transform duration-75 items-center gap-2"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y - 12}px`,
          }}
        >
          <span className="text-base leading-none">{hoveredCountry.flag}</span>
          <span>{hoveredCountry.name}</span>
          {visitedSet.has(hoveredCountry.id) && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              Découvert ⭐
            </span>
          )}
        </div>
      )}

      {/* Sleek Floating Map Controls (Zoom & Recenter) */}
      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 p-1 rounded-2xl bg-[#0c1322]/90 border border-[#1f2c42] shadow-xl backdrop-blur-md">
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            handleZoom(1.3);
          }}
          className="w-8 h-8 rounded-xl bg-[#162236] hover:bg-[#1f2f49] text-sky-300 hover:text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer"
          title="Zoom avant"
          aria-label="Zoom avant"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            handleZoom(0.77);
          }}
          className="w-8 h-8 rounded-xl bg-[#162236] hover:bg-[#1f2f49] text-sky-300 hover:text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer"
          title="Zoom arrière"
          aria-label="Zoom arrière"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {(scale > 1.05 || Math.abs(position.x) > 5 || Math.abs(position.y) > 5) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="h-8 px-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 flex items-center gap-1.5 text-xs font-bold transition-all active:scale-90 cursor-pointer animate-pop"
            title="Recentrer la carte"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Recentrer</span>
          </button>
        )}
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full h-full block select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.025)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#080d16" />
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

            // Crisp frontier styling & obsidian landmass
            let fillColor = '#1a2638';
            let strokeColor = '#4f6685';
            let strokeWidth = 1.1 / Math.sqrt(scale);
            let feedbackClass = '';

            if (mode === 'atlas') {
              const timesDiscovered = countryMastery[id] || (visitedSet.has(id) ? 1 : 0);
              if (timesDiscovered >= 5) {
                // Mastered (⭐⭐⭐) - Vibrant emerald with gold border
                fillColor = '#10b981';
                strokeColor = '#fbbf24';
                strokeWidth = 1.3 / Math.sqrt(scale);
              } else if (timesDiscovered >= 3) {
                // Advanced (⭐⭐) - Solid emerald
                fillColor = '#059669';
                strokeColor = '#34d399';
                strokeWidth = 1.1 / Math.sqrt(scale);
              } else if (timesDiscovered >= 1) {
                // Discovered (⭐) - Lagoon teal
                fillColor = '#0d9488';
                strokeColor = '#5eead4';
                strokeWidth = 1.0 / Math.sqrt(scale);
              }
            }

            if (isHovered && !isTouchDevice.current) {
              if (mode === 'atlas') {
                fillColor = '#0284c7';
                strokeColor = '#ffffff';
                strokeWidth = 1.6 / Math.sqrt(scale);
              } else {
                // In quiz mode: crisp border highlight only, do not color country!
                fillColor = '#223249';
                strokeColor = '#93c5fd';
                strokeWidth = 1.6 / Math.sqrt(scale);
              }
            }

            if (isHighlighted) {
              fillColor = '#eab308';
              strokeColor = '#fef08a';
              strokeWidth = 2.2 / Math.sqrt(scale);
            }

            if (feedbackState && feedbackState.countryId === id) {
              if (feedbackState.isCorrect) {
                fillColor = '#10b981';
                strokeColor = '#6ee7b7';
                strokeWidth = 2.6 / Math.sqrt(scale);
                feedbackClass = 'animate-success-glow';
              } else {
                fillColor = '#f43f5e';
                strokeColor = '#fca5a5';
                strokeWidth = 2.6 / Math.sqrt(scale);
                feedbackClass = 'animate-error-glow';
              }
            }

            return (
              <path
                key={id}
                d={pathD}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pointerEvents: 'all' }}
                className={`transition-colors duration-150 outline-none cursor-pointer select-none ${feedbackClass}`}
                onMouseEnter={() => {
                  if (!isTouchDevice.current && country) {
                    setHoveredCountry(country);
                  }
                }}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={(e) => handleCountryClick(id, e)}
                onTouchEnd={(e) => {
                  if (!isPanning.current) {
                    handleCountryClick(id, e);
                  }
                }}
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
              '044', // Bahamas
              '064', // Bhutan
              '417', // Kyrgyzstan
            ].includes(id);

            // 1. Explicit Hint: Only when user tapped Hint button does the country beacon illuminate!
            if (isHighlighted) {
              return (
                <g
                  key={`hint-${id}`}
                  transform={`translate(${ptX}, ${ptY})`}
                  style={{ pointerEvents: 'all' }}
                  onClick={(e) => handleCountryClick(id, e)}
                  onTouchEnd={(e) => {
                    if (!isPanning.current) {
                      handleCountryClick(id, e);
                    }
                  }}
                  className="cursor-pointer select-none"
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
            // Allows effortless finger tapping without cluttering the screen or swallowing neighboring countries
            if (isSmallCountry) {
              return (
                <circle
                  key={`touch-${id}`}
                  cx={ptX}
                  cy={ptY}
                  r={Math.max(18 / Math.sqrt(scale), 10)}
                  fill="rgba(0,0,0,0.001)"
                  style={{ pointerEvents: 'all' }}
                  className="cursor-pointer select-none"
                  onClick={(e) => handleCountryClick(id, e)}
                  onTouchEnd={(e) => {
                    if (!isPanning.current) {
                      handleCountryClick(id, e);
                    }
                  }}
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
