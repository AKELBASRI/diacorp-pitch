'use client';

import {useEffect, useRef} from 'react';
import type {ProspectStatus} from '@/db/schema';
import type {ZoneKey} from '../zones';

export type MapPin = {
  id: number;
  name: string;
  sector: string;
  city: string;
  address: string;
  estimatedMw: string;
  status: ProspectStatus;
  priority: number;
  zone: ZoneKey;
  zoneLabel: string;
  zoneColor: string;
  statusColor: string;
  statusLabel: string;
  lat: number;
  lng: number;
};

const LEAFLET_VERSION = '1.9.4';
const LEAFLET_CSS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const LEAFLET_JS = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;

let leafletScriptPromise: Promise<void> | null = null;

function loadLeaflet(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  // Already loaded
  if ((window as unknown as {L?: unknown}).L) return Promise.resolve();
  if (leafletScriptPromise) return leafletScriptPromise;

  leafletScriptPromise = new Promise<void>((resolve, reject) => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const existing = document.getElementById('leaflet-js') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Leaflet failed to load')));
      return;
    }
    const s = document.createElement('script');
    s.id = 'leaflet-js';
    s.src = LEAFLET_JS;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Leaflet failed to load'));
    document.head.appendChild(s);
  });
  return leafletScriptPromise;
}

export function LeafletMap({pins}: {pins: MapPin[]}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    loadLeaflet()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const L = (window as any).L;

        // Default Oujda-centered view; bounds will refit below.
        const map = L.map(containerRef.current, {
          zoomControl: true,
          attributionControl: true
        }).setView([34.6814, -1.9086], 7);

        L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
          }
        ).addTo(map);

        // Build markers.
        const latLngs: Array<[number, number]> = [];
        for (const p of pins) {
          const size = p.priority === 1 ? 22 : p.priority === 2 ? 18 : 14;
          const ring = p.priority === 1 ? 4 : 3;

          const html = `
            <div class="dia-pin" style="
              --c:${p.statusColor};
              width:${size}px; height:${size}px;
              border:${ring}px solid var(--c);
            "></div>
          `;
          const icon = L.divIcon({
            html,
            className: 'dia-pin-wrap',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
          });

          const popup = `
            <div class="dia-popup">
              <div class="dia-popup-status" style="color:${p.statusColor}">
                ● ${escapeHtml(p.statusLabel)}
              </div>
              <div class="dia-popup-name">${escapeHtml(p.name)}</div>
              <div class="dia-popup-sector">${escapeHtml(p.sector)}</div>
              <div class="dia-popup-loc">
                <strong>${escapeHtml(p.city)}</strong>${p.address ? ' · ' + escapeHtml(p.address) : ''}
              </div>
              ${p.estimatedMw ? `<div class="dia-popup-mw">⚡ ${escapeHtml(p.estimatedMw)}</div>` : ''}
              <div class="dia-popup-zone" style="color:${p.zoneColor}">${escapeHtml(p.zoneLabel)}</div>
              <div class="dia-popup-actions">
                <a href="/admin/prospects/${p.id}" class="dia-popup-btn primary">Open detail</a>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  p.name + ', ' + (p.address || p.city) + ', Morocco'
                )}" target="_blank" rel="noopener" class="dia-popup-btn">Google Maps ↗</a>
              </div>
            </div>
          `;

          L.marker([p.lat, p.lng], {icon, title: p.name})
            .addTo(map)
            .bindPopup(popup, {maxWidth: 280, className: 'dia-popup-wrap'});
          latLngs.push([p.lat, p.lng]);
        }

        if (latLngs.length > 0) {
          map.fitBounds(latLngs, {padding: [40, 40], maxZoom: 11});
        }

        mapRef.current = map;
        cleanup = () => {
          map.remove();
          mapRef.current = null;
        };
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Leaflet load failed', err);
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [pins]);

  return (
    <>
      <div ref={containerRef} className="dia-leaflet" />
      <style>{`
        .dia-leaflet {
          height: 70vh;
          min-height: 520px;
          width: 100%;
          background: #0a0b0d;
        }
        /* Pin styling — diamond with glowing ring */
        .dia-pin-wrap { background: transparent; border: none; }
        .dia-pin {
          background: #0a0b0d;
          transform: rotate(45deg);
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.6),
            0 0 14px var(--c);
          transition: transform .15s ease;
        }
        .dia-pin-wrap:hover .dia-pin {
          transform: rotate(45deg) scale(1.2);
        }
        /* Popup theme override (Leaflet defaults are very white) */
        .dia-popup-wrap .leaflet-popup-content-wrapper {
          background: #11141a;
          color: #e6e0d4;
          border-radius: 0;
          border: 1px solid #2a2d33;
          padding: 0;
        }
        .dia-popup-wrap .leaflet-popup-content {
          margin: 0;
          padding: 14px 16px 12px;
          font-family: 'Archivo', system-ui, sans-serif;
          font-size: 13px;
          line-height: 1.5;
          width: 260px !important;
        }
        .dia-popup-wrap .leaflet-popup-tip { background: #11141a; border: 1px solid #2a2d33; }
        .dia-popup-wrap a.leaflet-popup-close-button { color: #a39e94; }
        .dia-popup-status {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9.5px; letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 6px;
        }
        .dia-popup-name {
          font-family: 'Fraunces', serif;
          font-size: 16px; font-weight: 500; letter-spacing: -0.01em;
          margin-bottom: 2px;
          color: #f5efe2;
        }
        .dia-popup-sector {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase;
          color: #c9824a;
          margin-bottom: 8px;
        }
        .dia-popup-loc { font-size: 12px; color: #c8c2b6; margin-bottom: 4px; }
        .dia-popup-loc strong { color: #e6e0d4; font-weight: 500; }
        .dia-popup-mw {
          font-family: 'Fraunces', serif;
          font-size: 14px; color: #e8a948;
          margin: 4px 0 6px;
        }
        .dia-popup-zone {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          padding-top: 8px; margin-top: 6px;
          border-top: 1px solid #2a2d33;
        }
        .dia-popup-actions {
          display: flex; gap: 6px; margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #2a2d33;
        }
        .dia-popup-btn {
          padding: 6px 10px;
          border: 1px solid #2a2d33;
          color: #c8c2b6;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
          text-decoration: none;
          transition: all .15s ease;
        }
        .dia-popup-btn:hover { border-color: #e8a948; color: #e8a948; }
        .dia-popup-btn.primary { background: #e8a948; border-color: #e8a948; color: #0a0b0d; }
        .dia-popup-btn.primary:hover { background: #f5efe2; border-color: #f5efe2; }
        /* Force Leaflet attribution to dark theme */
        .leaflet-control-attribution {
          background: rgba(10,11,13,0.8) !important;
          color: #7c7870 !important;
        }
        .leaflet-control-attribution a { color: #c8c2b6 !important; }
      `}</style>
    </>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
