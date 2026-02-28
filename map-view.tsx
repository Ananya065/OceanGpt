import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useOceanData } from "@/hooks/use-ocean";
import { Loader2, AlertCircle } from "lucide-react";

export default function MapView() {
  const { data: oceanData, isLoading, error } = useOceanData();
  
  const [layers, setLayers] = useState({
    temperature: true,
    pollution: false,
    fish: false,
  });

  // Mock data fallback if API fails or returns empty
  const mapData = oceanData?.length ? oceanData : [
    { id: 1, latitude: 25.0, longitude: -71.0, temperature: 28.5, pollutionLevel: 45, fishPopulation: 1200 },
    { id: 2, latitude: 15.0, longitude: 120.0, temperature: 30.1, pollutionLevel: 80, fishPopulation: 400 },
    { id: 3, latitude: -10.0, longitude: -40.0, temperature: 24.2, pollutionLevel: 15, fishPopulation: 3500 },
    { id: 4, latitude: 45.0, longitude: -20.0, temperature: 15.5, pollutionLevel: 25, fishPopulation: 8000 },
    { id: 5, latitude: 5.0, longitude: 90.0, temperature: 29.8, pollutionLevel: 65, fishPopulation: 900 },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] rounded-3xl overflow-hidden shadow-2xl border border-border mt-6 animate-in fade-in duration-500">
      
      {/* Map Layers Control Panel */}
      <Card className="absolute top-6 right-6 z-[1000] w-72 glass shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Data Layers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="temp" 
              checked={layers.temperature}
              onCheckedChange={(c) => setLayers(prev => ({ ...prev, temperature: !!c }))}
              className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
            />
            <Label htmlFor="temp" className="cursor-pointer font-medium">Temperature (°C)</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="pollution" 
              checked={layers.pollution}
              onCheckedChange={(c) => setLayers(prev => ({ ...prev, pollution: !!c }))}
              className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <Label htmlFor="pollution" className="cursor-pointer font-medium">Pollution Level</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="fish" 
              checked={layers.fish}
              onCheckedChange={(c) => setLayers(prev => ({ ...prev, fish: !!c }))}
              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            />
            <Label htmlFor="fish" className="cursor-pointer font-medium">Fish Population</Label>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="absolute top-6 left-6 z-[1000] bg-destructive/10 text-destructive px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-md border border-destructive/20">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold text-sm">Showing mock data (API unavailable)</span>
        </div>
      )}

      {/* The Map */}
      <MapContainer 
        center={[20, 0]} 
        zoom={3} 
        className="w-full h-full bg-[#a3c9e2] dark:bg-[#0c192c]"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        />
        
        {mapData.map((point) => (
          <div key={point.id}>
            {/* Temperature Layer */}
            {layers.temperature && (
              <CircleMarker
                center={[Number(point.latitude), Number(point.longitude)]}
                radius={Math.max(8, Number(point.temperature) / 2)}
                pathOptions={{
                  color: 'transparent',
                  fillColor: Number(point.temperature) > 28 ? '#ef4444' : '#f97316',
                  fillOpacity: 0.6,
                }}
              >
                <Popup className="rounded-xl overflow-hidden">
                  <div className="p-1 font-sans">
                    <strong className="block text-red-600 mb-1">Temperature Info</strong>
                    {Number(point.temperature).toFixed(1)} °C
                  </div>
                </Popup>
              </CircleMarker>
            )}

            {/* Pollution Layer */}
            {layers.pollution && (
              <CircleMarker
                center={[Number(point.latitude), Number(point.longitude)]}
                radius={Math.max(10, Number(point.pollutionLevel) / 4)}
                pathOptions={{
                  color: 'transparent',
                  fillColor: '#a855f7',
                  fillOpacity: 0.5,
                }}
              >
                <Popup>
                  <div className="p-1 font-sans">
                    <strong className="block text-purple-600 mb-1">Pollution Level</strong>
                    Index: {point.pollutionLevel} / 100
                  </div>
                </Popup>
              </CircleMarker>
            )}

            {/* Fish Population Layer */}
            {layers.fish && (
              <CircleMarker
                center={[Number(point.latitude), Number(point.longitude)]}
                radius={Math.max(5, Number(point.fishPopulation) / 400)}
                pathOptions={{
                  color: 'transparent',
                  fillColor: '#22c55e',
                  fillOpacity: 0.7,
                }}
              >
                <Popup>
                  <div className="p-1 font-sans">
                    <strong className="block text-green-600 mb-1">Fish Population</strong>
                    Est: {point.fishPopulation.toLocaleString()}
                  </div>
                </Popup>
              </CircleMarker>
            )}
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
