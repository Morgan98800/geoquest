import * as topojson from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import worldData from 'world-atlas/countries-50m.json';

export interface CountryFeature {
  type: string;
  id: string;
  properties: {
    name?: string;
  };
  geometry: any;
}

// Extract GeoJSON features from TopoJSON
export const MAP_WIDTH = 960;
export const MAP_HEIGHT = 500;

export const projection = geoNaturalEarth1()
  .scale(153)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

export const pathGenerator = geoPath().projection(projection);

// Extract GeoJSON features from TopoJSON
const topo = worldData as any;
const featureCollection = topojson.feature(topo, topo.objects.countries) as any;

export const countryPaths: Record<string, string> = {};
const seenIds = new Set<string>();
const deduplicatedFeatures: CountryFeature[] = [];

featureCollection.features.forEach((f: any, index: number) => {
  const id = f.id ? String(f.id).padStart(3, '0') : `territory-${index}`;
  const d = pathGenerator(f as any);
  if (d) {
    if (countryPaths[id]) {
      // Concatenate paths for countries with multiple territories (e.g. Australia + islands)
      countryPaths[id] += ' ' + d;
    } else {
      countryPaths[id] = d;
    }
  }

  if (!seenIds.has(id)) {
    seenIds.add(id);
    deduplicatedFeatures.push({
      ...f,
      id,
    });
  }
});

export const worldFeatures: CountryFeature[] = deduplicatedFeatures;
