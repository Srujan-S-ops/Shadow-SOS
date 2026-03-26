"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Shield, Plus } from 'lucide-react';

// Fix Leaflet's default icon path issues in React
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom colored icons
const createIcon = (color: string) => {
  return new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color}"></div>`,
    className: 'custom-leaflet-icon',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const policeIcon = createIcon('#3b82f6'); // Blue for police
const hospitalIcon = createIcon('#ef4444'); // Red for hospital
const userIcon = createIcon('#10b981'); // Green for user

interface SafeMapViewerProps {
  userLat: number;
  userLng: number;
}

export default function SafeMapViewer({ userLat, userLng }: SafeMapViewerProps) {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSafeSpaces = async () => {
      // 2km radius
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="police"](around:2000, ${userLat}, ${userLng});
          node["amenity"="hospital"](around:2000, ${userLat}, ${userLng});
          way["amenity"="police"](around:2000, ${userLat}, ${userLng});
          way["amenity"="hospital"](around:2000, ${userLat}, ${userLng});
        );
        out center;
      `;

      try {
        const res = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query
        });
        const data = await res.json();
        
        const mapped = data.elements.map((el: any) => {
          const lat = el.lat || el.center?.lat;
          const lon = el.lon || el.center?.lon;
          const name = el.tags?.name || (el.tags?.amenity === 'police' ? 'Police Station' : 'Hospital');
          const type = el.tags?.amenity;
          return { id: el.id, lat, lon, name, type };
        }).filter((p: any) => p.lat && p.lon);

        setPlaces(mapped);
      } catch (e) {
        console.error("Failed to fetch safe spaces", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSafeSpaces();
  }, [userLat, userLng]);

  return (
    <div className="w-full h-full relative z-0">
      {loading && (
        <div className="absolute inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
          <div className="animate-pulse flex flex-col items-center">
            <Shield className="w-12 h-12 mb-4 text-indigo-400" />
            <p className="font-bold tracking-widest uppercase">Radar Scanning 2km Radius...</p>
          </div>
        </div>
      )}
      <MapContainer 
        center={[userLat, userLng]} 
        zoom={14} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        {/* User Marker */}
        <Marker position={[userLat, userLng]} icon={userIcon}>
          <Popup className="text-black font-bold">You are here</Popup>
        </Marker>

        {/* 2km Radius Circle */}
        <Circle 
          center={[userLat, userLng]} 
          radius={2000} 
          pathOptions={{ fillColor: '#4f46e5', fillOpacity: 0.1, color: '#4f46e5', weight: 1 }} 
        />

        {/* Safe Spaces Markers */}
        {places.map((place) => (
          <Marker 
            key={place.id} 
            position={[place.lat, place.lon]} 
            icon={place.type === 'police' ? policeIcon : hospitalIcon}
          >
            <Popup className="text-black">
              <div className="font-bold text-sm mb-1">{place.name}</div>
              <div className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                {place.type === 'police' ? 'Police Station' : 'Medical Facility'}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
