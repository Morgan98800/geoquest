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

// Clamping boundary to stop infinite void panning while allowing generous freedom to wander
const clampPosition = (x: number, y: number, currentScale: number) => {
  const effectiveScale = Math.max(currentScale, 1);
  // Base margin allows wandering freely across the world map even at zoom 1
  const baseMarginX = 450;
  const baseMarginY = 280;
  const maxOffsetX = baseMarginX + ((effectiveScale - 1) * MAP_WIDTH) / 1.6;
  const maxOffsetY = baseMarginY + ((effectiveScale - 1) * MAP_HEIGHT) / 1.6;
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
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync refs to avoid stale closures in high-frequency gesture loops
  const scaleRef = useRef<number>(1);
  const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const isTouchDevice = useRef<boolean>(false);
  const dragStartCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTouchCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPinchDist = useRef<number>(0);
  const lastMidpoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPanning = useRef<boolean>(false);
  const hasMovedSignificant = useRef<boolean>(false);
  const lastClickTime = useRef<number>(0);
  const lastClickId = useRef<string>('');

  const visitedSet = new Set(visitedCountryIds);

  // Convert screen coordinates & deltas to SVG coordinate space
  const getScreenToSvg = useCallback(() => {
    if (!containerRef.current) return { ratio: 1, offsetX: 0, offsetY: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return { ratio: 1, offsetX: 0, offsetY: 0 };
    }
    // SVG viewBox is MAP_WIDTH x MAP_HEIGHT with preserveAspectRatio="xMidYMid meet"
    const scaleX = rect.width / MAP_WIDTH;
    const scaleY = rect.height / MAP_HEIGHT;
    const meetScale = Math.min(scaleX, scaleY);
    const svgRenderWidth = MAP_WIDTH * meetScale;
    const svgRenderHeight = MAP_HEIGHT * meetScale;
    const offsetX = rect.left + (rect.width - svgRenderWidth) / 2;
    const offsetY = rect.top + (rect.height - svgRenderHeight) / 2;
    const ratio = meetScale > 0 ? 1 / meetScale : 1;
    return { ratio, offsetX, offsetY };
  }, []);

  // Zoom handlers with bounded scale & repositioning
  const handleZoom = (factor: number) => {
    setScale((prevScale) => {
      const nextScale = Math.min(Math.max(prevScale * factor, 1), 8);
      scaleRef.current = nextScale;
      setPosition((prevPos) => {
        const ratio = nextScale / prevScale;
        const clamped = clampPosition(prevPos.x * ratio, prevPos.y * ratio, nextScale);
        positionRef.current = clamped;
        return clamped;
      });
      return nextScale;
    });
  };

  const handleReset = () => {
    sound.playClick();
    scaleRef.current = 1;
    positionRef.current = { x: 0, y: 0 };
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

    scaleRef.current = zoom;
    positionRef.current = clamped;
    setScale(zoom);
    setPosition(clamped);
  }, []);

  const lastFocusTrigger = useRef<number>(focusTrigger);

  // Center ONLY when focusTrigger is explicitly incremented by user (e.g. Hint button)
  useEffect(() => {
    if (focusTrigger > 0 && focusTrigger !== lastFocusTrigger.current) {
      lastFocusTrigger.current = focusTrigger;
      if (targetCountry) {
        sound.playSparkle();
        centerOnCoordinates(targetCountry.coordinates, 3.2);
      }
    } else if (focusTrigger === 0) {
      lastFocusTrigger.current = 0;
    }
  }, [focusTrigger, targetCountry, centerOnCoordinates]);

  // In Quiz mode, reset map to full view on each new question (NEVER auto-zoom on answer!)
  useEffect(() => {
    if (mode === 'quiz') {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      scaleRef.current = 1;
      positionRef.current = { x: 0, y: 0 };
    }
  }, [targetCountry?.id, mode]);

  // Auto-center on target in Atlas mode ONLY when user selects a country to inspect
  useEffect(() => {
    if (mode === 'atlas' && targetCountry) {
      centerOnCoordinates(targetCountry.coordinates, 2.8);
    }
  }, [targetCountry?.id, mode, centerOnCoordinates]);

  // Mouse Dragging bounded by map limits with 1:1 screen-to-SVG movement
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartCoords.current = { x: e.clientX, y: e.clientY };
    lastTouchCoords.current = { x: e.clientX, y: e.clientY };
    hasMovedSignificant.current = false;
    isPanning.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dist = Math.hypot(e.clientX - dragStartCoords.current.x, e.clientY - dragStartCoords.current.y);
      if (dist > 6 || hasMovedSignificant.current) {
        hasMovedSignificant.current = true;
        isPanning.current = true;
        const { ratio } = getScreenToSvg();
        const deltaX = (e.clientX - lastTouchCoords.current.x) * ratio;
        const deltaY = (e.clientY - lastTouchCoords.current.y) * ratio;

        setPosition((prev) => {
          const clamped = clampPosition(prev.x + deltaX, prev.y + deltaY, scaleRef.current);
          positionRef.current = clamped;
          return clamped;
        });
      }
      lastTouchCoords.current = { x: e.clientX, y: e.clientY };
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
        hasMovedSignificant.current = false;
      }, 150);
    }
  };

  // Mobile Touch Gestures (Continuous Pinch-to-Zoom with Midpoint Anchor & 1:1 Pan)
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchDevice.current = true;
    setHoveredCountry(null);
    setIsDragging(true);

    if (e.touches.length === 1) {
      const t = e.touches[0];
      lastTouchCoords.current = { x: t.clientX, y: t.clientY };
      touchStartPos.current = { x: t.clientX, y: t.clientY };
      hasMovedSignificant.current = false;
      isPanning.current = false;
      lastPinchDist.current = 0;
    } else if (e.touches.length >= 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      lastPinchDist.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      lastMidpoint.current = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };
      hasMovedSignificant.current = true;
      isPanning.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    isTouchDevice.current = true;
    setHoveredCountry(null);
    if (e.cancelable) {
      e.preventDefault();
    }

    const { ratio, offsetX, offsetY } = getScreenToSvg();

    if (e.touches.length === 1) {
      const t = e.touches[0];
      const moveDist = Math.hypot(t.clientX - touchStartPos.current.x, t.clientY - touchStartPos.current.y);

      // Distinguish taps from intentional panning
      if (moveDist > 8 || hasMovedSignificant.current) {
        hasMovedSignificant.current = true;
        isPanning.current = true;

        const deltaX = (t.clientX - lastTouchCoords.current.x) * ratio;
        const deltaY = (t.clientY - lastTouchCoords.current.y) * ratio;

        setPosition((prev) => {
          const clamped = clampPosition(prev.x + deltaX, prev.y + deltaY, scaleRef.current);
          positionRef.current = clamped;
          return clamped;
        });
      }
      lastTouchCoords.current = { x: t.clientX, y: t.clientY };
    } else if (e.touches.length >= 2) {
      hasMovedSignificant.current = true;
      isPanning.current = true;

      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const currentMid = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2,
      };

      if (lastPinchDist.current > 10) {
        const pinchFactor = currentDist / lastPinchDist.current;
        const curScale = scaleRef.current;
        const nextScale = Math.min(Math.max(curScale * pinchFactor, 1), 8);

        // Convert midpoint to SVG coordinates
        const svgMidX = (currentMid.x - offsetX) * ratio;
        const svgMidY = (currentMid.y - offsetY) * ratio;

        // Current position
        const curPos = positionRef.current;

        // Point under pinch in unscaled SVG coordinates:
        const ptX = (svgMidX - curPos.x - MAP_WIDTH / 2) / curScale + MAP_WIDTH / 2;
        const ptY = (svgMidY - curPos.y - MAP_HEIGHT / 2) / curScale + MAP_HEIGHT / 2;

        // Midpoint delta movement (panning while pinching):
        const midDeltaSvgX = (currentMid.x - lastMidpoint.current.x) * ratio;
        const midDeltaSvgY = (currentMid.y - lastMidpoint.current.y) * ratio;

        // Keep point under pinch stable while applying scale and midpoint shift
        const rawNewX = svgMidX - MAP_WIDTH / 2 - (ptX - MAP_WIDTH / 2) * nextScale + midDeltaSvgX;
        const rawNewY = svgMidY - MAP_HEIGHT / 2 - (ptY - MAP_HEIGHT / 2) * nextScale + midDeltaSvgY;

        const clamped = clampPosition(rawNewX, rawNewY, nextScale);

        scaleRef.current = nextScale;
        positionRef.current = clamped;
        setScale(nextScale);
        setPosition(clamped);
      }

      lastPinchDist.current = currentDist;
      lastMidpoint.current = currentMid;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Seamless handover: if 1 finger remains after pinch, smoothly continue 1-finger pan without jump
    if (e.touches.length === 1) {
      const t = e.touches[0];
      lastTouchCoords.current = { x: t.clientX, y: t.clientY };
      touchStartPos.current = { x: t.clientX, y: t.clientY };
      lastPinchDist.current = 0;
      setIsDragging(true);
      return;
    }

    if (e.touches.length === 0) {
      setIsDragging(false);
      lastPinchDist.current = 0;
      if (isPanning.current) {
        setTimeout(() => {
          isPanning.current = false;
          hasMovedSignificant.current = false;
        }, 150);
      }
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
    if (isPanning.current || hasMovedSignificant.current) {
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
