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
const topo = worldData as any;
const featureCollection = topojson.feature(topo, topo.objects.countries) as any;

export const worldFeatures: CountryFeature[] = featureCollection.features.map((f: any) => ({
  ...f,
  id: f.id ? String(f.id).padStart(3, '0') : ''
}));

export const MAP_WIDTH = 960;
export const MAP_HEIGHT = 500;

export const projection = geoNaturalEarth1()
  .scale(153)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

export const pathGenerator = geoPath().projection(projection);

// Map of country id to SVG path string d
export const countryPaths: Record<string, string> = {};
worldFeatures.forEach((f) => {
  if (f.id) {
    const d = pathGenerator(f as any);
    if (d) {
      countryPaths[f.id] = d;
    }
  }
});
