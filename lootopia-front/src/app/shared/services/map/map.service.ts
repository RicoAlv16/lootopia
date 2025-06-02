import { Injectable } from '@angular/core';
import * as L from 'leaflet';

export interface MapPoint {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];

  initMap(containerId: string, center: MapPoint, zoom = 13): L.Map {
    // Configuration des icônes par défaut de Leaflet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
    });

    this.map = L.map(containerId).setView([center.lat, center.lng], zoom);

    // Ajout de la couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    return this.map;
  }

  addMarker(point: MapPoint, customIcon?: L.Icon): L.Marker {
    if (!this.map) throw new Error('Map not initialized');

    const marker = L.marker(
      [point.lat, point.lng],
      customIcon ? { icon: customIcon } : {}
    ).addTo(this.map);

    if (point.title || point.description) {
      marker.bindPopup(`
        <div>
          ${point.title ? `<h4>${point.title}</h4>` : ''}
          ${point.description ? `<p>${point.description}</p>` : ''}
        </div>
      `);
    }

    this.markers.push(marker);
    return marker;
  }

  clearMarkers(): void {
    this.markers.forEach(marker => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });
    this.markers = [];
  }

  fitBounds(points: MapPoint[]): void {
    if (!this.map || points.length === 0) return;

    const group = new L.FeatureGroup(this.markers);
    this.map.fitBounds(group.getBounds().pad(0.1));
  }

  destroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers = [];
  }
}
