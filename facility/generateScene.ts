import {
  BuildingNode,
  DoorNode,
  LevelNode,
  SiteNode,
  SlabNode,
  WallNode,
  WindowNode,
  ZoneNode,
  type AnyNode,
  type AnyNodeId,
} from '@pascal-app/core';
import {
  BUILDING_DEPTH,
  BUILDING_ID,
  BUILDING_WIDTH,
  SITE_ID,
  WALL_HEIGHT,
  WALL_THICKNESS,
} from './program.ts';

type MaterialPreset = 'concrete' | 'plaster' | 'glass' | 'wood' | 'metal';
type SceneNodes = Record<AnyNodeId, AnyNode>;
type Point = [number, number];

type Room = {
  id: string;
  name: string;
  color: string;
  polygon: Point[];
  floorFinish: string;
  occupancy: string;
  metadata: Record<string, unknown>;
};

type Opening = {
  id: string;
  kind: 'door' | 'window';
  along: number;
  width: number;
  height: number;
  sill?: number;
};

const X0 = -BUILDING_WIDTH / 2;
const Z0 = -BUILDING_DEPTH / 2;
const X1 = BUILDING_WIDTH / 2;
const Z1 = BUILDING_DEPTH / 2;

function rect(x: number, z: number, w: number, d: number): Point[] {
  return [
    [x, z],
    [x + w, z],
    [x + w, z + d],
    [x, z + d],
  ];
}

function add(nodes: SceneNodes, node: AnyNode) {
  nodes[node.id] = node;
  return node;
}

function wallLen(start: Point, end: Point) {
  return Math.hypot(end[0] - start[0], end[1] - start[1]);
}

function addWall(
  nodes: SceneNodes,
  levelId: string,
  id: `wall_${string}`,
  start: Point,
  end: Point,
  material: MaterialPreset,
  openings: Opening[] = [],
) {
  const children = openings.map((opening) =>
    opening.kind === 'door' ? (`door_${opening.id.replace(/^door_/, '')}` as const) : (`window_${opening.id.replace(/^window_/, '')}` as const),
  );
  const wall = WallNode.parse({
    id,
    name: id,
    parentId: levelId,
    start,
    end,
    height: WALL_HEIGHT,
    thickness: WALL_THICKNESS,
    material: { preset: material },
    children,
    frontSide: 'exterior',
    backSide: 'interior',
  });
  add(nodes, wall);

  const length = wallLen(start, end);
  for (const opening of openings) {
    const along = Math.min(Math.max(opening.along, opening.width / 2), length - opening.width / 2);
    if (opening.kind === 'door') {
      const doorId = `door_${opening.id.replace(/^door_/, '')}` as const;
      add(
        nodes,
        DoorNode.parse({
          id: doorId,
          name: opening.id,
          parentId: wall.id,
          wallId: wall.id,
          position: [along, opening.height / 2, 0],
          width: opening.width,
          height: opening.height,
          doorCategory: 'interior',
          doorType: opening.width >= 3.5 ? 'double' : 'hinged',
        }),
      );
    } else {
      const windowId = `window_${opening.id.replace(/^window_/, '')}` as const;
      const sill = opening.sill ?? 1.2;
      add(
        nodes,
        WindowNode.parse({
          id: windowId,
          name: opening.id,
          parentId: wall.id,
          wallId: wall.id,
          position: [along, sill + opening.height / 2, 0],
          width: opening.width,
          height: opening.height,
          windowType: 'fixed',
          material: { preset: 'glass' },
        }),
      );
    }
  }

  return wall;
}

function addRoom(nodes: SceneNodes, levelId: string, room: Room, slabMaterial: MaterialPreset) {
  const zone = ZoneNode.parse({
    id: `zone_${room.id}`,
    parentId: levelId,
    name: room.name,
    polygon: room.polygon,
    color: room.color,
    spaceRole: 'room',
    occupancy: room.occupancy,
    floorFinish: room.floorFinish,
    ceilingHeight: WALL_HEIGHT,
    metadata: room.metadata,
  });
  const slab = SlabNode.parse({
    id: `slab_${room.id}`,
    name: `${room.name} slab`,
    parentId: levelId,
    polygon: room.polygon,
    elevation: 0.05,
    material: { preset: slabMaterial },
  });
  add(nodes, zone);
  add(nodes, slab);
  return [zone.id, slab.id] as const;
}

