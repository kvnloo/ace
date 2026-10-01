import React from 'react';
import { FeatureData } from '../types';
import { usePublicTwinExport } from '../twin/adapter';
import TwinExportFallback from './twin/TwinExportFallback';

const TwinExportCampus = React.lazy(() => import('./TwinExportCampus'));

type Props = {
  onFeatureSelect: (feature: FeatureData) => void;
};

const CampusExperience: React.FC<Props> = ({ onFeatureSelect }) => {
  const [force3d, setForce3d] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const { data, error } = usePublicTwinExport();
  const lite = document.documentElement.dataset.aceQuality === 'lite';

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

  if (lite && !force3d) {
    return (
      <div className="absolute inset-0">
        <TwinExportFallback
          data={data}
          selectedId={selectedId}
          onSelect={handleSelect}
          reason="Lite mode · 3D deferred"
        />
        <button
          type="button"
          className="ace-campus-enable-3d"
          onClick={() => setForce3d(true)}
        >
          Enable full 3D
          <span>loads the exported twin renderer on demand</span>
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
          reason="Loading exported twin renderer"
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
