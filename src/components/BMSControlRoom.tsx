import React from 'react';
import * as THREE from 'three';

/**
 * Building Management System (BMS) Control Room Components
 *
 * @remarks
 * Complete 3D visualization of a modern building management system control room
 * including operator workstations, wall-mounted display screens, server infrastructure,
 * and monitoring equipment for facility-wide sensor data visualization.
 *
 * Features:
 * - Multi-monitor operator workstations (4 stations)
 * - Large wall display screens with real-time data visualization
 * - Server room with rack-mounted equipment
 * - Raised floor panels for cable management
 * - Overhead lighting and cable trays
 * - Security camera and emergency signage
 * - Glass partition walls
 * - Atmospheric lighting effects
 *
 * @packageDocumentation
 */

/**
 * Operator workstation with triple monitor setup
 *
 * @remarks
 * Professional monitoring workstation featuring three active displays,
 * keyboard, mouse, and ergonomic office chair. Monitors show emissive
 * screens simulating active BMS dashboards with different data streams.
 *
 * Visual elements:
 * - Desk surface (2.5m × 1.2m × 0.8m height)
 * - 3 monitors with individual stands
 * - Central monitor (blue) for primary display
 * - Side monitors (cyan) for auxiliary data
 * - Each screen has glowing effect (point light)
 * - Keyboard and mouse peripherals
 * - Office chair with adjustable height
 *
 * Monitor specifications:
 * - Screen size: 0.55m × 0.31m
 * - Frame color: Dark slate (#0f172a)
 * - Active colors: Blue (#3b82f6) and cyan (#0ea5e9)
 * - Emissive intensity: 0.8 (HDR rendering)
 *
 * @param props - Workstation configuration
 * @param props.position - 3D position in room space [x, y, z]
 * @param props.rotation - Y-axis rotation in radians (default: 0)
 *
 * @example
 * ```tsx
 * <OperatorWorkstation position={[-3, 0, 0]} rotation={0} />
 * <OperatorWorkstation position={[3, 0, -2.5]} rotation={Math.PI} />
 * ```
 */
export const OperatorWorkstation: React.FC<{
  /** 3D world position [x, y, z] in meters */
  position: [number, number, number];

  /** Rotation angle around Y-axis in radians (default: 0) */
  rotation?: number;
}> = ({ position, rotation = 0 }) => (
    <group position={position} rotation={[0, rotation, 0]}>
        {/* Desk */}
        <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[2.5, 0.8, 1.2]} />
            <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.6} />
        </mesh>

        {/* Monitor Array (3 screens) */}
        {[-0.7, 0, 0.7].map((xOffset, i) => (
            <group key={i} position={[xOffset, 1.2, -0.3]}>
                {/* Monitor Stand */}
                <mesh position={[0, -0.3, 0]}>
                    <cylinderGeometry args={[0.05, 0.08, 0.6, 8]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.6} />
                </mesh>

                {/* Screen Frame */}
                <mesh castShadow>
                    <boxGeometry args={[0.6, 0.35, 0.03]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.2} />
                </mesh>

                {/* Active Screen */}
                <mesh position={[0, 0, 0.02]}>
                    <planeGeometry args={[0.55, 0.31]} />
                    <meshStandardMaterial
                        color={i === 1 ? "#3b82f6" : "#0ea5e9"}
                        emissive={i === 1 ? "#3b82f6" : "#0ea5e9"}
                        emissiveIntensity={0.8}
                        toneMapped={false}
                    />
                </mesh>

                {/* Screen Glow */}
                <pointLight
                    position={[0, 0, 0.1]}
                    color={i === 1 ? "#3b82f6" : "#0ea5e9"}
                    intensity={0.3}
                    distance={2}
                />
            </group>
        ))}

        {/* Keyboard */}
        <mesh position={[0, 0.82, 0.3]} castShadow>
            <boxGeometry args={[0.45, 0.02, 0.15]} />
            <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Mouse */}
        <mesh position={[0.5, 0.82, 0.3]} castShadow>
            <boxGeometry args={[0.06, 0.015, 0.09]} />
            <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Office Chair */}
        <group position={[0, 0.25, 0.8]}>
            <mesh>
                <cylinderGeometry args={[0.25, 0.25, 0.5, 16]} />
                <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 0.5, -0.15]}>
                <boxGeometry args={[0.45, 0.6, 0.08]} />
                <meshStandardMaterial color="#475569" />
            </mesh>
        </group>
    </group>
);

