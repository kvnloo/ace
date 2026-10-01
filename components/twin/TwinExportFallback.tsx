import React from 'react';
import type { FeatureData } from '../../types';
import { courtFeature, roomFeature } from '../../twin/adapter';
import type { PublicCampusExport } from '../../twin/types';

type Props = {
  data: PublicCampusExport;
  selectedId: string | null;
  onSelect: (feature: FeatureData) => void;
  reason?: string;
};

const TwinExportFallback: React.FC<Props> = ({
  data,
  selectedId,
  onSelect,
  reason = '2D structural export',
}) => {
  const { courtArea, officeWing, entrance } = data.facility;
  const minX = -courtArea.width / 2 - 3;
  const maxX = Math.max(courtArea.width / 2, officeWing.x + officeWing.width / 2) + 3;
  const minZ = -courtArea.depth / 2 - 3;
  const maxZ = courtArea.depth / 2 + 3;
  const viewWidth = maxX - minX;
  const viewHeight = maxZ - minZ;

  const activate = (event: React.KeyboardEvent<SVGGElement>, feature: FeatureData) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelect(feature);
  };

  return (
    <div className="ace-twin-fallback absolute inset-0">
      <svg
        className="ace-twin-plan"
        viewBox={`${minX} ${minZ} ${viewWidth} ${viewHeight}`}
        role="img"
        aria-label="ACE digital twin exported facility plan"
      >
        <rect
          x={-courtArea.width / 2}
          y={-courtArea.depth / 2}
          width={courtArea.width}
          height={courtArea.depth}
          className="ace-twin-plan-envelope"
        />
        <rect
          x={officeWing.x - officeWing.width / 2}
          y={officeWing.z - officeWing.depth / 2}
          width={officeWing.width}
          height={officeWing.depth}
          className="ace-twin-plan-wing"
        />

        {data.facility.fireZoneZ.map((z) => (
          <line
            key={z}
            x1={-courtArea.width / 2}
            y1={z}
            x2={courtArea.width / 2}
            y2={z}
            className="ace-twin-plan-fire"
          />
        ))}

        {data.courts.map((court) => {
          const feature = courtFeature(court);
          const active = selectedId === feature.id;
          return (
            <g
              key={court.id}
              role="button"
              tabIndex={0}
              aria-label={`Inspect court ${court.id}`}
              aria-pressed={active}
              className="ace-twin-plan-target"
              onClick={() => onSelect(feature)}
              onKeyDown={(event) => activate(event, feature)}
            >
              <rect
                x={court.x - court.width / 2}
                y={court.z - court.depth / 2}
                width={court.width}
                height={court.depth}
                rx={0.5}
                className="ace-twin-plan-court"
                data-active={active ? 'true' : 'false'}
              />
              <text x={court.x} y={court.z} className="ace-twin-plan-label">
                {court.id}
              </text>
            </g>
          );
        })}

        {data.rooms.map((room) => {
          const feature = roomFeature(room);
          const active = selectedId === feature.id;
          return (
            <g
              key={room.id}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${room.label}`}
              aria-pressed={active}
              className="ace-twin-plan-target"
              onClick={() => onSelect(feature)}
              onKeyDown={(event) => activate(event, feature)}
            >
              <rect
                x={room.x - room.width / 2}
                y={room.z - room.depth / 2}
                width={room.width}
                height={room.depth}
                className="ace-twin-plan-room"
                data-active={active ? 'true' : 'false'}
              />
            </g>
          );
        })}

        <line
          x1={entrance.x - entrance.width / 2}
          y1={entrance.z}
          x2={entrance.x + entrance.width / 2}
          y2={entrance.z}
          className="ace-twin-plan-entrance"
        />
      </svg>

      <div className="ace-twin-export-badge">
        <span>ACE DIGITAL TWIN · STRUCTURAL EXPORT</span>
        <small>{data.source.exportId} · runtime state excluded</small>
      </div>
      <div className="ace-twin-fallback-note">{reason}</div>
    </div>
  );
};

export default TwinExportFallback;
