export type TwinCourt = {
  id: number;
  x: number;
  z: number;
  orientation: 'v' | 'h';
  width: number;
  depth: number;
};

export type TwinRoom = {
  id: string;
  label: string;
  x: number;
  z: number;
  width: number;
  depth: number;
};

export type PublicCampusExport = {
  schemaVersion: 'ace.public-campus.v1';
  source: {
    system: string;
    exportId: string;
    units: 'meters';
    coordinateSystem: 'threejs-y-up';
  };
  facility: {
    id: string;
    name: string;
    courtArea: { width: number; depth: number };
    officeWing: { x: number; z: number; width: number; depth: number };
    entrance: { x: number; z: number; width: number; height: number };
    fireZoneZ: number[];
  };
  courtSpec: {
    width: number;
    length: number;
    kitchenDepth: number;
    netHeight: number;
  };
  courts: TwinCourt[];
  rooms: TwinRoom[];
  amenities: Array<{ type: string; x: number; z: number }>;
  provenance: {
    facility: string;
    courts: string;
    rooms: string;
    amenities: string;
    runtimeStateExcluded: boolean;
  };
};
