import React from 'react';
import { FeatureData } from '../types';
import { usePublicTwinExport } from '../twin/adapter';
import TwinExportFallback from './twin/TwinExportFallback';

const TwinExportCampus = React.lazy(() => import('./TwinExportCampus'));

type Props = {
  onFeatureSelect: (feature: FeatureData) => void;
};

const CampusExperience: React.FC<Props> = ({ onFeatureSelect }) => {
  const [enable3d, setEnable3d] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const { data, error } = usePublicTwinExport();

  const handleSelect = (feature: FeatureData) => {
    setSelectedId(feature.id);
    onFeatureSelect(feature);
  };

  if (error) {
    return (
      <div className="ace-twin-load-error absolute inset-0">
        <span className="ace-kicker">STRUCTURAL EXPORT UNAVAILABLE</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full bg-[#071426] grid place-items-center">
        <div className="ace-kicker">LOADING DIGITAL TWIN EXPORT</div>
      </div>
    );
  }

  if (!enable3d) {
    return (
      <div className="absolute inset-0">
        <TwinExportFallback
          data={data}
          selectedId={selectedId}
          onSelect={handleSelect}
          reason="Structural twin · 3D available on demand"
        />
        <button
          type="button"
          className="ace-campus-enable-3d"
          onPointerEnter={() => void import('./TwinExportCampus')}
          onFocus={() => void import('./TwinExportCampus')}
          onClick={() => setEnable3d(true)}
        >
          Enter interactive 3D
          <span>loads only when requested</span>
        </button>
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <TwinExportFallback
          data={data}
          selectedId={selectedId}
          onSelect={handleSelect}
          reason="Loading interactive 3D"
        />
      }
    >
      <TwinExportCampus
        data={data}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
    </React.Suspense>
  );
};

export default CampusExperience;