/**
 * Large wall-mounted display screen for facility data visualization
 *
 * @remarks
 * Professional-grade display panel for real-time building management data.
 * Features emissive screen surface with wireframe grid overlay simulating
 * active data visualization dashboards.
 *
 * Visual design:
 * - Dark bezel frame (#0f172a) with metallic finish
 * - Active display area with configurable color
 * - Wireframe grid overlay for data visualization effect
 * - Point light creating screen glow ambiance
 * - Configurable size and orientation
 *
 * Common configurations:
 * - Central overview: 6m × 3.5m, green (#059669)
 * - Environmental data: 3m × 2.5m, cyan (#0ea5e9)
 * - Security feeds: 3m × 2.5m, purple (#8b5cf6)
 * - Status bars: 2.5m × 0.8m, various colors
 *
 * Performance:
 * - Emissive materials with tone mapping disabled
 * - Efficient wireframe geometry
 * - Single point light per screen
 *
 * @param props - Screen configuration
 * @param props.position - 3D world position [x, y, z]
 * @param props.width - Screen width in meters
 * @param props.height - Screen height in meters
 * @param props.rotation - 3D rotation [x, y, z] in radians (default: [0,0,0])
 * @param props.color - Display color in hex format (default: "#059669")
 *
 * @example
 * ```tsx
 * // Large central facility overview screen
 * <WallDisplayScreen
 *   position={[0, 2.8, -4.8]}
 *   width={6}
 *   height={3.5}
 *   color="#059669"
 * />
 *
 * // Small status bar screen
 * <WallDisplayScreen
 *   position={[3, 1, -4.8]}
 *   width={2.5}
 *   height={0.8}
 *   color="#22c55e"
 * />
 * ```
 */
export const WallDisplayScreen: React.FC<{
  /** 3D world position [x, y, z] in meters */
  position: [number, number, number];

  /** Screen width in meters */
  width: number;

  /** Screen height in meters */
  height: number;

  /** 3D rotation [x, y, z] in radians (default: [0, 0, 0]) */
  rotation?: [number, number, number];

  /** Display color in hex format (default: "#059669" green) */
  color?: string;
}> = ({
    position,
    width,
    height,
    rotation = [0, 0, 0],
    color = "#059669"
}) => (
    <group position={position} rotation={rotation}>
        {/* Screen Bezel */}
        <mesh castShadow>
            <boxGeometry args={[width, height, 0.1]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Active Display */}
        <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[width - 0.2, height - 0.2]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.6}
                toneMapped={false}
            />
        </mesh>

        {/* Display Data Grid Visualization */}
        <mesh position={[0, 0, 0.07]}>
            <planeGeometry args={[width - 0.3, height - 0.3]} />
            <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
        </mesh>

        {/* Screen Glow */}
        <pointLight
            position={[0, 0, 0.3]}
            color={color}
            intensity={1}
            distance={5}
        />
    </group>
);

/**
 * 19-inch server rack with multiple rack-mounted units
 *
 * @remarks
 * Standard IT equipment rack housing multiple server units with status LEDs,
 * ventilation, and cooling systems. Visualizes active data center infrastructure
 * for the building management system.
 *
 * Rack specifications:
 * - Dimensions: 1.0m width × 4.0m height × 1.2m depth
 * - 8 server units stacked vertically
 * - Each unit: 0.9m × 0.4m × 1.1m
 * - Status LED per unit (green/blue/yellow)
 * - Front panel ventilation grilles
 * - Cooling fan glow effect (blue light)
 *
 * Status LED patterns:
 * - Green (#22c55e): Normal operation (units 0, 3, 6)
 * - Blue (#3b82f6): Data transfer (units 1, 4, 7)
 * - Yellow (#eab308): Warning/maintenance (units 2, 5)
 *
 * Visual effects:
 * - Metallic rack frame with reflective materials
 * - Individual server unit emissive panels
 * - Status LEDs with high emissive intensity
 * - Blue cooling fan point light
 *
 * @param props - Rack configuration
 * @param props.position - 3D world position [x, y, z]
 *
 * @example
 * ```tsx
 * // Server room with dual rack configuration
 * <ServerRack position={[2.5, 2, 1.5]} />
 * <ServerRack position={[2.5, 2, -1.5]} />
 * ```
 */