function envelopeOpenings(floor: number): { south: Opening[]; east: Opening[]; north: Opening[]; west: Opening[] } {
  const ribbon = (prefix: string): Opening[] => [
    { id: `${prefix}_a`, kind: 'window', along: 28, width: 8, height: 3.2, sill: 1.4 },
    { id: `${prefix}_b`, kind: 'window', along: 112, width: 8, height: 3.2, sill: 1.4 },
  ];
  const south: Opening[] =
    floor === 0
      ? [
          { id: 'entry', kind: 'door', along: BUILDING_WIDTH / 2, width: 4.2, height: 3.2 },
          { id: 'l0_south_a', kind: 'window', along: 28, width: 8, height: 3.2, sill: 1.4 },
          { id: 'l0_south_b', kind: 'window', along: 112, width: 8, height: 3.2, sill: 1.4 },
        ]
      : ribbon(`l${floor}_south`);
  return {
    south,
    east: ribbon(`l${floor}_east`),
    north: ribbon(`l${floor}_north`),
    west: ribbon(`l${floor}_west`),
  };
}

function roomsForFloor(floor: number): Room[] {
  if (floor === 0) {
    return [
      {
        id: 'tennis',
        name: 'Tennis arena',
        color: '#3f6b1d',
        polygon: rect(X0, Z0, 120, BUILDING_DEPTH),
        floorFinish: 'sport-court',
        occupancy: '24 tennis courts (hard/clay/grass/wood — split unspecified)',
        metadata: { originCount: 24, honesty: 'SPEC', split: 'unspecified' },
      },
      {
        id: 'pro-shop',
        name: 'Pro shop',
        color: '#8B5A2B',
        polygon: rect(X0 + 120, Z0, 20, 60),
        floorFinish: 'wood',
        occupancy: 'retail',
        metadata: { honesty: 'SPEC' },
      },
      {
        id: 'lockers',
        name: 'Lockers',
        color: '#4a5568',
        polygon: rect(X0 + 120, Z0 + 60, 20, 60),
        floorFinish: 'tile',
        occupancy: 'lockers',
        metadata: { honesty: 'SPEC' },
      },
    ];
  }
  if (floor === 1) {
    return [
      {
        id: 'badminton',
        name: 'Badminton',
        color: '#1f6b4a',
        polygon: rect(X0, Z0, 80, BUILDING_DEPTH),
        floorFinish: 'sport-court',
        occupancy: '16 badminton courts',
        metadata: { originCount: 16, honesty: 'SPEC' },
      },
      {
        id: 'squash',
        name: 'Squash',
        color: '#2c5282',
        polygon: rect(X0 + 80, Z0, 60, 60),
        floorFinish: 'sport-court',
        occupancy: '4 squash courts',
        metadata: { originCount: 4, honesty: 'SPEC' },
      },
      {
        id: 'table-tennis',
        name: 'Table tennis',
        color: '#2b6cb0',
        polygon: rect(X0 + 80, Z0 + 60, 60, 60),
        floorFinish: 'sport-court',
        occupancy: '16 table tennis stations',
        metadata: { originCount: 16, honesty: 'SPEC' },
      },
    ];
  }
  if (floor === 2) {
    return [
      {
        id: 'pickleball',
        name: 'Pickleball',
        color: '#3d7a3a',
        polygon: rect(X0, Z0, 90, BUILDING_DEPTH),
        floorFinish: 'sport-court',
        occupancy: '8 pickleball courts',
        metadata: { originCount: 8, honesty: 'SPEC' },
      },
      {
        id: 'real-tennis',
        name: 'Real tennis',
        color: '#6b4f2a',
        polygon: rect(X0 + 90, Z0, 50, BUILDING_DEPTH),
        floorFinish: 'sport-court',
        occupancy: '1 real tennis court',
        metadata: { originCount: 1, honesty: 'SPEC' },
      },
    ];
  }
  return [
    {
      id: 'grass-lab',
      name: 'Grass lab',
      color: '#1a3d24',
      polygon: rect(X0, Z0, BUILDING_WIDTH, BUILDING_DEPTH),
      floorFinish: 'grow-deck',
      occupancy: '500 m² per section; section count unspecified',
      metadata: {
        honesty: 'PLANNED',
        origin: '500m2-per-section',
        sectionCount: 'unspecified',
      },
    },
  ];
}

