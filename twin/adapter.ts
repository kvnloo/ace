import React from 'react';
import type { FeatureData } from '../types';
import type { PublicCampusExport, TwinCourt, TwinRoom } from './types';

export function validateTwinExport(value: unknown): PublicCampusExport {
  const candidate = value as Partial<PublicCampusExport>;
  if (candidate?.schemaVersion !== 'ace.public-campus.v1') {
    throw new Error('Unsupported ACE twin export schema');
  }
  if (!Array.isArray(candidate.courts) || candidate.courts.length !== 11) {
    throw new Error('ACE twin export court layout is incomplete');
  }
  if (!candidate.facility?.courtArea || !candidate.source?.exportId) {
    throw new Error('ACE twin export facility metadata is incomplete');
  }
  return candidate as PublicCampusExport;
}

export function usePublicTwinExport() {
  const [data, setData] = React.useState<PublicCampusExport | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    const url = `${import.meta.env.BASE_URL}twin/ace-digital-twin-v1.json`;
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Twin export request failed: ${response.status}`);
        return response.json();
      })
      .then((value) => setData(validateTwinExport(value)))
      .catch((reason) => {
        if (controller.signal.aborted) return;
        setError(reason instanceof Error ? reason.message : 'Twin export failed');
      });
    return () => controller.abort();
  }, []);

  return { data, error };
}

export function courtFeature(court: TwinCourt): FeatureData {
  return {
    id: `court-${court.id}`,
    title: `Court ${court.id}`,
    description:
      `Authoritative court geometry from the ACE digital twin export. ${court.width.toFixed(1)} × ${court.depth.toFixed(1)} m; runtime match state is intentionally excluded from this public snapshot.`,
    icon: '◇',
    position: [court.x, 0, court.z],
  };
}

export function roomFeature(room: TwinRoom): FeatureData {
  return {
    id: `room-${room.id}`,
    title: room.label,
    description:
      `Facility room from the ACE digital twin structural export. ${room.width.toFixed(1)} × ${room.depth.toFixed(1)} m.`,
    icon: '□',
    position: [room.x, 0, room.z],
  };
}