export const ServerRack: React.FC<{
  /** 3D world position [x, y, z] in meters */
  position: [number, number, number];
}> = ({ position }) => (
    <group position={position}>
        {/* Rack Frame */}
        <mesh castShadow>
            <boxGeometry args={[1, 4, 1.2]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Server Units (stacked) */}
        {Array.from({length: 8}).map((_, i) => (
            <group key={i} position={[0, -1.7 + i * 0.45, 0.5]}>
                {/* Server Slot */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.9, 0.4, 1.1]} />
                    <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
                </mesh>

                {/* Status LEDs */}
                <mesh position={[-0.35, 0, 0.56]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshStandardMaterial
                        color={i % 3 === 0 ? "#22c55e" : i % 3 === 1 ? "#3b82f6" : "#eab308"}
                        emissive={i % 3 === 0 ? "#22c55e" : i % 3 === 1 ? "#3b82f6" : "#eab308"}
                        emissiveIntensity={1}
                        toneMapped={false}
                    />
                </mesh>

                {/* Front Panel Vents */}
                <mesh position={[0, 0, 0.56]}>
                    <planeGeometry args={[0.7, 0.3]} />
                    <meshBasicMaterial color="#0f172a" transparent opacity={0.8} />
                </mesh>
            </group>
        ))}

        {/* Cooling Fan Glow */}
        <pointLight position={[0, 0, 0.8]} color="#3b82f6" intensity={0.2} distance={2} />
    </group>
);

/**
 * Complete Building Management System control room with full infrastructure
 *
 * @remarks
 * Comprehensive 3D visualization of a professional BMS control center including
 * operator workstations, display walls, server infrastructure, and environmental
 * systems. Designed for real-time facility monitoring and system control.
 *
 * Room layout:
 * - Dimensions: 15m width × 10m depth × 5m height
 * - Front: Glass partition wall for visibility
 * - Back: Main display wall with multiple screens
 * - Sides: Solid walls with structural elements
 * - Floor: Raised technical floor with cable management
 *
 * Major components:
 * - 4 operator workstations (2 front, 2 back rows)
 * - 1 large central display (6m × 3.5m)
 * - 2 side displays (3m × 2.5m each)
 * - 3 status bar screens (2.5m × 0.8m each)
 * - Server room section (right side)
 * - 2 server racks with 8 units each
 * - 6 overhead lights (2 rows of 3)
 * - Cable management trays
 * - Security camera
 * - Emergency exit signage
 *
 * Display wall configuration:
 * - Central: Green (#059669) - Facility overview
 * - Left: Cyan (#0ea5e9) - Environmental data
 * - Right: Purple (#8b5cf6) - Security camera feeds
 * - Bottom left: Yellow (#eab308) - Alerts/warnings
 * - Bottom center: Green (#22c55e) - System status
 * - Bottom right: Red (#ef4444) - Critical events
 *
 * Server room features:
 * - Glass partition separating from control room
 * - Dual server racks with status LEDs
 * - Access door (1m wide)
 * - Cooling unit at rear
 * - Red warning light for server area
 *
 * Lighting system:
 * - 6 overhead point lights (1.5 intensity, 8m distance)
 * - Warm white color (#f1f5f9)
 * - Ceiling-mounted fixtures
 * - Even distribution across room
 *
 * Safety features:
 * - Emergency exit sign (green, emissive)
 * - Security camera with PTZ mount
 * - Glass walls for visibility
 * - Proper egress marking
 *
 * @param props - Control room configuration
 * @param props.position - Room origin position [x, y, z]
 *
 * @example
 * ```tsx
 * // Standard control room at facility Level 2
 * <BMSControlRoom position={[0, 40, 0]} />
 *
 * // Multiple control rooms at different levels
 * <BMSControlRoom position={[50, 0, 50]} />
 * <BMSControlRoom position={[-50, 20, -50]} />
 * ```
 */
