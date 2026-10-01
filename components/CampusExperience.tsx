import React from 'react';
import { FeatureData } from '../types';
import { usePublicTwinExport } from '../twin/adapter';
import TwinExportFallback from './twin/TwinExportFallback';

const TwinExportCampus = React.lazy(() => import('./TwinExportCampus'));

type Props = {
  onFeatureSelect: (feature: FeatureData) => void;
};

class TwinChunkBoundary extends React.Component<
  { onFail: () => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error('[ACE twin chunk]', error);
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const CampusExperience: React.FC<Props> = ({ onFeatureSelect }) => {
  const [enable3d, setEnable3d] = React.useState(false);
  const [chunkFailed, setChunkFailed] = React.useState(false);
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

  if (!enable3d || chunkFailed) {
    return (
      <div className="absolute inset-0">
        <TwinExportFallback
          data={data}
          selectedId={selectedId}
          onSelect={handleSelect}
          reason={chunkFailed ? 'Interactive 3D unavailable · structural twin remains active' : 'Structural twin · 3D available on demand'}
        />
        <button
          type="button"
          className="ace-campus-enable-3d"
          onClick={() => {
            setChunkFailed(false);
            setEnable3d(true);
          }}
        >
          {chunkFailed ? 'Retry interactive 3D' : 'Enter interactive 3D'}
          <span>loads only when requested</span>
        </button>
      </div>
    );
  }

  return (
    <TwinChunkBoundary
      onFail={() => {
        setChunkFailed(true);
        setEnable3d(false);
      }}
    >
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
    </TwinChunkBoundary>
  );
};

export default CampusExperience;
