import React, { useEffect, useRef } from 'react';
import MapGl, { MapRef } from 'react-map-gl';

const MapWithTileLoad = (props: any) => {
    const mapRef = useRef<MapRef>(null);

    useEffect(() => {
        const map = mapRef.current?.getMap();
        const cacheName = 'map-tiles-cache';
    
        async function serveTile(url: string) {
            const cache = await caches.open(cacheName);
            const response = await cache.match(url);
            if (response) {
                return response;
            }
            // Fallback to network if not in cache
            const fetchResponse = await fetch(url);
            if (fetchResponse.ok) {
                await cache.put(url, fetchResponse.clone());
            }
            return fetchResponse;
        }
    
        const tileDataHandler = async (event: any) => {
            if (event.tile && event.tile.url) {
                // Use serveTile to handle caching and serving tiles
                await serveTile(event.tile.url);
            }
        };
    
        if (map) {
            map.on('load', () => {
                map.on('tiledata', tileDataHandler);
            });
        }
    
        return () => {
            if (map) {
                map.off('load'); // If you also want to remove the 'load' event listener, you need a similar approach as 'tiledata'
                map.off('tiledata', tileDataHandler);
            }
        };
    }, []);

    return <MapGl ref={mapRef} {...props} style={{ width: '100%', height: '100vh' }} />;
};

export default MapWithTileLoad;