export const BMSControlRoom: React.FC<{
  /** Control room origin position [x, y, z] in meters */
  position: [number, number, number];
}> = ({ position }) => {
    const roomWidth = 15;
    const roomDepth = 10;

    return (
        <group position={position}>
            {/* Floor Base */}
            <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[roomWidth, roomDepth]} />
                <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.1} />
            </mesh>

            {/* Raised Floor Panels (technical floor) */}
            {Array.from({length: 6}).map((_, i) => (
                <mesh key={i} rotation={[-Math.PI/2, 0, 0]} position={[-6 + i * 2.5, 0.01, -3]} receiveShadow>
                    <planeGeometry args={[2.4, 2.4]} />
                    <meshStandardMaterial color="#334155" roughness={0.2} />
                </mesh>
            ))}

            {/* Back Wall */}
            <mesh position={[0, 2.5, -roomDepth/2]} receiveShadow>
                <boxGeometry args={[roomWidth, 5, 0.3]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>

            {/* Side Walls */}
            <mesh position={[-roomWidth/2, 2.5, 0]} receiveShadow>
                <boxGeometry args={[0.3, 5, roomDepth]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[roomWidth/2, 2.5, 0]} receiveShadow>
                <boxGeometry args={[0.3, 5, roomDepth]} />
                <meshStandardMaterial color="#0f172a" />
            </mesh>

            {/* Glass Front Wall/Partition */}
            <mesh position={[0, 2.5, roomDepth/2]} receiveShadow>
                <boxGeometry args={[roomWidth, 5, 0.1]} />
                <meshPhysicalMaterial
                    color="#94a3b8"
                    transmission={0.7}
                    transparent
                    opacity={0.3}
                    roughness={0.1}
                    metalness={0.1}
                    thickness={0.5}
                />
            </mesh>

            {/* Main Control Wall - Large Display Screens */}
            <group position={[0, 2.8, -roomDepth/2 + 0.2]}>
                {/* Central Large Screen - Facility Overview */}
                <WallDisplayScreen
                    position={[0, 0.5, 0]}
                    width={6}
                    height={3.5}
                    color="#059669"
                />

                {/* Left Side Screen - Environmental Data */}
                <WallDisplayScreen
                    position={[-4.5, 0.5, 0]}
                    width={3}
                    height={2.5}
                    color="#0ea5e9"
                />

                {/* Right Side Screen - Security Feeds */}
                <WallDisplayScreen
                    position={[4.5, 0.5, 0]}
                    width={3}
                    height={2.5}
                    color="#8b5cf6"
                />

                {/* Bottom Status Bar Screens */}
                <WallDisplayScreen
                    position={[-3, -1.5, 0]}
                    width={2.5}
                    height={0.8}
                    color="#eab308"
                />
                <WallDisplayScreen
                    position={[0, -1.5, 0]}
                    width={2.5}
                    height={0.8}
                    color="#22c55e"
                />
                <WallDisplayScreen
                    position={[3, -1.5, 0]}
                    width={2.5}
                    height={0.8}
                    color="#ef4444"
                />
            </group>

            {/* Operator Workstations (4 stations in 2 rows) */}
            <group position={[0, 0, 1]}>
                {/* Front Row */}
                <OperatorWorkstation position={[-3, 0, 0]} rotation={0} />
                <OperatorWorkstation position={[3, 0, 0]} rotation={0} />

                {/* Back Row */}
                <OperatorWorkstation position={[-3, 0, -2.5]} rotation={0} />
                <OperatorWorkstation position={[3, 0, -2.5]} rotation={0} />
            </group>

            {/* Server Room Section (Right Side) */}
            <group position={[5.5, 0, -2]}>
                {/* Server Room Partition */}
                <mesh position={[1.5, 2.5, 0]} receiveShadow>
                    <boxGeometry args={[0.1, 5, 6]} />
                    <meshStandardMaterial color="#334155" transparent opacity={0.8} />
                </mesh>

                {/* Server Racks */}
                <ServerRack position={[2.5, 2, 1.5]} />
                <ServerRack position={[2.5, 2, -1.5]} />

                {/* Server Room Door */}
                <mesh position={[1.5, 1.2, 2.5]} castShadow>
                    <boxGeometry args={[0.12, 2.4, 1]} />
                    <meshStandardMaterial color="#475569" metalness={0.6} />
                </mesh>

                {/* Server Room Cooling Unit */}
                <mesh position={[2.5, 0.8, -2.8]} castShadow>
                    <boxGeometry args={[1, 1.6, 0.5]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>

                {/* Server Room Warning Light */}
                <pointLight position={[1.5, 4.5, 0]} color="#ef4444" intensity={0.5} distance={4} />
            </group>

            {/* Overhead Lighting */}
            {Array.from({length: 6}).map((_, i) => (
                <group key={`light-${i}`} position={[-5 + (i % 3) * 5, 4.8, -2 + Math.floor(i / 3) * 4]}>
                    <pointLight intensity={1.5} distance={8} decay={2} color="#f1f5f9" />
                    <mesh>
                        <cylinderGeometry args={[0.4, 0.4, 0.1]} />
                        <meshBasicMaterial color="#f1f5f9" />
                    </mesh>
                </group>
            ))}

            {/* Cable Management Trays (overhead) */}
            <mesh position={[0, 4.5, -2]} castShadow>
                <boxGeometry args={[12, 0.1, 0.3]} />
                <meshStandardMaterial color="#334155" metalness={0.5} />
            </mesh>

            {/* Emergency Exit Sign */}
            <group position={[roomWidth/2 - 0.5, 4.2, roomDepth/2 - 0.2]}>
                <mesh>
                    <boxGeometry args={[0.6, 0.3, 0.05]} />
                    <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
                </mesh>
                <pointLight color="#22c55e" intensity={0.3} distance={3} />
            </group>

            {/* Security Camera */}
            <group position={[roomWidth/2 - 1, 4.5, -roomDepth/2 + 1]}>
                <mesh rotation={[0, -Math.PI/4, -Math.PI/6]}>
                    <boxGeometry args={[0.15, 0.15, 0.25]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[0.05, 0, -0.15]} rotation={[0, -Math.PI/4, -Math.PI/6]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.1]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>
            </group>
        </group>
    );
};