function interiorWalls(floor: number): Array<{ id: `wall_${string}`; start: Point; end: Point; doorAlong: number }> {
  if (floor === 0) {
    return [
      { id: 'wall_l0_amenity', start: [X0 + 120, Z0], end: [X0 + 120, Z1], doorAlong: 60 },
      { id: 'wall_l0_shop_lockers', start: [X0 + 120, 0], end: [X1, 0], doorAlong: 10 },
    ];
  }
  if (floor === 1) {
    return [
      { id: 'wall_l1_split', start: [X0 + 80, Z0], end: [X0 + 80, Z1], doorAlong: 60 },
      { id: 'wall_l1_squash_tt', start: [X0 + 80, 0], end: [X1, 0], doorAlong: 30 },
    ];
  }
  if (floor === 2) {
    return [{ id: 'wall_l2_heritage', start: [X0 + 90, Z0], end: [X0 + 90, Z1], doorAlong: 60 }];
  }
  return [];
}

export type LawnTechScene = {
  nodes: SceneNodes;
  rootNodeIds: AnyNodeId[];
};

export function generateLawnTechScene(): LawnTechScene {
  const nodes: SceneNodes = {};
  const sitePad = 20;
  const site = SiteNode.parse({
    id: SITE_ID,
    name: 'Naperville — LawnTech pretotype',
    polygon: {
      type: 'polygon',
      points: [
        [X0 - sitePad, Z0 - sitePad],
        [X1 + sitePad, Z0 - sitePad],
        [X1 + sitePad, Z1 + sitePad],
        [X0 - sitePad, Z1 + sitePad],
      ],
    },
    metadata: {
      origin: 'Naperville',
      honesty: 'pretotype',
      envelope: 'inferred-140x120',
      wallHeight: 'inferred-10m-sport-hall',
      compiler: 'ace-facility@1',
      farmSections: 'unspecified',
    },
    children: [BUILDING_ID],
  });

  const building = BuildingNode.parse({
    id: BUILDING_ID,
    name: 'LawnTech Dynamics',
    parentId: site.id,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    children: ['level_0', 'level_1', 'level_2', 'level_3'],
  });

  const names = [
    'Ground — tennis arena',
    'L1 — racquet mezzanine',
    'L2 — pickleball & heritage',
    'L3 — grass lab',
  ];

  for (let floor = 0; floor < 4; floor += 1) {
    const levelId = `level_${floor}` as const;
    const rooms = roomsForFloor(floor);
    const openings = envelopeOpenings(floor);
    const childIds: string[] = [];

    for (const room of rooms) {
      const [zoneId, slabId] = addRoom(
        nodes,
        levelId,
        room,
        floor === 3 ? 'concrete' : floor === 0 && room.id !== 'tennis' ? 'wood' : 'tile',
      );
      childIds.push(zoneId, slabId);
    }

    const south = addWall(nodes, levelId, `wall_l${floor}_south`, [X0, Z0], [X1, Z0], 'concrete', openings.south);
    const east = addWall(nodes, levelId, `wall_l${floor}_east`, [X1, Z0], [X1, Z1], 'concrete', openings.east);
    const north = addWall(nodes, levelId, `wall_l${floor}_north`, [X1, Z1], [X0, Z1], 'concrete', openings.north);
    const west = addWall(nodes, levelId, `wall_l${floor}_west`, [X0, Z1], [X0, Z0], 'concrete', openings.west);
    childIds.push(south.id, east.id, north.id, west.id);

    for (const partition of interiorWalls(floor)) {
      const wall = addWall(nodes, levelId, partition.id, partition.start, partition.end, 'plaster', [
        {
          id: `${partition.id}_door`,
          kind: 'door',
          along: partition.doorAlong,
          width: 2.4,
          height: 2.4,
        },
      ]);
      childIds.push(wall.id);
    }

    const level = LevelNode.parse({
      id: levelId,
      name: names[floor],
      parentId: building.id,
      level: floor,
      height: WALL_HEIGHT,
      children: childIds,
      metadata: { honesty: floor === 3 ? 'PLANNED' : 'SPEC' },
    });
    add(nodes, level);
  }

  add(nodes, building);
  add(nodes, site);

  return { nodes, rootNodeIds: [site.id] };
}

export function sceneStats(scene: LawnTechScene) {
  const kinds: Record<string, number> = {};
  for (const node of Object.values(scene.nodes)) {
    const kind = String((node as { type?: string }).type ?? 'unknown');
    kinds[kind] = (kinds[kind] ?? 0) + 1;
  }
  return {
    nodeCount: Object.keys(scene.nodes).length,
    roots: scene.rootNodeIds,
    kinds,
    hasFourFarmSections: Object.keys(scene.nodes).some((id) => String(id).includes('section')),
  };
}
