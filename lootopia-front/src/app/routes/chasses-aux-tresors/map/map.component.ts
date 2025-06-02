import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as L from 'leaflet';
import { MapPoint, MapService } from '../../../shared/services/map/map.service';

@Component({
  selector: 'app-map',
  template: `
    <div #mapContainer class="map-container" [style.height]="height"></div>
  `,
  styles: [
    `
      .map-container {
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
      }
    `,
  ],
  standalone: true,
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  @Input() center: MapPoint = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut
  @Input() zoom = 13; // Supprimé : number
  @Input() height = '400px'; // Supprimé : string
  @Input() markers: MapPoint[] = [];
  @Input() huntSteps: MapPoint[] = [];

  private map: L.Map | null = null;
  private mapId: string;

  constructor(private mapService: MapService) {
    this.mapId = 'map-' + Math.random().toString(36).substr(2, 9);
  }

  ngOnInit(): void {
    this.mapContainer.nativeElement.id = this.mapId;
  }

  ngAfterViewInit(): void {
    // Attendre que le modal soit complètement affiché
    setTimeout(() => {
      this.initializeMap();
      // Forcer le redimensionnement après initialisation
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          // Forcer le rechargement des tuiles
          this.map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
              layer.redraw();
            }
          });
        }
      }, 500);
    }, 500);
  }

  // Pour corriger l'erreur avec DivIcon
  private initializeMap(): void {
    this.map = this.mapService.initMap(this.mapId, this.center, this.zoom);
    
    // Ajouter les marqueurs des étapes de chasse
    this.huntSteps.forEach((step, index) => {
      const customIcon = L.divIcon({
        html: `<div class="hunt-marker">${index + 1}</div>`,
        className: 'custom-hunt-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      // Utiliser addMarker sans le paramètre customIcon pour éviter l'erreur de type
      const marker = L.marker([step.lat, step.lng], { icon: customIcon })
        .addTo(this.map!);
      
      if (step.title || step.description) {
        marker.bindPopup(`
          <div>
            ${step.title ? `<h4>${step.title}</h4>` : ''}
            ${step.description ? `<p>${step.description}</p>` : ''}
          </div>
        `);
      }
    });
  
    // Ajouter les autres marqueurs
    this.markers.forEach(marker => {
      this.mapService.addMarker(marker);
    });
  
    // Ajuster la vue pour inclure tous les points
    if (this.huntSteps.length > 0) {
      this.mapService.fitBounds(this.huntSteps);
    }
  }

  ngOnDestroy(): void {
    this.mapService.destroy();
  }
}
